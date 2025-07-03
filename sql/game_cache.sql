-- Create a table to cache RAWG API responses
CREATE TABLE IF NOT EXISTS public.game_cache (
  id SERIAL PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL,
  cache_type TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add an index on the cache_key for faster lookups
CREATE INDEX IF NOT EXISTS idx_game_cache_cache_key ON public.game_cache(cache_key);

-- Add an index on the cache_type for filtering by type
CREATE INDEX IF NOT EXISTS idx_game_cache_cache_type ON public.game_cache(cache_type);

-- Add an index on last_updated for expiration checks
CREATE INDEX IF NOT EXISTS idx_game_cache_last_updated ON public.game_cache(last_updated);

-- Enable RLS
ALTER TABLE public.game_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for access
CREATE POLICY "Anyone can read game cache" 
ON public.game_cache FOR SELECT 
USING (true);

-- Only allow service role to insert/update cache
CREATE POLICY "Service role can insert game cache" 
ON public.game_cache FOR INSERT 
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update game cache" 
ON public.game_cache FOR UPDATE 
TO service_role
USING (true);

-- Function to clean up expired cache entries (older than 7 days)
CREATE OR REPLACE FUNCTION cleanup_expired_game_cache() 
RETURNS void AS $$
BEGIN
  DELETE FROM public.game_cache 
  WHERE last_updated < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- You can create a cron job to run this function periodically
-- This requires pg_cron extension to be enabled
-- COMMENT OUT if you don't have pg_cron or prefer manual cleanup
-- SELECT cron.schedule('0 0 * * *', 'SELECT cleanup_expired_game_cache()'); 