-- Add username column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'username'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN username text;
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
  END IF;
END $$;

-- Update existing profiles with a username derived from their email
UPDATE public.profiles
SET username = replace(split_part(email, '@', 1), '.', '_')
WHERE username IS NULL;

-- Make username NOT NULL after all existing rows have been updated
ALTER TABLE public.profiles ALTER COLUMN username SET NOT NULL; 