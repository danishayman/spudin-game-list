
BEGIN
  DELETE FROM public.game_cache 
  WHERE last_updated < NOW() - INTERVAL '7 days';
END;
