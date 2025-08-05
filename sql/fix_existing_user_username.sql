-- Fix the existing user's username to use their actual Twitch display name
-- This updates the specific user from the screenshots

-- First, let's see what Twitch data is available for this user
SELECT 
    u.id,
    u.email,
    p.username as current_username,
    u.raw_user_meta_data->>'display_name' as twitch_display_name,
    u.raw_user_meta_data->>'preferred_username' as twitch_preferred_username,
    u.raw_user_meta_data->>'login' as twitch_login,
    u.raw_user_meta_data as full_metadata
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'lupinaiman@gmail.com';

-- Update this specific user's username to use their Twitch display name
UPDATE public.profiles 
SET username = (
    SELECT COALESCE(
        raw_user_meta_data->>'display_name',     -- Twitch display name (lupokss)
        raw_user_meta_data->>'preferred_username',
        raw_user_meta_data->>'login',
        'lupinaiman'  -- fallback to current if something goes wrong
    )
    FROM auth.users 
    WHERE id = profiles.id
)
WHERE id = (
    SELECT id FROM auth.users WHERE email = 'lupinaiman@gmail.com'
);

-- Verify the update worked
SELECT 
    p.username as updated_username,
    p.email,
    u.raw_user_meta_data->>'display_name' as twitch_display_name
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'lupinaiman@gmail.com';