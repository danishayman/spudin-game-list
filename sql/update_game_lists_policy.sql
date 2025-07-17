-- Add a policy to allow reading all game list entries when viewing game details
CREATE POLICY "Anyone can read all game lists for a game" 
ON public.game_lists FOR SELECT 
USING (true);

-- This policy allows public access to all game lists
-- This enables:
-- 1. Public profile pages to show user game collections
-- 2. Game detail pages to show who has played/rated a game
-- 3. Review sections to show user game status alongside reviews

-- You may want to drop the old policy if it's too restrictive
-- DROP POLICY "Users can read their own game lists" ON public.game_lists; 