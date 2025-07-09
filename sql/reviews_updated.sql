-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_id INTEGER NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Create a unique constraint to prevent multiple reviews by the same user for the same game
  CONSTRAINT unique_user_game_review UNIQUE (user_id, game_id)
);

-- Add RLS policies
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policy for selecting reviews (anyone can read reviews)
CREATE POLICY "Anyone can read reviews"
  ON public.reviews FOR SELECT
  USING (true);

-- Policy for inserting reviews (authenticated users only)
CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating reviews (only the author can update their review)
CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for deleting reviews (only the author can delete their review)
CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS reviews_game_id_idx ON public.reviews(game_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON public.reviews(user_id); 