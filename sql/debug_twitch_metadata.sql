-- Debug script to see what Twitch metadata is available
-- Run this to check what data Twitch OAuth provides

SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'login' as twitch_login,
    u.raw_user_meta_data->>'display_name' as twitch_display_name,
    u.raw_user_meta_data->>'preferred_username' as preferred_username,
    u.raw_user_meta_data->>'username' as username,
    u.raw_user_meta_data->>'email' as metadata_email,
    u.raw_user_meta_data->>'profile_image_url' as twitch_avatar,
    p.username as current_username,
    u.raw_user_meta_data as full_metadata
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.raw_user_meta_data IS NOT NULL
ORDER BY u.created_at DESC
LIMIT 5;