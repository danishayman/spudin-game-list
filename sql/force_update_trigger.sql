-- FORCE UPDATE: Completely replace the handle_new_user trigger with correct Twitch logic
-- This ensures we override any existing old triggers

-- Step 1: Drop ALL existing triggers and functions related to profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 2: Create the corrected function with proper Twitch username extraction
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
BEGIN
    -- Log the metadata for debugging (optional - remove in production)
    RAISE NOTICE 'Creating profile for user %, login: %, display_name: %, email: %',
        new.id,
        new.raw_user_meta_data->>'login',
        new.raw_user_meta_data->>'display_name',
        COALESCE(new.email, new.raw_user_meta_data->>'email');

    INSERT INTO public.profiles (id, avatar_url, email, username)
    VALUES (
        new.id,
        -- Avatar: Twitch uses 'profile_image_url', Google uses 'avatar_url'
        COALESCE(
            new.raw_user_meta_data->>'profile_image_url',
            new.raw_user_meta_data->>'avatar_url'
        ),
        COALESCE(new.email, new.raw_user_meta_data->>'email'),
        -- USERNAME: This is the critical fix - prioritize Twitch 'preferred_username' field from OIDC
        COALESCE(
            new.raw_user_meta_data->>'preferred_username',           -- Twitch username from OIDC (actual username like "cooluser123")
            new.raw_user_meta_data->>'login',                        -- Fallback: Twitch login (if available)
            new.raw_user_meta_data->>'username',                     -- Generic username field
            new.raw_user_meta_data->>'display_name',                 -- Twitch display name (fallback)
            replace(split_part(COALESCE(new.email, new.raw_user_meta_data->>'email'), '@', 1), '.', '_')     -- Email fallback ONLY if nothing else
        )
    )
    ON CONFLICT (id) DO UPDATE SET
        avatar_url = COALESCE(
            new.raw_user_meta_data->>'profile_image_url',
            new.raw_user_meta_data->>'avatar_url',
            profiles.avatar_url
        ),
        username = COALESCE(
            new.raw_user_meta_data->>'preferred_username',           -- Twitch username from OIDC (actual username)
            new.raw_user_meta_data->>'login',                        -- Fallback: Twitch login (if available)
            new.raw_user_meta_data->>'username',
            new.raw_user_meta_data->>'display_name',
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
    (SELECT raw_user_meta_data->>'preferred_username' FROM auth.users WHERE id = profiles.id),
    (SELECT raw_user_meta_data->>'login' FROM auth.users WHERE id = profiles.id),
    (SELECT raw_user_meta_data->>'username' FROM auth.users WHERE id = profiles.id),
    (SELECT raw_user_meta_data->>'display_name' FROM auth.users WHERE id = profiles.id),
    username  -- Keep existing if no better option
)
WHERE EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = profiles.id 
    AND (
        -- Only update if we have Twitch data available
        raw_user_meta_data->>'preferred_username' IS NOT NULL
        OR raw_user_meta_data->>'login' IS NOT NULL
    )
    AND (
        -- And the current username looks like an email prefix
        profiles.username ~ '^[a-zA-Z0-9._-]+$'  -- Simple alphanumeric + basic chars (likely email-derived)
                    AND NOT EXISTS (
                SELECT 1 FROM auth.users u2 
                WHERE u2.id = profiles.id 
                AND (
                    u2.raw_user_meta_data->>'preferred_username' = profiles.username  -- Don't change if it's already correct
                    OR u2.raw_user_meta_data->>'login' = profiles.username
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
WHERE u.raw_user_meta_data->>'preferred_username' IS NOT NULL 
   OR u.raw_user_meta_data->>'login' IS NOT NULL;

-- Step 6: Show current state for debugging
SELECT 
    p.id,
    p.username as current_username,
    p.email,
    u.raw_user_meta_data->>'preferred_username' as twitch_username,
    u.raw_user_meta_data->>'login' as twitch_login,
    u.raw_user_meta_data->>'display_name' as twitch_display_name,
    u.raw_user_meta_data->>'preferred_username' as preferred_username
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.raw_user_meta_data IS NOT NULL
ORDER BY u.created_at DESC
LIMIT 5;