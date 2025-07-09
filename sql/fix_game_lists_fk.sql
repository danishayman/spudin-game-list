-- Fix the foreign key constraint in game_lists table
-- Drop the existing constraint that references auth.users directly
ALTER TABLE public.game_lists
DROP CONSTRAINT IF EXISTS game_lists_user_id_fkey;

-- Add a new constraint that references profiles table instead
ALTER TABLE public.game_lists
ADD CONSTRAINT game_lists_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- The cascade behavior is maintained to ensure when a profile is deleted,
-- all associated game list entries are also deleted 