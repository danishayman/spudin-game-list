-- FIX: Update trigger to use correct Twitch field names
-- Based on actual Twitch OAuth data: nickname, name, slug, etc.

-- Step 1: Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 2: Create corrected function using actual Twitch field names
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
BEGIN
    -- Enhanced logging to see exactly what Twitch provides
    RAISE NOTICE 'Creating profile for user %, provider: %', new.id, new.raw_app_meta_data->>'provider';
    RAISE NOTICE 'Available metadata fields: %', (SELECT array_agg(key) FROM jsonb_each(new.raw_user_meta_data));
    RAISE NOTICE 'nickname: %, name: %, slug: %, display_name: %',
        new.raw_user_meta_data->>'nickname',
        new.raw_user_meta_data->>'name',
        new.raw_user_meta_data->>'slug',
        new.raw_user_meta_data->>'display_name';

    INSERT INTO public.profiles (id, avatar_url, email, username)
    VALUES (
        new.id,
        -- Avatar: Twitch uses 'picture', Google uses 'avatar_url'
        COALESCE(
            new.raw_user_meta_data->>'picture',
            new.raw_user_meta_data->>'avatar_url'
        ),
        COALESCE(new.email, new.raw_user_meta_data->>'email'),
        -- USERNAME: Use the actual fields Twitch provides
        COALESCE(
            new.raw_user_meta_data->>'nickname',                    -- Twitch nickname (usually the username)
            new.raw_user_meta_data->>'name',                        -- Twitch name field
            new.raw_user_meta_data->>'slug',                        -- Twitch slug (URL-friendly username)
            new.raw_user_meta_data->>'display_name',                -- Twitch display name (fallback)
            new.raw_user_meta_data->>'preferred_username',          -- OIDC preferred username (if available)
            new.raw_user_meta_data->>'login',                       -- Twitch login (if available)
            replace(split_part(COALESCE(new.email, new.raw_user_meta_data->>'email'), '@', 1), '.', '_')     -- Email fallback ONLY if nothing else
        )
    )
    ON CONFLICT (id) DO UPDATE SET
        avatar_url = COALESCE(
            new.raw_user_meta_data->>'picture',
            new.raw_user_meta_data->>'avatar_url',
            profiles.avatar_url
        ),
        username = COALESCE(
            new.raw_user_meta_data->>'nickname',                    -- Twitch nickname (usually the username)
            new.raw_user_meta_data->>'name',                        -- Twitch name field
            new.raw_user_meta_data->>'slug',                        -- Twitch slug (URL-friendly username)
            new.raw_user_meta_data->>'display_name',                -- Twitch display name (fallback)
            new.raw_user_meta_data->>'preferred_username',          -- OIDC preferred username (if available)
            new.raw_user_meta_data->>'login',                       -- Twitch login (if available)
            profiles.username  -- Keep existing if no better option
        ),
        email = COALESCE(new.email, new.raw_user_meta_data->>'email', profiles.email);
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Update existing users who have wrong usernames (email-based)
-- This will fix users like 'lupinaiman' to use their actual Twitch username
UPDATE public.profiles
SET username = COALESCE(
    (SELECT raw_user_meta_data->>'nickname' FROM auth.users WHERE id = profiles.id),
    (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = profiles.id),
    (SELECT raw_user_meta_data->>'slug' FROM auth.users WHERE id = profiles.id),
    (SELECT raw_user_meta_data->>'display_name' FROM auth.users WHERE id = profiles.id),
    (SELECT raw_user_meta_data->>'preferred_username' FROM auth.users WHERE id = profiles.id),
    (SELECT raw_user_meta_data->>'login' FROM auth.users WHERE id = profiles.id),
    username  -- Keep existing if no better option
)
WHERE EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = profiles.id 
    AND (
        -- Only update if we have Twitch data available
        raw_user_meta_data->>'nickname' IS NOT NULL
        OR raw_user_meta_data->>'name' IS NOT NULL
        OR raw_user_meta_data->>'slug' IS NOT NULL
    )
    AND (
        -- And the current username looks like an email prefix
        profiles.username ~ '^[a-zA-Z0-9._-]+$'  -- Simple alphanumeric + basic chars (likely email-derived)
        AND NOT EXISTS (
            SELECT 1 FROM auth.users u2 
            WHERE u2.id = profiles.id 
            AND (
                u2.raw_user_meta_data->>'nickname' = profiles.username  -- Don't change if it's already correct
                OR u2.raw_user_meta_data->>'name' = profiles.username
                OR u2.raw_user_meta_data->>'slug' = profiles.username
            )
        )
    )
);

-- Step 5: Show what was updated (for verification)
SELECT 
    'Updated profiles' as action,
    COUNT(*) as count
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.raw_user_meta_data->>'nickname' IS NOT NULL 
   OR u.raw_user_meta_data->>'name' IS NOT NULL
   OR u.raw_user_meta_data->>'slug' IS NOT NULL;

-- Step 6: Show current state for debugging
SELECT 
    p.id,
    p.username as current_username,
    p.email,
    u.raw_user_meta_data->>'nickname' as twitch_nickname,
    u.raw_user_meta_data->>'name' as twitch_name,
    u.raw_user_meta_data->>'slug' as twitch_slug,
    u.raw_user_meta_data->>'display_name' as twitch_display_name,
    u.raw_user_meta_data->>'preferred_username' as preferred_username,
    u.raw_user_meta_data->>'login' as twitch_login
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.raw_user_meta_data IS NOT NULL
ORDER BY u.created_at DESC
LIMIT 5; 