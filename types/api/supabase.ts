// Supabase API Types
// Types for Supabase database and authentication

import { User } from '@supabase/supabase-js';

// Re-export Supabase User type for convenience
export type { User } from '@supabase/supabase-js';

// Database table types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      games: {
        Row: Game;
        Insert: GameInsert;
        Update: GameUpdate;
      };
      game_lists: {
        Row: GameListEntry;
        Insert: GameListInsert;
        Update: GameListUpdate;
      };
      game_cache: {
        Row: GameCache;
        Insert: GameCacheInsert;
        Update: GameCacheUpdate;
      };
      game_reviews: {
        Row: GameReview;
        Insert: GameReviewInsert;
        Update: GameReviewUpdate;
      };
    };
  };
}

// Profile types
export interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  is_admin?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id?: string;
  full_name?: string | null;
  username?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileUpdate {
  full_name?: string | null;
  username?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  is_admin?: boolean;
  updated_at?: string;
}

// Game types
export interface Game {
  id: number;
  name: string;
  background_image: string | null;
  released: string | null;
  rating: number | null;
  genres?: { id: number; name: string }[];
  created_at: string;
  updated_at: string;
}

export interface GameInsert {
  id: number;
  name: string;
  background_image?: string | null;
  released?: string | null;
  rating?: number | null;
  genres?: { id: number; name: string }[];
  created_at?: string;
  updated_at?: string;
}

export interface GameUpdate {
  name?: string;
  background_image?: string | null;
  released?: string | null;
  rating?: number | null;
  genres?: { id: number; name: string }[];
  updated_at?: string;
}

// Game list types
export interface GameListEntry {
  id: string;
  user_id: string;
  game_id: number;
  status: string | null;
  rating: number | null;
  review: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  games?: Game | null;
  profiles?: Profile | null;
}

export interface GameListInsert {
  id?: string;
  user_id: string;
  game_id: number;
  status?: string | null;
  rating?: number | null;
  review?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface GameListUpdate {
  status?: string | null;
  rating?: number | null;
  review?: string | null;
  updated_at?: string;
}

// Game cache types
export interface GameCache {
  id: string;
  cache_key: string;
  data: any; // JSON data
  cache_type: string;
  last_updated: string;
  expires_at: string;
}

export interface GameCacheInsert {
  id?: string;
  cache_key: string;
  data: any;
  cache_type: string;
  last_updated?: string;
  expires_at: string;
}

export interface GameCacheUpdate {
  data?: any;
  last_updated?: string;
  expires_at?: string;
}

// Game review types
export interface GameReview {
  id: string;
  user_id: string;
  game_id: number;
  rating: number;
  review_text: string | null;
  is_spoiler: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  profiles?: Profile | null;
  games?: Game | null;
}

export interface GameReviewInsert {
  id?: string;
  user_id: string;
  game_id: number;
  rating: number;
  review_text?: string | null;
  is_spoiler?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GameReviewUpdate {
  rating?: number;
  review_text?: string | null;
  is_spoiler?: boolean;
  updated_at?: string;
}

// Auth types
export interface AuthUser extends User {
  // Add any custom user properties here
}

export interface AuthSession {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// API response types
export interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface SupabaseListResponse<T> {
  data: T[] | null;
  error: Error | null;
  count?: number | null;
}

// Query types
export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// RPC (Remote Procedure Call) types
export interface UserStatsRPC {
  total_games: number;
  games_finished: number;
  games_playing: number;
  games_want_to_play: number;
  games_on_hold: number;
  games_dropped: number;
  average_rating: number;
  total_reviews: number;
  recent_activity: number;
}
