# Spudin's Game List - Full Architecture Document

A comprehensive breakdown of the full-stack architecture for **Spudin's Game List**, a clone of [mygamelist.club](https://mygamelist.club/).

---

## 🏗 Tech Stack Overview

* **Frontend:** Next.js 15+ (App Router)
* **Backend:** Supabase (PostgreSQL, Auth)
* **Game Data API:** RAWG Video Games Database API
* **Styling:** Tailwind CSS
* **State Management:** React hooks + Context API

---

## 📁 File & Folder Structure

```bash
/spudin-game-list
├── app/
│   ├── (auth)/                              # Auth route group (protected auth pages)
│   │   ├── auth/confirm/
│   │   │   └── route.ts                     # Email confirmation handler API
│   │   ├── login/
│   │   │   └── page.tsx                     # User login page with OAuth options
│   │   ├── logout/
│   │   │   └── page.tsx                     # User logout confirmation page
│   │   └── signup/
│   │       └── page.tsx                     # User registration page
│   ├── about/
│   │   └── page.tsx                         # About page with app information
│   ├── api/                                 # API routes for backend functionality
│   │   ├── delete-account/
│   │   │   └── route.ts                     # API endpoint to delete user account
│   │   ├── games/
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts                 # Individual game data API
│   │   │   │   ├── series/
│   │   │   │   │   └── route.ts             # Game series information API
│   │   │   │   └── videos/
│   │   │   │       └── route.ts             # Game videos/trailers API
│   │   │   ├── clear-cache/
│   │   │   │   ├── README.md                # Cache clearing documentation
│   │   │   │   └── route.ts                 # API to clear game data cache
│   │   │   ├── new-releases/
│   │   │   │   └── route.ts                 # API for newly released games
│   │   │   ├── search/
│   │   │   │   └── route.ts                 # Game search API endpoint
│   │   │   ├── test/
│   │   │   │   ├── README.md                # Testing API documentation
│   │   │   │   └── route.ts                 # API testing/debugging endpoint
│   │   │   └── trending/
│   │   │       └── route.ts                 # Trending games API
│   │   └── profile/[username]/
│   │       └── route.ts                     # Public user profile data API
│   ├── error/
│   │   └── page.tsx                         # Global error page for unhandled errors
│   ├── games/
│   │   ├── [id]/                            # Dynamic route for individual games
│   │   │   ├── layout.tsx                   # Layout wrapper for game detail pages
│   │   │   ├── loading.tsx                  # Loading skeleton for game details
│   │   │   ├── not-found.tsx                # 404 page for non-existent games
│   │   │   ├── opengraph-image.tsx          # Dynamic OG image generation for games
│   │   │   └── page.tsx                     # Game detail page with reviews/ratings
│   │   ├── layout.tsx                       # Layout for all game-related pages
│   │   ├── metadata.ts                      # SEO metadata for games section
│   │   └── page.tsx                         # Game explorer/browse page with search
│   ├── home/
│   │   ├── layout.tsx                       # Layout for authenticated user dashboard
│   │   └── page.tsx                         # User dashboard with personalized content
│   ├── my-games/
│   │   └── page.tsx                         # User's personal game library page
│   ├── profile/[username]/                  # Dynamic route for public user profiles
│   │   ├── layout.tsx                       # Layout for profile pages
│   │   ├── loading.tsx                      # Loading skeleton for profile data
│   │   ├── metadata.ts                      # Dynamic SEO metadata for profiles
│   │   ├── not-found.tsx                    # 404 for non-existent user profiles
│   │   ├── opengraph-image.tsx              # Dynamic OG image for user profiles
│   │   └── page.tsx                         # Public profile page with stats/games
│   ├── privacy-policy/
│   │   └── page.tsx                         # Privacy policy legal page
│   ├── settings/
│   │   └── page.tsx                         # User account settings page
│   ├── terms-of-service/
│   │   └── page.tsx                         # Terms of service legal page
│   ├── favicon.ico                          # App favicon
│   ├── globals.css                          # Global CSS styles and Tailwind imports
│   ├── layout.tsx                           # Root layout with navigation and providers
│   ├── page.tsx                             # Landing page for unauthenticated users
│   ├── robots.ts                            # SEO robots.txt generation
│   └── sitemap.ts                           # Dynamic sitemap generation for SEO
├── components/
│   ├── common/                              # Reusable components across the app
│   │   ├── ClientTabsWrapper.tsx            # Client-side wrapper for tab navigation
│   │   ├── DragScrollContainer.tsx          # Horizontal scroll container with drag
│   │   ├── LoginLogoutButton.tsx            # Authentication toggle button
│   │   └── SearchDialog.tsx                 # Global search modal dialog
│   ├── forms/                               # Form components for user input
│   │   ├── LoginForm.tsx                    # Email/password login form
│   │   ├── RatingInput.tsx                  # Star rating input component
│   │   ├── ReviewInput.tsx                  # Game review text input form
│   │   ├── SettingsForm.tsx                 # User settings update form
│   │   ├── SignInWithGoogleButton.tsx       # Google OAuth login button
│   │   ├── SignInWithTwitchButton.tsx       # Twitch OAuth login button
│   │   └── SignUpForm.tsx                   # User registration form
│   ├── game/                                # Game-specific UI components
│   │   ├── GameCard.tsx                     # Individual game card display
│   │   ├── GameCollection.tsx               # Grid/list of game cards
│   │   ├── GameDetails.tsx                  # Detailed game information display
│   │   ├── GameExplorerHero.tsx             # Hero section for game discovery
│   │   ├── GameLinks.tsx                    # External links for games (store, etc.)
│   │   ├── GameListHeader.tsx               # Header with filters for game lists
│   │   ├── GameRatingDialog.tsx             # Modal for rating games
│   │   ├── GameReviews.tsx                  # Display and manage game reviews
│   │   ├── GameSearch.tsx                   # Game search input with suggestions
│   │   ├── GameStatusButtons.tsx            # Buttons to set game status (playing, etc.)
│   │   ├── PublicGameCard.tsx               # Game card for public profiles
│   │   └── PublicGameCollection.tsx         # Game collection for public viewing
│   ├── layout/                              # Layout and navigation components
│   │   ├── Footer.tsx                       # App footer with links and info
│   │   └── ModernNavBar.tsx                 # Main navigation bar component
│   ├── ui/                                  # Base UI components from shadcn/ui
│   │   ├── button.tsx                       # Customizable button component
│   │   ├── card.tsx                         # Card container component
│   │   ├── confirmation-dialog.tsx          # Confirmation modal dialog
│   │   ├── dialog.tsx                       # Base modal dialog component
│   │   ├── input.tsx                        # Text input field component
│   │   ├── label.tsx                        # Form label component
│   │   ├── skeleton.tsx                     # Loading skeleton placeholders
│   │   ├── slider.tsx                       # Range slider input component
│   │   ├── tabs.tsx                         # Tab navigation component
│   │   └── textarea.tsx                     # Multi-line text input component
│   └── user/                                # User profile and statistics components
│       ├── ShareProfileButton.tsx           # Button to share user profile
│       ├── UserGameCard.tsx                 # Game card with user-specific data
│       ├── UserGameCollection.tsx           # Collection of user's games
│       ├── UserGameList.tsx                 # List view of user's game library
│       ├── UserGreetText.tsx                # Personalized greeting for users
│       ├── UserProfileStats.tsx             # User statistics display component
│       └── UserStatsDisplay.tsx             # Detailed user gaming statistics
├── hooks/
│   └── useUser.ts                           # Custom hook for user auth state management
├── lib/
│   ├── actions/                             # Server actions for form handling
│   │   ├── authActions.ts                   # Authentication server actions
│   │   ├── gameActions.ts                   # Game-related server actions
│   │   ├── profileActions.ts                # User profile server actions
│   │   └── settingsActions.ts               # Settings update server actions
│   ├── services/                            # External API service clients
│   │   ├── gamesClient.ts                   # Generic games API client
│   │   └── igdb/                            # IGDB (Internet Game Database) service
│   │       ├── auth.ts                      # IGDB OAuth token management
│   │       ├── client.ts                    # IGDB API client implementation
│   │       ├── config.ts                    # IGDB service configuration
│   │       ├── content-filter.ts            # Content filtering for game data
│   │       ├── index.ts                     # IGDB service main exports
│   │       ├── service.ts                   # High-level IGDB service methods
│   │       └── transformer.ts               # Data transformation for IGDB responses
│   ├── utils/                               # Utility functions and helpers
│   │   ├── cacheUtils.ts                    # Cache management utilities
│   │   └── cors.ts                          # CORS configuration helpers
│   ├── igdb.ts                              # Main IGDB integration functions
│   └── utils.ts                             # General utility functions and helpers
├── public/                                  # Static assets served by Next.js
│   ├── landing/                             # Landing page specific images
│   │   ├── banner.jpg                       # Main hero banner image
│   │   ├── discover.png                     # Feature highlight: game discovery
│   │   ├── review.png                       # Feature highlight: reviews
│   │   └── track.png                        # Feature highlight: progress tracking
│   ├── file.svg                             # Generic file icon
│   ├── globe.svg                            # Globe/world icon
│   ├── next.svg                             # Next.js logo
│   ├── vercel.svg                           # Vercel deployment logo
│   └── window.svg                           # Window/app icon
├── sql/                                     # Database scripts and migrations
│   ├── add_cascade_constraints.sql          # Add foreign key cascade constraints
│   ├── cleanup_expired_game_cache.sql       # Remove old cached game data
│   ├── delete_user_reviews.sql              # Script to delete user reviews
│   ├── handle_new_user.sql                  # Trigger for new user setup
│   └── SGL.sql                              # Main database schema definition
├── supabase/                                # Supabase client configurations
│   ├── admin.ts                             # Admin client with elevated permissions
│   ├── client.ts                            # Standard client-side Supabase client
│   ├── middleware.ts                        # Middleware-specific client config
│   └── server.ts                            # Server-side client configuration
├── types/
│   └── igdb.ts                              # TypeScript definitions for IGDB API
├── architecture.md                          # This comprehensive documentation
├── task.md                                  # Development tasks and TODO items
├── middleware.ts                            # Next.js middleware for auth protection
├── next.config.ts                           # Next.js configuration and settings
├── package.json                             # Project dependencies and scripts
├── tailwind.config.ts                       # Tailwind CSS configuration
├── tsconfig.json                            # TypeScript compiler configuration
└── vercel.json                              # Vercel deployment configuration
```

