-- Fix Twitch username extraction to use 'login' field instead of 'display_name'
-- The 'login' field is the actual Twitch username, 'display_name' can have spaces/special chars

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, avatar_url, email, username)
    VALUES (
        new.id,
        -- Twitch uses 'profile_image_url', Google uses 'avatar_url'
        COALESCE(
            new.raw_user_meta_data->>'profile_image_url',
            new.raw_user_meta_data->>'avatar_url'
        ),
        new.email,
        -- For username, prioritize Twitch 'login' (actual username) over display_name
        COALESCE(
            new.raw_user_meta_data->>'login',                        -- Twitch login (actual username)
            new.raw_user_meta_data->>'preferred_username',           -- Generic username
            new.raw_user_meta_data->>'username',                     -- Alternative username
            new.raw_user_meta_data->>'display_name',                 -- Twitch display name (fallback)
            replace(split_part(COALESCE(new.email, new.raw_user_meta_data->>'email'), '@', 1), '.', '_')     -- Email-based fallback
        )
    )
    ON CONFLICT (id) DO UPDATE SET
        avatar_url = COALESCE(
            new.raw_user_meta_data->>'profile_image_url',
            new.raw_user_meta_data->>'avatar_url',
            profiles.avatar_url
        ),
        username = COALESCE(
            new.raw_user_meta_data->>'login',                        -- Twitch login (actual username)
            new.raw_user_meta_data->>'preferred_username',
            new.raw_user_meta_data->>'username',
            new.raw_user_meta_data->>'display_name',
            profiles.username
        );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger to ensure it uses the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();

-- Update existing users who have Twitch login data but wrong username
UPDATE public.profiles
SET username = COALESCE(
    (SELECT raw_user_meta_data->>'login' FROM auth.users WHERE id = profiles.id),
    (SELECT raw_user_meta_data->>'preferred_username' FROM auth.users WHERE id = profiles.id),
    (SELECT raw_user_meta_data->>'username' FROM auth.users WHERE id = profiles.id),
    username
)
WHERE EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = profiles.id 
    AND raw_user_meta_data->>'login' IS NOT NULL
    AND profiles.username != auth.users.raw_user_meta_data->>'login'
);