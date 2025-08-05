-- Debug script to check what Twitch fields are actually available
-- This will help us understand what data Twitch is providing

-- Check what fields ARE available for Twitch users
SELECT DISTINCT
    jsonb_object_keys(raw_user_meta_data) as available_fields
FROM auth.users 
WHERE raw_app_meta_data->>'provider' = 'twitch'
ORDER BY available_fields;

-- Show detailed data for the most recent Twitch users
SELECT 
    u.id,
    u.email,
    u.raw_app_meta_data->>'provider' as provider,
    u.raw_user_meta_data->>'nickname' as nickname,
    u.raw_user_meta_data->>'name' as name_field,
    u.raw_user_meta_data->>'slug' as slug,
    u.raw_user_meta_data->>'display_name' as display_name,
    u.raw_user_meta_data->>'preferred_username' as preferred_username,
    u.raw_user_meta_data->>'login' as login_field,
    u.raw_user_meta_data->>'username' as username_field,
    u.raw_user_meta_data->>'picture' as picture,
    u.raw_user_meta_data->>'avatar_url' as avatar_url,
    p.username as profile_username,
    u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.raw_app_meta_data->>'provider' = 'twitch'
ORDER BY u.created_at DESC
LIMIT 5;

-- Check which fields have actual values (not NULL)
SELECT 
    'nickname' as field_name,
    COUNT(*) as count_with_value
FROM auth.users 
WHERE raw_app_meta_data->>'provider' = 'twitch'
  AND raw_user_meta_data->>'nickname' IS NOT NULL

UNION ALL

SELECT 
    'name' as field_name,
    COUNT(*) as count_with_value
FROM auth.users 
WHERE raw_app_meta_data->>'provider' = 'twitch'
  AND raw_user_meta_data->>'name' IS NOT NULL

UNION ALL

SELECT 
    'slug' as field_name,
    COUNT(*) as count_with_value
FROM auth.users 
WHERE raw_app_meta_data->>'provider' = 'twitch'
  AND raw_user_meta_data->>'slug' IS NOT NULL

UNION ALL

SELECT 
    'display_name' as field_name,
    COUNT(*) as count_with_value
FROM auth.users 
WHERE raw_app_meta_data->>'provider' = 'twitch'
  AND raw_user_meta_data->>'display_name' IS NOT NULL

UNION ALL

SELECT 
    'preferred_username' as field_name,
    COUNT(*) as count_with_value
FROM auth.users 
WHERE raw_app_meta_data->>'provider' = 'twitch'
  AND raw_user_meta_data->>'preferred_username' IS NOT NULL

UNION ALL

SELECT 
    'login' as field_name,
    COUNT(*) as count_with_value
FROM auth.users 
WHERE raw_app_meta_data->>'provider' = 'twitch'
  AND raw_user_meta_data->>'login' IS NOT NULL

ORDER BY count_with_value DESC; 