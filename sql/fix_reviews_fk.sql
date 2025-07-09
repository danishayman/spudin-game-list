-- Fix the foreign key constraint in reviews table
-- Drop the existing constraint that references auth.users directly
ALTER TABLE public.reviews
DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;

-- Add a new constraint that references profiles table instead
ALTER TABLE public.reviews
ADD CONSTRAINT reviews_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- Also add foreign key for game_id if it doesn't exist
DO $$
BEGIN
    -- Check if the foreign key constraint exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'reviews_game_id_fkey'
        AND table_name = 'reviews'
    ) THEN
        -- Add the foreign key constraint
        ALTER TABLE public.reviews
        ADD CONSTRAINT reviews_game_id_fkey
        FOREIGN KEY (game_id)
        REFERENCES public.games(id)
        ON DELETE CASCADE;
    END IF;
END
$$; 