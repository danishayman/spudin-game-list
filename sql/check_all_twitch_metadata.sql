-- Check what Twitch metadata is actually being stored
-- This will show us the complete raw_user_meta_data structure

SELECT 
    u.id,
    u.email,
    u.provider,
    u.raw_user_meta_data,
    p.username as current_username
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.raw_user_meta_data IS NOT NULL
ORDER BY u.created_at DESC
LIMIT 3;