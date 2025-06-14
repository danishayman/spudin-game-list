# Spudin's Game List - Full Architecture Document

A comprehensive breakdown of the full-stack architecture for **Spudin's Game List**, a clone of [mygamelist.club](https://mygamelist.club/).

---

## 🏗 Tech Stack Overview

* **Frontend:** Next.js 14+ (App Router)
* **Backend:** Supabase (PostgreSQL, Auth)
* **Game Data API:** RAWG Video Games Database API
* **Styling:** Tailwind CSS
* **State Management:** React hooks + Context API

---

## 📁 File & Folder Structure

```bash
/spudin-game-list
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   ├── dashboard/
│   ├── game/[id]/
│   ├── profile/[username]/
├── components/
│   ├── GameCard.tsx
│   ├── Navbar.tsx
│   ├── RatingStars.tsx
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   ├── useGameList.ts
│   └── useAuth.ts
├── lib/
│   ├── supabaseClient.ts
│   ├── rawg.ts
├── styles/
│   └── globals.css
├── utils/
│   ├── filters.ts
│   └── constants.ts
├── middleware.ts
├── .env.local
├── tailwind.config.js
├── tsconfig.json
├── package.json
```

### Folder Purpose

* **`app/`** - App Router-based routing, pages and layouts.
* **`components/`** - UI components like cards, buttons, stars, etc.
* **`contexts/`** - Global contexts for auth and user state.
* **`hooks/`** - Custom React hooks for fetching and managing data.
* **`lib/`** - External services (RAWG API, Supabase clients).
* **`styles/`** - Global CSS + Tailwind setup.
* **`utils/`** - Utility functions for sorting, filtering, enums.
* **`middleware.ts`** - Auth middleware for protecting routes.

---

## 🔐 Authentication Flow (Google OAuth)

1. User lands on `/login`
2. On login button click, `signInWithOAuth` is triggered via Supabase client.
3. Supabase handles OAuth redirection and stores session in `supabase.auth`
4. AuthContext listens for session changes and updates React state.
5. User is redirected to `/dashboard` upon success.

```ts
// lib/supabaseClient.ts
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

---

## 🧠 State Management

### Global:

* `AuthContext` - Tracks current user, session, and login status.
* `GameListContext` (optional) - User's game list, preferences, filters.

### Local:

* Component states for form inputs, ratings, search results, etc.

---

## 🧾 Database Schema (PostgreSQL)

### Users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT,
  avatar_url TEXT,
  joined_at TIMESTAMP DEFAULT now()
);
```

### Games

```sql
CREATE TABLE games (
  id INT PRIMARY KEY, -- RAWG game ID
  name TEXT,
  background_image TEXT,
  released DATE,
  rating FLOAT
);
```

### GameList

```sql
CREATE TABLE game_lists (
  user_id UUID REFERENCES users(id),
  game_id INT REFERENCES games(id),
  status TEXT CHECK (status IN ('Playing', 'Completed', 'Plan to Play', 'Dropped', 'On Hold')),
  rating INT CHECK (rating BETWEEN 1 AND 10),
  updated_at TIMESTAMP DEFAULT now(),
  PRIMARY KEY (user_id, game_id)
);
```

### Reviews

```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  game_id INT REFERENCES games(id),
  content TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

### Follows

```sql
CREATE TABLE follows (
  follower_id UUID REFERENCES users(id),
  followee_id UUID REFERENCES users(id),
  PRIMARY KEY (follower_id, followee_id)
);
```

---

## 🔁 API Routes & Data Flow

All interactions use server components and Supabase SDK:

### Examples:

#### Add a game to list:

```ts
await supabase.from('game_lists').upsert({
  user_id, game_id, status: 'Playing', rating: 8
});
```

#### Fetch user list:

```ts
const { data } = await supabase
  .from('game_lists')
  .select('*, games(*)')
  .eq('user_id', user.id);
```

#### Search games via RAWG:

```ts
const res = await fetch(`https://api.rawg.io/api/games?search=elden ring&page_size=10&key=${RAWG_API_KEY}`);
const json = await res.json();
```

---

## 🔌 Integration with RAWG API

* **Read-only usage** – fetch metadata and images
* Store only referenced data (game ID, name, image) locally for caching

```ts
// lib/rawg.ts
export async function searchGames(query: string) {
  const res = await fetch(`https://api.rawg.io/api/games?search=${query}&key=${RAWG_API_KEY}`);
  return res.json();
}
```

---

## 📊 Recommendation System (Basic Idea)

* Use user's ratings + statuses to determine preference (genres, platforms, devs)
* Recommend similar games by fetching from RAWG with matching tags/genres
* Future: collaborative filtering via Supabase Functions or external model

---

## 🔎 Advanced Filtering & Sorting

* By rating, status, genre, platform
* Client-side with memoized filters
* Optional: implement in Supabase via `rpc` or `view` for performance

---

## 🧑‍💻 User Profiles

* `/profile/[username]`
* Shows stats: # completed, avg rating, most played genre
* List of recent activity, reviews, followed users

---

## 🔔 Activity Feed

* Basic activity feed by querying `game_lists`, `reviews`, `follows` with timestamps
* Combine and order by date

---

## ✅ To Be Added (Future Iterations)

* Supabase Row Level Security (RLS)
* Notifications
* Badges / Achievements
* Mobile-first optimizations
* Progressive Web App (PWA) setup

---

This document serves as a blueprint for the **initial MVP** of Spudin's Game List. Expand, evolve, and iterate on each module based on user feedback and usage data.
