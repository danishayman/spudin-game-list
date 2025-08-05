-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.game_cache (
  id integer NOT NULL DEFAULT nextval('game_cache_id_seq'::regclass),
  last_updated timestamp with time zone NOT NULL DEFAULT now(),
  cache_key text NOT NULL UNIQUE,
  data jsonb NOT NULL,
  cache_type text NOT NULL,
  CONSTRAINT game_cache_pkey PRIMARY KEY (id)
);
CREATE TABLE public.game_lists (
  user_id uuid NOT NULL,
  game_id integer NOT NULL,
  status text CHECK (status = ANY (ARRAY['Finished'::text, 'Playing'::text, 'Dropped'::text, 'Want'::text, 'On-hold'::text])),
  rating numeric CHECK (rating >= 0::numeric AND rating <= 10::numeric),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT game_lists_pkey PRIMARY KEY (user_id, game_id),
  CONSTRAINT game_lists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT game_lists_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id)
);
CREATE TABLE public.games (
  id integer NOT NULL,
  name text NOT NULL,
  background_image text,
  released date,
  rating double precision,
  genres jsonb,
  CONSTRAINT games_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text UNIQUE,
  avatar_url text,
  username text NOT NULL UNIQUE,
  is_admin boolean DEFAULT false,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.reviews (
  user_id uuid NOT NULL,
  game_id integer NOT NULL,
  content text NOT NULL,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT reviews_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id)
);