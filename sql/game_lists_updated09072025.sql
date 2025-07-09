-- Create a games table to store game information
CREATE TABLE IF NOT EXISTS public.games (
    id INT PRIMARY KEY, -- RAWG game ID
    name TEXT NOT NULL,
    background_image TEXT,
    released DATE,
    rating FLOAT
);

-- Create a game_lists table to track user game collections
CREATE TABLE IF NOT EXISTS public.game_lists (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    game_id INT REFERENCES public.games(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('Finished', 'Playing', 'Dropped', 'Want', 'On-hold')),
    rating DECIMAL(3,1) CHECK (rating BETWEEN 0 AND 10),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, game_id)
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_game_lists_user_id ON public.game_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_game_lists_game_id ON public.game_lists(game_id);
CREATE INDEX IF NOT EXISTS idx_game_lists_status ON public.game_lists(status);

-- Enable Row Level Security
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_lists ENABLE ROW LEVEL SECURITY;

-- Create policies for games table
CREATE POLICY "Anyone can read games" 
ON public.games FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert games" 
ON public.games FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create policies for game_lists table
CREATE POLICY "Users can read their own game lists" 
ON public.game_lists FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own game lists" 
ON public.game_lists FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game lists" 
ON public.game_lists FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own game lists" 
ON public.game_lists FOR DELETE 
TO authenticated
USING (auth.uid() = user_id); 