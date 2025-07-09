-- Add genres column to games table as JSONB type
ALTER TABLE IF EXISTS public.games ADD COLUMN IF NOT EXISTS genres JSONB; 