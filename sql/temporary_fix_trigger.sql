-- Temporary fix: Update trigger to use display_name as the primary source
-- Since Twitch is providing display_name but not preferred_username

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
BEGIN
    -- Enhanced logging to see exactly what Twitch provides
    RAISE NOTICE 'Creating profile for user %, provider: %', new.id, new.raw_app_meta_data->>'provider';
    RAISE NOTICE 'Available metadata fields: %', (SELECT array_agg(key) FROM jsonb_each(new.raw_user_meta_data));
    RAISE NOTICE 'preferred_username: %, login: %, display_name: %, username: %',
        new.raw_user_meta_data->>'preferred_username',
        new.raw_user_meta_data->>'login',
        new.raw_user_meta_data->>'display_name',
        new.raw_user_meta_data->>'username';

    INSERT INTO public.profiles (id, avatar_url, email, username)
    VALUES (
        new.id,
        -- Avatar: Twitch uses 'profile_image_url', Google uses 'avatar_url'
        COALESCE(
            new.raw_user_meta_data->>'profile_image_url',
            new.raw_user_meta_data->>'avatar_url'
        ),
        COALESCE(new.email, new.raw_user_meta_data->>'email'),
        -- USERNAME: Use display_name as primary since that's what Twitch actually provides
        COALESCE(
            new.raw_user_meta_data->>'display_name',                 -- Twitch display name (what we actually get: "lupokss")
            new.raw_user_meta_data->>'preferred_username',           -- OIDC preferred username (might be null)
            new.raw_user_meta_data->>'login',                        -- Twitch login (might be null)
            new.raw_user_meta_data->>'username',                     -- Generic username field
            replace(split_part(COALESCE(new.email, new.raw_user_meta_data->>'email'), '@', 1), '.', '_')     -- Email fallback ONLY if nothing else
        )
    )
    ON CONFLICT (id) DO UPDATE SET
        avatar_url = COALESCE(
            new.raw_user_meta_data->>'profile_image_url',
            new.raw_user_meta_data->>'avatar_url',
            profiles.avatar_url
        ),
        username = COALESCE(
            new.raw_user_meta_data->>'display_name',                 -- Twitch display name (primary)
            new.raw_user_meta_data->>'preferred_username',           -- OIDC preferred username
            new.raw_user_meta_data->>'login',                        -- Twitch login
            new.raw_user_meta_data->>'username',
            profiles.username  -- Keep existing if no better option
        ),
        email = COALESCE(new.email, new.raw_user_meta_data->>'email', profiles.email);
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing users to use display_name
UPDATE public.profiles
SET username = COALESCE(
    (SELECT raw_user_meta_data->>'display_name' FROM auth.users WHERE id = profiles.id),
    (SELECT raw_user_meta_data->>'preferred_username' FROM auth.users WHERE id = profiles.id),
    (SELECT raw_user_meta_data->>'login' FROM auth.users WHERE id = profiles.id),
    username  -- Keep existing if no better option
)
WHERE EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = profiles.id 
    AND auth.users.raw_user_meta_data->>'display_name' IS NOT NULL
    AND auth.users.raw_user_meta_data->>'display_name' != profiles.username
);