# 🎮 Spudin Game List

A modern, full-stack game tracking and discovery platform inspired by MyAnimeList, built with Next.js 15, Supabase, and the RAWG Games API. Track your gaming journey, discover new titles, and manage your personal game collection with style.

## ✨ Features

### 🔐 **Authentication & User Management**
- Secure Google OAuth integration via Supabase Auth
- User profiles with customizable usernames  
- Protected routes with middleware-based authentication
- Seamless login/logout experience

### 🎯 **Game Discovery & Search**
- Powered by RAWG's comprehensive games database (300,000+ games)
- Advanced search with real-time results
- Filter by platform, sort by relevance, rating, or release date
- Detailed game pages with screenshots, metadata, and store links
- Trending games and new releases sections

### 📚 **Personal Game Management**
- **Game Status Tracking**: Playing, Finished, Want to Play, On-Hold, Dropped
- **Rating System**: 10-point scale with visual indicators
- **Multiple Views**: Grid and list layouts for your collection
- **Smart Organization**: Games automatically grouped by status
- **Quick Actions**: Add, edit, or remove games from your list

### 🚀 **Modern User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark Theme**: Elegant slate-based color scheme
- **Smooth Animations**: Polished interactions and transitions
- **Loading States**: Skeleton screens and progress indicators
- **Error Handling**: Graceful fallbacks and user-friendly error messages

### ⚡ **Performance & Optimization**
- **Intelligent Caching**: 7-day cache system for API responses
- **Server-Side Rendering**: Fast initial page loads
- **Image Optimization**: Next.js automatic image optimization
- **Database Optimization**: Efficient queries with proper indexing

## 🛠 Tech Stack

**Frontend:**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

**Backend:**
- **Supabase** - PostgreSQL database and authentication
- **RAWG Games API** - Comprehensive games database
- **Server Actions** - Type-safe server-side operations

**Deployment:**
- **Vercel** - Optimized for Next.js applications
- **Edge Functions** - Fast, globally distributed API routes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Supabase account
- A RAWG API key (free tier available)
- A Google OAuth app for authentication

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd spudin-game-list
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# RAWG Games API (server-side only)
RAWG_API_KEY=your-rawg-api-key

# Optional: Custom site URL for production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 3. Database Setup

#### 3.1 Supabase Project Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

#### 3.2 Google OAuth Setup
1. Go to **Authentication → Providers** in your Supabase dashboard
2. Enable Google provider and configure with your Google OAuth credentials
3. Add your domain to the authorized redirect URIs

#### 3.3 Database Schema
Run the following SQL migrations in your Supabase SQL Editor:

**User Profiles:**
```sql
-- Add username column to profiles
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

-- Update existing profiles with username from email
UPDATE public.profiles
SET username = replace(split_part(email, '@', 1), '.', '_')
WHERE username IS NULL;

ALTER TABLE public.profiles ALTER COLUMN username SET NOT NULL;
```

**Game Cache System:**
```bash
npm run setup-cache
```
*Or manually run the SQL from `sql/game_cache.sql`*

### 4. API Keys Setup

#### 4.1 RAWG API Key
1. Sign up at [RAWG.io](https://rawg.io/apidocs)
2. Get your free API key from the dashboard
3. Add it as `RAWG_API_KEY` in your `.env.local`

### 5. Start Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application!

## 📱 Key Pages & Features

### 🏠 **Home Page** (`/`)
- Hero section with featured games
- New releases showcase  
- Call-to-action for registration

### 🔍 **Game Discovery** (`/games`)
- Advanced search interface
- Platform and sort filters
- Real-time search results

### 📋 **My Games** (`/my-games`)
- Personal game collection
- Tabbed interface by status
- Grid/list view toggle
- Quick edit functionality

### 🎮 **Game Details** (`/games/[id]`)
- Comprehensive game information
- Screenshots gallery
- Add to collection dialog
- External store links

### 👤 **User Profile** (`/profile/[username]`)
- Public user profiles
- Game statistics
- Recent activity

## 🏗 Architecture Overview

### **Database Schema**
```sql
-- Core tables
profiles (id, username, email, full_name, avatar_url)
games (id, name, background_image, released, rating)  
game_lists (user_id, game_id, status, rating, updated_at)
game_cache (cache_key, data, cache_type, last_updated)
```

### **API Routes**
- `/api/games/search` - Game search functionality
- `/api/games/[id]` - Individual game details  
- `/api/games/trending` - Popular games
- `/api/games/new-releases` - Recent releases with good ratings

### **Caching Strategy**
- **Search Results**: 1 hour cache
- **Game Details**: 24 hour cache  
- **Trending/New Releases**: 1 hour cache
- **Automatic Expiry**: 7-day TTL for all cached data

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run setup-cache  # Initialize database cache tables
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key  
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key
RAWG_API_KEY=your-rawg-api-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🛠 Troubleshooting

### Common Issues

**Cache not populating:**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check server logs for `[CACHE]` error messages
- Run `npm run setup-cache` to reinitialize cache tables

**Authentication issues:**
- Ensure Google OAuth is properly configured in Supabase
- Check that redirect URLs match your domain
- Verify environment variables are set correctly

**API rate limits:**
- RAWG API has rate limits on free tier
- Consider upgrading for production use
- Cached responses help reduce API calls

## 📊 Project Status

- ✅ **Core Features**: Authentication, game search, personal lists
- ✅ **Game Management**: Status tracking, ratings, collection views  
- ✅ **Modern UI**: Responsive design, dark theme, smooth interactions
- ✅ **Performance**: Caching system, optimized queries, SSR
- 🚧 **Future Features**: Social features, reviews, recommendations

## 🎯 Roadmap

- [ ] **Social Features**: Follow users, activity feeds
- [ ] **Reviews System**: Write and read game reviews  
- [ ] **Recommendations**: AI-powered game suggestions
- [ ] **Statistics**: Advanced analytics and insights
- [ ] **Mobile App**: React Native companion app
- [ ] **Import/Export**: Backup and migrate game lists

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **RAWG.io** - Comprehensive games database API
- **Supabase** - Backend-as-a-Service platform  
- **Vercel** - Deployment and hosting platform
- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS framework

---

**Built with ❤️ by danishayman**

*Transform your gaming experience with Spudin Game List - where every game tells a story.*
