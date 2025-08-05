-- Quick fix to update your current profile to use 'lupokss' as username
-- Run this to immediately fix your profile URL and username display

-- First, let's see your current profile data
SELECT 
    id,
    username,
    full_name,
    avatar_url,
    email
FROM public.profiles 
WHERE email LIKE '%lupinaiman%' OR username LIKE '%lupinaiman%' OR username LIKE '%lupokss%';

-- Update your profile to use 'lupokss' as the username
-- Replace 'your-email@example.com' with your actual email if the above query shows a different email
UPDATE public.profiles 
SET username = 'lupokss'
WHERE username = 'lupinaiman' OR email LIKE '%lupinaiman%';

-- Verify the update
SELECT 
    id,
    username,
    full_name,
    avatar_url,
    email
FROM public.profiles 
WHERE username = 'lupokss';

-- Alternative: If you know your user ID, you can update directly:
-- UPDATE public.profiles 
-- SET username = 'lupokss'
-- WHERE id = 'your-user-id-here';