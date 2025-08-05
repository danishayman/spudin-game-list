-- Check what triggers and functions are currently active in the database
-- Run this to see what's actually running in your database

-- Check current triggers on auth.users
SELECT 
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
    AND event_object_schema = 'auth';

-- Check current handle_new_user function definition
SELECT routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user' 
    AND routine_schema = 'public';

-- Check if there are multiple versions of the function
SELECT routine_name, routine_schema, created 
FROM information_schema.routines 
WHERE routine_name LIKE '%handle_new_user%';