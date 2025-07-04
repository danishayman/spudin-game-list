This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# RAWG API (server-side only)
RAWG_API_KEY=your-rawg-api-key
```

### Supabase Keys
1. Go to your Supabase project dashboard
2. Navigate to Project Settings > API
3. Copy the URL as `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the `anon` public key as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy the `service_role` key as `SUPABASE_SERVICE_ROLE_KEY` (required for caching)

### RAWG API Key
1. Sign up for a free account at [RAWG](https://rawg.io/apidocs)
2. Navigate to your dashboard and get your API key
3. Add it to your `.env.local` file as `RAWG_API_KEY` (Note: This is now a server-side secret, not exposed to the client)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database Migration

When updating to the latest version, you need to run the following migration script in your Supabase project:

```sql
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
```

You can run this in the Supabase SQL Editor or through the Supabase CLI.

## Caching Layer

This project implements a caching layer for RAWG API responses to improve performance and reduce API calls:

- Stores search results, game details, and trending games in Supabase
- Automatically expires cached data after 7 days
- Checks the cache before making API calls

### Setting Up the Cache

To set up the caching layer, you need to run the game cache migration:

1. Make sure you have the `SUPABASE_SERVICE_ROLE_KEY` set in your `.env.local` file
2. Run the setup script:

```bash
npm run setup-cache
```

Alternatively, you can run the SQL directly in the Supabase SQL Editor. The SQL file is located at `sql/game_cache.sql`.

### Troubleshooting

If your cache isn't being populated:

1. Check that you have the `SUPABASE_SERVICE_ROLE_KEY` correctly set in your `.env.local` file
2. Look at your server logs for any [CACHE] error messages
3. Verify that your Supabase RLS policies are set up correctly
4. Try running the SQL migration manually in the Supabase SQL Editor
