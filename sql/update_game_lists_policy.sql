-- Add a policy to allow reading all game list entries when viewing game details
CREATE POLICY "Anyone can read all game lists for a game" 
ON public.game_lists FOR SELECT 
USING (true);

-- Alternatively, you could use a more restrictive policy if needed:
-- CREATE POLICY "Anyone can read game lists for public display" 
-- ON public.game_lists FOR SELECT 
-- USING (true);

-- You may want to drop the old policy if it's too restrictive
-- DROP POLICY "Users can read their own game lists" ON public.game_lists; 