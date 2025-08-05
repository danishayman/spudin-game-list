-- Debug script to check what happens during new user creation
-- This will show us exactly what fields Twitch is providing with the openid scope

-- First, let's see what the current trigger is actually receiving
-- Check the logs from the RAISE NOTICE in your trigger
-- Look for logs like: "Creating profile for user ..."

-- Check what data a new user actually gets from Twitch with openid scope
SELECT 
    u.id,
    u.email,
    u.raw_app_meta_data->>'provider' as provider,
    u.raw_user_meta_data->>'preferred_username' as preferred_username,
    u.raw_user_meta_data->>'login' as login_field,
    u.raw_user_meta_data->>'display_name' as display_name,
    u.raw_user_meta_data->>'username' as username_field,
    u.raw_user_meta_data->>'name' as name_field,
    u.raw_user_meta_data as full_metadata,
    p.username as profile_username
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.raw_app_meta_data->>'provider' = 'twitch'
ORDER BY u.created_at DESC
LIMIT 3;

-- Also check if there are any users where preferred_username IS NOT NULL
SELECT 
    'Users with preferred_username' as status,
    COUNT(*) as count
FROM auth.users 
WHERE raw_user_meta_data->>'preferred_username' IS NOT NULL;

-- Check if there are any users where login IS NOT NULL  
SELECT 
    'Users with login field' as status,
    COUNT(*) as count
FROM auth.users 
WHERE raw_user_meta_data->>'login' IS NOT NULL;

-- Show what fields ARE available for Twitch users
SELECT DISTINCT
    jsonb_object_keys(raw_user_meta_data) as available_fields
FROM auth.users 
WHERE raw_app_meta_data->>'provider' = 'twitch'
ORDER BY available_fields;