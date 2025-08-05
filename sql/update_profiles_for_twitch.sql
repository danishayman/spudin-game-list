-- Update profile handling to work better with Twitch OAuth
-- Twitch provides different user metadata structure

-- Drop the existing function and recreate it with Twitch-specific handling
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create updated function that handles both Google and Twitch user data
CREATE FUNCTION public.handle_new_user() RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, email, username)
    VALUES (
        new.id,
        -- Twitch uses 'display_name', Google uses 'full_name'
        COALESCE(
            new.raw_user_meta_data->>'display_name',
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'name'
        ),
        -- Twitch uses 'profile_image_url', Google uses 'avatar_url'
        COALESCE(
            new.raw_user_meta_data->>'profile_image_url',
            new.raw_user_meta_data->>'avatar_url'
        ),
        new.raw_user_meta_data->>'email',
        -- For username, prefer the provider username, then email-based fallback
        COALESCE(
            new.raw_user_meta_data->>'preferred_username',  -- Twitch username
            new.raw_user_meta_data->>'username',            -- Generic username
            new.raw_user_meta_data->>'login',               -- Twitch login name
            replace(split_part(new.raw_user_meta_data->>'email', '@', 1), '.', '_')  -- Email fallback
        )
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();