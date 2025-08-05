-- Fix existing profiles to use Twitch data and update the trigger
-- This script will:
-- 1. Update the profile creation trigger to handle Twitch data properly
-- 2. Attempt to fix existing profiles if Twitch data is available in auth.users

-- First, let's see what we're working with by checking a sample user
-- (Run this separately first to understand your data structure)
-- SELECT 
--   id,
--   email,
--   raw_user_meta_data,
--   provider
-- FROM auth.users 
-- WHERE email = 'your-email@example.com'; -- Replace with your email

-- Drop the existing function and recreate it with better Twitch support
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create an improved function that handles Twitch data properly
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, email, username)
    VALUES (
        new.id,
        -- For Twitch: use display_name, fallback to other names
        COALESCE(
            new.raw_user_meta_data->>'display_name',
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'name',
            new.raw_user_meta_data->>'preferred_username'
        ),
        -- For Twitch: use profile_image_url, fallback to avatar_url
        COALESCE(
            new.raw_user_meta_data->>'profile_image_url',
            new.raw_user_meta_data->>'avatar_url'
        ),
        new.email,
        -- For Twitch: prefer display_name (actual Twitch username), then login, then fallbacks
        COALESCE(
            new.raw_user_meta_data->>'display_name',             -- Twitch display name (actual username)
            new.raw_user_meta_data->>'login',                    -- Twitch login
            new.raw_user_meta_data->>'preferred_username',       -- Generic username
            new.raw_user_meta_data->>'username',                 -- Alternative username
            replace(split_part(new.email, '@', 1), '.', '_')     -- Email-based fallback
        )
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = COALESCE(
            new.raw_user_meta_data->>'display_name',
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'name',
            new.raw_user_meta_data->>'preferred_username',
            profiles.full_name
        ),
        avatar_url = COALESCE(
            new.raw_user_meta_data->>'profile_image_url',
            new.raw_user_meta_data->>'avatar_url',
            profiles.avatar_url
        ),
        username = COALESCE(
            new.raw_user_meta_data->>'display_name',             -- Twitch display name (actual username)
            new.raw_user_meta_data->>'login',
            new.raw_user_meta_data->>'preferred_username',
            new.raw_user_meta_data->>'username',
            profiles.username
        );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();

-- Update existing profiles with Twitch data if available
-- This will update profiles for users who have Twitch data in their raw_user_meta_data
UPDATE public.profiles
SET 
    full_name = COALESCE(
        (SELECT raw_user_meta_data->>'display_name' FROM auth.users WHERE id = profiles.id),
        (SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = profiles.id),
        (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = profiles.id),
        full_name
    ),
    avatar_url = COALESCE(
        (SELECT raw_user_meta_data->>'profile_image_url' FROM auth.users WHERE id = profiles.id),
        (SELECT raw_user_meta_data->>'avatar_url' FROM auth.users WHERE id = profiles.id),
        avatar_url
    ),
    username = COALESCE(
        (SELECT raw_user_meta_data->>'display_name' FROM auth.users WHERE id = profiles.id),
        (SELECT raw_user_meta_data->>'login' FROM auth.users WHERE id = profiles.id),
        (SELECT raw_user_meta_data->>'preferred_username' FROM auth.users WHERE id = profiles.id),
        username
    )
WHERE EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = profiles.id 
    AND (
        raw_user_meta_data->>'login' IS NOT NULL OR 
        raw_user_meta_data->>'display_name' IS NOT NULL OR
        raw_user_meta_data->>'profile_image_url' IS NOT NULL
    )
);

-- Optional: Check the results (uncomment to see what was updated)
-- SELECT 
--     p.id,
--     p.username,
--     p.full_name,
--     p.avatar_url,
--     u.raw_user_meta_data->>'login' as twitch_username,
--     u.raw_user_meta_data->>'display_name' as twitch_display_name,
--     u.raw_user_meta_data->>'profile_image_url' as twitch_avatar
-- FROM public.profiles p
-- JOIN auth.users u ON p.id = u.id
-- WHERE u.raw_user_meta_data->>'login' IS NOT NULL;