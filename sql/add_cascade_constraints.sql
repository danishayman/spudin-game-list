-- Add ON DELETE CASCADE constraints to prevent orphaned records
-- This ensures that when a profile is deleted, all related records are automatically deleted

-- First, drop existing foreign key constraints
ALTER TABLE public.game_lists DROP CONSTRAINT IF EXISTS game_lists_user_id_fkey;
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;

-- Recreate the constraints with ON DELETE CASCADE
ALTER TABLE public.game_lists 
ADD CONSTRAINT game_lists_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.reviews 
ADD CONSTRAINT reviews_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Also ensure the profiles table cascades from auth.users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
