// User Component Types
// Props and interfaces for user-related components

import { Profile, User } from '../api/supabase';

// UserProfileStats component types
export interface UserProfileStatsProps {
  stats: {
    counts: Record<string, number> & {
      Playing?: number;
      Finished?: number;
      Want?: number;
      'On-hold'?: number;
      Dropped?: number;
      Total?: number;
    };
    averageRating: number;
    totalRated: number;
  };
  className?: string;
}

export interface StatCardProps {
  value: number;
  label: string;
  color: 'blue' | 'green' | 'purple' | 'amber' | 'red' | 'slate';
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

// UserStatsDisplay component types
export interface UserStatsDisplayProps {
  stats: UserStats;
  className?: string;
  variant?: 'compact' | 'detailed' | 'minimal';
}

export interface UserStats {
  totalGames: number;
  gamesFinished: number;
  gamesPlaying: number;
  gamesWantToPlay: number;
  gamesOnHold: number;
  gamesDropped: number;
  averageRating: number;
  totalReviews: number;
  recentActivity: string | null; // Changed to match existing implementation
  favoriteGenres?: Array<{ name: string; count: number }>;
  gamingStreak?: number;
  timeSpentGaming?: number; // in hours
}

// UserGameCard component types
export interface UserGameCardProps {
  game: UserGame;
  onStatusChange?: (gameId: number, status: string) => void;
  onRatingChange?: (gameId: number, rating: number) => void;
  onReviewChange?: (gameId: number, review: string) => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

export interface UserGame {
  id: number;
  name: string;
  background_image: string | null;
  released: string | null;
  rating: number | null;
  genres?: Array<{ id: number; name: string }>;
  user_status: string | null;
  user_rating: number | null;
  user_review?: string | null;
  updated_at: string;
  progress?: number; // 0-100 percentage
  time_played?: number; // in hours
  date_started?: string;
  date_finished?: string;
}

// UserGameCollection component types
export interface UserGameCollectionProps {
  games: UserGame[];
  viewMode?: 'grid' | 'list' | 'table';
  groupBy?: 'status' | 'genre' | 'rating' | 'date';
  sortBy?: 'name' | 'rating' | 'date_added' | 'date_finished' | 'user_rating';
  sortOrder?: 'asc' | 'desc';
  onGameUpdate?: (gameId: number, updates: Partial<UserGame>) => void;
  onBulkAction?: (gameIds: number[], action: string) => void;
  selectable?: boolean;
  className?: string;
}

// UserGameList component types
export interface UserGameListProps {
  userId?: string;
  status?: string;
  limit?: number;
  showPagination?: boolean;
  onGameSelect?: (game: UserGame) => void;
  className?: string;
}

// ShareProfileButton component types
export interface ShareProfileButtonProps {
  username: string;
  fullName?: string | null;
  className?: string;
  variant?: 'button' | 'icon' | 'link';
}

// UserGreetText component types
export interface UserGreetTextProps {
  user: User;
  profile?: Profile | null;
  showStats?: boolean;
  showRecentActivity?: boolean;
  className?: string;
}

// Profile management types
export interface ProfileFormData {
  full_name: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  social_links?: {
    twitter?: string;
    discord?: string;
    twitch?: string;
    youtube?: string;
  };
  privacy_settings?: {
    profile_visibility: 'public' | 'friends' | 'private';
    show_email: boolean;
    show_stats: boolean;
    show_activity: boolean;
    show_reviews: boolean;
  };
  notification_settings?: {
    email_notifications: boolean;
    friend_requests: boolean;
    game_recommendations: boolean;
    review_comments: boolean;
  };
}

// Activity feed types
export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'game_added' | 'game_completed' | 'game_rated' | 'review_posted' | 'status_changed';
  game_id?: number;
  game_name?: string;
  old_value?: string | number;
  new_value?: string | number;
  description: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface UserActivityFeedProps {
  userId?: string;
  activities: UserActivity[];
  limit?: number;
  showGameThumbnails?: boolean;
  compact?: boolean;
  className?: string;
}

// Friend/Follow system types
export interface UserRelationship {
  id: string;
  follower_id: string;
  following_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
}

export interface UserFollowButtonProps {
  targetUserId: string;
  currentRelationship?: UserRelationship | null;
  onRelationshipChange?: (relationship: UserRelationship | null) => void;
  className?: string;
}

// User search and discovery types
export interface UserSearchProps {
  onUserSelect?: (user: Profile) => void;
  placeholder?: string;
  showStats?: boolean;
  className?: string;
}

export interface UserSearchResult extends Profile {
  follower_count?: number;
  following_count?: number;
  game_count?: number;
  mutual_friends?: number;
}

// Achievement system types
export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  progress?: number;
  metadata?: Record<string, any>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'gaming' | 'social' | 'collection' | 'milestone';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirements: Record<string, any>;
  points: number;
}

export interface UserAchievementsProps {
  userId?: string;
  achievements: UserAchievement[];
  showProgress?: boolean;
  filterBy?: Achievement['category'][];
  className?: string;
}
