// Shared Enums
// Centralized enumeration values used across the application

// Game status enumeration
export enum GameStatus {
  FINISHED = 'Finished',
  PLAYING = 'Playing',
  DROPPED = 'Dropped',
  WANT = 'Want',
  ON_HOLD = 'On-hold'
}

// Type alias for backward compatibility
export type GameStatusType = 'Finished' | 'Playing' | 'Dropped' | 'Want' | 'On-hold' | null;

// Game category enumeration (IGDB categories)
export enum GameCategory {
  MAIN_GAME = 0,
  DLC_ADDON = 1,
  EXPANSION = 2,
  BUNDLE = 3,
  STANDALONE_EXPANSION = 4,
  MOD = 5,
  EPISODE = 6,
  SEASON = 7,
  REMAKE = 8,
  REMASTER = 9,
  EXPANDED_GAME = 10,
  PORT = 11,
  FORK = 12,
  PACK = 13,
  UPDATE = 14
}

// Game release status (IGDB status)
export enum GameReleaseStatus {
  RELEASED = 0,
  ALPHA = 2,
  BETA = 3,
  EARLY_ACCESS = 4,
  OFFLINE = 5,
  CANCELLED = 6,
  RUMORED = 7,
  DELISTED = 8
}

// User role enumeration
export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

// Platform enumeration (common gaming platforms)
export enum Platform {
  PC = 'PC',
  PLAYSTATION_5 = 'PlayStation 5',
  PLAYSTATION_4 = 'PlayStation 4',
  XBOX_SERIES = 'Xbox Series X/S',
  XBOX_ONE = 'Xbox One',
  NINTENDO_SWITCH = 'Nintendo Switch',
  MOBILE = 'Mobile',
  STEAM_DECK = 'Steam Deck',
  VR = 'VR'
}

// Sort direction enumeration
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

// View mode enumeration
export enum ViewMode {
  GRID = 'grid',
  LIST = 'list',
  TABLE = 'table'
}

// Theme enumeration
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

// Language enumeration
export enum Language {
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  DE = 'de',
  IT = 'it',
  PT = 'pt',
  RU = 'ru',
  JA = 'ja',
  KO = 'ko',
  ZH = 'zh'
}

// Privacy level enumeration
export enum PrivacyLevel {
  PUBLIC = 'public',
  FRIENDS = 'friends',
  PRIVATE = 'private'
}

// Notification type enumeration
export enum NotificationType {
  FRIEND_REQUEST = 'friend_request',
  GAME_RECOMMENDATION = 'game_recommendation',
  REVIEW_COMMENT = 'review_comment',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  SYSTEM_UPDATE = 'system_update',
  MAINTENANCE = 'maintenance'
}

// Activity type enumeration
export enum ActivityType {
  GAME_ADDED = 'game_added',
  GAME_COMPLETED = 'game_completed',
  GAME_RATED = 'game_rated',
  REVIEW_POSTED = 'review_posted',
  STATUS_CHANGED = 'status_changed',
  LIST_UPDATED = 'list_updated',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked'
}

// Cache type enumeration
export enum CacheType {
  GAME_SEARCH = 'game_search',
  GAME_DETAILS = 'game_details',
  TRENDING_GAMES = 'trending_games',
  NEW_RELEASES = 'new_releases',
  USER_STATS = 'user_stats',
  GENRE_LIST = 'genre_list',
  PLATFORM_LIST = 'platform_list'
}

// Error type enumeration
export enum ErrorType {
  VALIDATION_ERROR = 'validation_error',
  AUTHENTICATION_ERROR = 'authentication_error',
  AUTHORIZATION_ERROR = 'authorization_error',
  NOT_FOUND_ERROR = 'not_found_error',
  RATE_LIMIT_ERROR = 'rate_limit_error',
  EXTERNAL_API_ERROR = 'external_api_error',
  DATABASE_ERROR = 'database_error',
  UNKNOWN_ERROR = 'unknown_error'
}

// Log level enumeration
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

// API response status enumeration
export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  LOADING = 'loading',
  IDLE = 'idle'
}

// File upload status enumeration
export enum UploadStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  COMPLETED = 'completed',
  ERROR = 'error',
  CANCELLED = 'cancelled'
}

// Achievement rarity enumeration
export enum AchievementRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

// Achievement category enumeration
export enum AchievementCategory {
  GAMING = 'gaming',
  SOCIAL = 'social',
  COLLECTION = 'collection',
  MILESTONE = 'milestone',
  SPECIAL = 'special'
}

// Export utility functions for enums
export const GameStatusValues = Object.values(GameStatus);
export const GameStatusLabels = {
  [GameStatus.FINISHED]: 'Finished',
  [GameStatus.PLAYING]: 'Currently Playing',
  [GameStatus.DROPPED]: 'Dropped',
  [GameStatus.WANT]: 'Want to Play',
  [GameStatus.ON_HOLD]: 'On Hold'
};

export const GameStatusColors = {
  [GameStatus.FINISHED]: 'green',
  [GameStatus.PLAYING]: 'blue',
  [GameStatus.DROPPED]: 'red',
  [GameStatus.WANT]: 'purple',
  [GameStatus.ON_HOLD]: 'amber'
} as const;

// Helper functions
export function isValidGameStatus(status: string | null): status is GameStatusType {
  return GameStatusValues.includes(status as GameStatus) || status === null;
}

export function getGameStatusColor(status: GameStatusType): string {
  if (!status) return 'gray';
  return GameStatusColors[status as GameStatus] || 'gray';
}

export function getGameStatusLabel(status: GameStatusType): string {
  if (!status) return 'Not Set';
  return GameStatusLabels[status as GameStatus] || status;
}
