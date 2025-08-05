
BEGIN
    -- Enhanced logging to see exactly what Twitch provides
    RAISE NOTICE 'Creating profile for user %, provider: %', new.id, new.raw_app_meta_data->>'provider';
    RAISE NOTICE 'Available metadata fields: %', (SELECT array_agg(key) FROM jsonb_each(new.raw_user_meta_data));
    RAISE NOTICE 'nickname: %, name: %, slug: %, display_name: %',
        new.raw_user_meta_data->>'nickname',
        new.raw_user_meta_data->>'name',
        new.raw_user_meta_data->>'slug',
        new.raw_user_meta_data->>'display_name';

    INSERT INTO public.profiles (id, avatar_url, email, username)
    VALUES (
        new.id,
        -- Avatar: Twitch uses 'picture', Google uses 'avatar_url'
        COALESCE(
            new.raw_user_meta_data->>'picture',
            new.raw_user_meta_data->>'avatar_url'
        ),
        COALESCE(new.email, new.raw_user_meta_data->>'email'),
        -- USERNAME: Use the actual fields Twitch provides
        COALESCE(
            new.raw_user_meta_data->>'nickname',                    -- Twitch nickname (usually the username)
            new.raw_user_meta_data->>'name',                        -- Twitch name field
            new.raw_user_meta_data->>'slug',                        -- Twitch slug (URL-friendly username)
            new.raw_user_meta_data->>'display_name',                -- Twitch display name (fallback)
            new.raw_user_meta_data->>'preferred_username',          -- OIDC preferred username (if available)
            new.raw_user_meta_data->>'login',                       -- Twitch login (if available)
            replace(split_part(COALESCE(new.email, new.raw_user_meta_data->>'email'), '@', 1), '.', '_')     -- Email fallback ONLY if nothing else
        )
    )
    ON CONFLICT (id) DO UPDATE SET
        avatar_url = COALESCE(
            new.raw_user_meta_data->>'picture',
            new.raw_user_meta_data->>'avatar_url',
            profiles.avatar_url
        ),
        username = COALESCE(
            new.raw_user_meta_data->>'nickname',                    -- Twitch nickname (usually the username)
            new.raw_user_meta_data->>'name',                        -- Twitch name field
            new.raw_user_meta_data->>'slug',                        -- Twitch slug (URL-friendly username)
            new.raw_user_meta_data->>'display_name',                -- Twitch display name (fallback)
            new.raw_user_meta_data->>'preferred_username',          -- OIDC preferred username (if available)
            new.raw_user_meta_data->>'login',                       -- Twitch login (if available)
            profiles.username  -- Keep existing if no better option
        ),
        email = COALESCE(new.email, new.raw_user_meta_data->>'email', profiles.email);
    
    RETURN new;
END;