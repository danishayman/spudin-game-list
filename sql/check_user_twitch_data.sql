-- Check what Twitch metadata is available for the lupinaiman user
-- This will help us understand what fields Twitch is providing

SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'display_name' as display_name,
    u.raw_user_meta_data->>'preferred_username' as preferred_username,
    u.raw_user_meta_data->>'login' as login_field,
    u.raw_user_meta_data->>'username' as username_field,
    u.raw_user_meta_data->>'name' as name_field,
    p.username as current_profile_username,
    u.raw_user_meta_data as full_raw_metadata
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'lupinaiman@gmail.com';