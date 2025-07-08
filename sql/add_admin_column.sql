-- Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Create index for faster lookups
CREATE INDEX idx_profiles_is_admin ON profiles(is_admin);

-- Comment explaining the purpose
COMMENT ON COLUMN profiles.is_admin IS 'Boolean flag indicating if the user has admin privileges'; 