### Folder Purpose

* **`app/`** - Next.js App Router structure with pages, layouts, and API routes
  * **`(auth)/`** - Route group for authentication pages (login, signup, etc.)
  * **`api/`** - API endpoints for games, profiles, and account management
  * **`games/`** - Game exploration and individual game detail pages
  * **`profile/`** - Public user profile pages with dynamic routing
* **`components/`** - Organized UI components by category
  * **`common/`** - Shared/reusable components across the app
  * **`forms/`** - Form components for auth, ratings, reviews, settings
  * **`game/`** - Game-specific components (cards, details, collections)
  * **`layout/`** - Navigation, footer, and layout components
  * **`ui/`** - Base UI components using shadcn/ui design system
  * **`user/`** - User profile and statistics components
* **`hooks/`** - Custom React hooks for user authentication and data management
* **`lib/`** - Core application logic and external integrations
  * **`actions/`** - Server actions for auth, games, profiles, settings
  * **`services/`** - External API clients (IGDB game database)
  * **`utils/`** - Utility functions for caching, CORS, and general helpers
* **`sql/`** - Database migration scripts and stored procedures
* **`supabase/`** - Supabase client configurations for different environments
* **`types/`** - TypeScript type definitions for external APIs
* **`middleware.ts`** - Next.js middleware for authentication and route protection

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

### Profiles

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  avatar_url TEXT
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

#### Search games via IGDB:

```ts
const token = await getAccessToken();
const response = await fetch('https://api.igdb.com/v4/games', {
  method: 'POST',
  headers: {
    'Client-ID': IGDB_CLIENT_ID,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: 'fields id, name, cover.url; search "elden ring"; limit 10;'
});
const json = await response.json();
```

---

## 🔌 Integration with IGDB API

* **Read-only usage** – fetch metadata and images
* Store only referenced data (game ID, name, image) locally for caching
* **OAuth2 Authentication** – Uses Twitch Developer credentials

```ts
// lib/igdb.ts
export async function searchGames(query: string) {
  const token = await getAccessToken();
  const igdbQuery = `fields id, name, cover.url; search "${query}"; limit 20;`;
  const response = await fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': IGDB_CLIENT_ID!,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: igdbQuery,
  });
  return response.json();
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
