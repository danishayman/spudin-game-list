// Database Table Types
// TypeScript definitions for database schema

import { GameStatus } from '../shared/enums';

// Profiles table
export interface ProfilesTable {
  id: string; // UUID
  full_name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  is_admin: boolean;
  is_verified: boolean;
  date_of_birth: string | null;
  timezone: string | null;
  language: string;
  privacy_settings: {
    profile_visibility: 'public' | 'friends' | 'private';
    show_email: boolean;
    show_stats: boolean;
    show_activity: boolean;
    show_reviews: boolean;
  };
  notification_settings: {
    email_notifications: boolean;
    push_notifications: boolean;
    friend_requests: boolean;
    game_recommendations: boolean;
    review_comments: boolean;
    achievement_notifications: boolean;
  };
  social_links: {
    twitter?: string;
    discord?: string;
    twitch?: string;
    youtube?: string;
    steam?: string;
    xbox?: string;
    playstation?: string;
    nintendo?: string;
  };
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
}

// Games table
export interface GamesTable {
  id: number; // IGDB game ID
  name: string;
  slug: string;
  background_image: string | null;
  description: string | null;
  released: string | null; // ISO date string
  rating: number | null; // 0-100
  rating_count: number | null;
  metacritic_score: number | null;
  igdb_rating: number | null;
  igdb_rating_count: number | null;
  genres: Array<{ id: number; name: string }> | null;
  platforms: Array<{ id: number; name: string }> | null;
  developers: Array<{ id: number; name: string }> | null;
  publishers: Array<{ id: number; name: string }> | null;
  tags: Array<{ id: number; name: string }> | null;
  screenshots: Array<{ id: number; url: string; width?: number; height?: number }> | null;
  videos: Array<{ id: number; video_id: string; name: string }> | null;
  websites: Array<{ id: number; url: string; category: number }> | null;
  cover_url: string | null;
  summary: string | null;
  storyline: string | null;
  category: number | null; // IGDB category
  status: number | null; // IGDB release status
  first_release_date: number | null; // Unix timestamp
  aggregated_rating: number | null;
  aggregated_rating_count: number | null;
  esrb_rating: string | null;
  pegi_rating: string | null;
  game_modes: Array<{ id: number; name: string }> | null;
  player_perspectives: Array<{ id: number; name: string }> | null;
  themes: Array<{ id: number; name: string }> | null;
  keywords: Array<{ id: number; name: string }> | null;
  alternative_names: Array<{ id: number; name: string }> | null;
  franchise: { id: number; name: string } | null;
  collection: { id: number; name: string } | null;
  dlcs: Array<{ id: number; name: string }> | null;
  expansions: Array<{ id: number; name: string }> | null;
  remakes: Array<{ id: number; name: string }> | null;
  remasters: Array<{ id: number; name: string }> | null;
  similar_games: Array<{ id: number; name: string; rating?: number }> | null;
  time_to_beat: {
    hastly?: number;
    normally?: number;
    completely?: number;
  } | null;
  popularity_score: number | null;
  hype_score: number | null;
  user_count: number; // Number of users who have this game
  average_user_rating: number | null;
  last_updated_from_igdb: string | null;
  cache_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

// Game Lists table (user's game entries)
export interface GameListsTable {
  id: string; // UUID
  user_id: string; // Foreign key to profiles
  game_id: number; // Foreign key to games
  status: GameStatus | null;
  rating: number | null; // 1-10 user rating
  review: string | null;
  notes: string | null;
  is_favorite: boolean;
  is_private: boolean;
  progress: number | null; // 0-100 completion percentage
  hours_played: number | null;
  platform: string | null; // Platform played on
  date_started: string | null;
  date_finished: string | null;
  times_completed: number;
  difficulty: string | null;
  tags: string[] | null;
  custom_fields: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

// Game Reviews table
export interface GameReviewsTable {
  id: string; // UUID
  user_id: string; // Foreign key to profiles
  game_id: number; // Foreign key to games
  rating: number; // 1-10 rating
  title: string | null;
  content: string | null;
  is_spoiler: boolean;
  is_recommended: boolean | null;
  platform: string | null;
  completion_status: 'completed' | 'dropped' | 'in_progress' | null;
  hours_played: number | null;
  likes_count: number;
  dislikes_count: number;
  reports_count: number;
  is_published: boolean;
  is_featured: boolean;
  language: string;
  created_at: string;
  updated_at: string;
}

// Review Reactions table
export interface ReviewReactionsTable {
  id: string; // UUID
  review_id: string; // Foreign key to game_reviews
  user_id: string; // Foreign key to profiles
  reaction_type: 'like' | 'dislike' | 'helpful' | 'funny' | 'report';
  created_at: string;
}

// Game Cache table
export interface GameCacheTable {
  id: string; // UUID
  cache_key: string; // Unique cache identifier
  data: any; // JSON data
  cache_type: 'search' | 'details' | 'trending' | 'new_releases' | 'series' | 'videos' | 'screenshots';
  tags: string[] | null; // For cache invalidation
  hit_count: number;
  last_accessed: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

// User Relationships table (followers/following)
export interface UserRelationshipsTable {
  id: string; // UUID
  follower_id: string; // Foreign key to profiles
  following_id: string; // Foreign key to profiles
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  updated_at: string;
}

// User Activities table
export interface UserActivitiesTable {
  id: string; // UUID
  user_id: string; // Foreign key to profiles
  activity_type: 'game_added' | 'game_completed' | 'game_rated' | 'review_posted' | 'status_changed' | 'achievement_unlocked';
  game_id: number | null; // Foreign key to games
  target_user_id: string | null; // For social activities
  data: Record<string, any> | null; // Activity-specific data
  is_public: boolean;
  created_at: string;
}

// Achievements table
export interface AchievementsTable {
  id: string; // UUID
  name: string;
  description: string;
  icon: string;
  category: 'gaming' | 'social' | 'collection' | 'milestone' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  requirements: Record<string, any>; // JSON criteria
  unlock_count: number; // How many users have unlocked it
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// User Achievements table
export interface UserAchievementsTable {
  id: string; // UUID
  user_id: string; // Foreign key to profiles
  achievement_id: string; // Foreign key to achievements
  progress: number; // 0-100 percentage
  unlocked_at: string | null;
  data: Record<string, any> | null; // Achievement-specific data
  created_at: string;
  updated_at: string;
}

// Game Collections table (user-created lists)
export interface GameCollectionsTable {
  id: string; // UUID
  user_id: string; // Foreign key to profiles
  name: string;
  description: string | null;
  is_public: boolean;
  is_collaborative: boolean;
  tags: string[] | null;
  cover_image: string | null;
  game_count: number;
  followers_count: number;
  created_at: string;
  updated_at: string;
}

// Collection Games table (many-to-many)
export interface CollectionGamesTable {
  id: string; // UUID
  collection_id: string; // Foreign key to game_collections
  game_id: number; // Foreign key to games
  added_by: string; // Foreign key to profiles
  position: number; // Order in collection
  notes: string | null;
  created_at: string;
}

// Notifications table
export interface NotificationsTable {
  id: string; // UUID
  user_id: string; // Foreign key to profiles
  type: 'friend_request' | 'game_recommendation' | 'review_comment' | 'achievement_unlocked' | 'system_update';
  title: string;
  message: string;
  data: Record<string, any> | null; // Notification-specific data
  is_read: boolean;
  action_url: string | null;
  expires_at: string | null;
  created_at: string;
}

// User Settings table
export interface UserSettingsTable {
  id: string; // UUID
  user_id: string; // Foreign key to profiles
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  default_game_status: GameStatus | null;
  default_rating_scale: '5' | '10' | '100';
  auto_add_to_playing: boolean;
  show_spoiler_reviews: boolean;
  email_digest_frequency: 'never' | 'daily' | 'weekly' | 'monthly';
  data_export_format: 'json' | 'csv' | 'xml';
  custom_settings: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

// API Keys table (for admin/developer access)
export interface ApiKeysTable {
  id: string; // UUID
  user_id: string; // Foreign key to profiles
  name: string;
  key_hash: string; // Hashed API key
  permissions: string[]; // Array of permission strings
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Database table union type
export type DatabaseTables = 
  | ProfilesTable
  | GamesTable
  | GameListsTable
  | GameReviewsTable
  | ReviewReactionsTable
  | GameCacheTable
  | UserRelationshipsTable
  | UserActivitiesTable
  | AchievementsTable
  | UserAchievementsTable
  | GameCollectionsTable
  | CollectionGamesTable
  | NotificationsTable
  | UserSettingsTable
  | ApiKeysTable;

// Table names enum for type safety
export enum TableName {
  PROFILES = 'profiles',
  GAMES = 'games',
  GAME_LISTS = 'game_lists',
  GAME_REVIEWS = 'game_reviews',
  REVIEW_REACTIONS = 'review_reactions',
  GAME_CACHE = 'game_cache',
  USER_RELATIONSHIPS = 'user_relationships',
  USER_ACTIVITIES = 'user_activities',
  ACHIEVEMENTS = 'achievements',
  USER_ACHIEVEMENTS = 'user_achievements',
  GAME_COLLECTIONS = 'game_collections',
  COLLECTION_GAMES = 'collection_games',
  NOTIFICATIONS = 'notifications',
  USER_SETTINGS = 'user_settings',
  API_KEYS = 'api_keys'
}
