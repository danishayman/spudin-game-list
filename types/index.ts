// Main Types Export
// Central export point for all application types

// API Types
export * from './api/igdb';
export * from './api/supabase';

// Component Types - explicit exports to avoid conflicts
export type {
  // Game component types
  GameCardProps,
  PublicGameCardProps,
  GameCollectionProps,
  GameDetailsProps,
  GameStatusButtonsProps,
  GameRatingDialogProps,
  GameReviewsProps,
  GameSearchProps,
  GameLinksProps,
  GameExplorerHeroProps,
  GameListHeaderProps,
  UserGameEntry,
  GamesByStatus,
  // Renamed to avoid conflict with database GameReview
  GameReview as ComponentGameReview,
  GameListEntryComponent
} from './components/game';

export type {
  // User component types
  UserProfileStatsProps,
  UserStatsDisplayProps,
  UserGameCardProps,
  UserGameCollectionProps,
  UserGameListProps,
  ShareProfileButtonProps,
  UserGreetTextProps,
  UserStats,
  UserGame
} from './components/user';

export type {
  // Form component types
  LoginFormProps,
  SignUpFormProps,
  SettingsFormProps,
  RatingInputProps,
  ReviewInputProps,
  OAuthButtonProps
} from './components/forms';

export type {
  // UI component types
  ButtonProps,
  InputProps,
  DialogProps,
  ConfirmationDialogProps,
  TabsProps
} from './components/ui';

// Shared Types
export * from './shared/enums';
export * from './shared/common';

// Re-export commonly used types with shorter names for convenience
export type {
  // Game types
  IgdbGame as Game,
  IgdbSearchResponse as GameSearchResponse,
} from './api/igdb';

export type {
  // User types
  User,
  Profile,
} from './api/supabase';

export type {
  // Common types
  SearchParams,
  LoadingState,
  ErrorState,
  ApiResponse,
  PaginatedResponse,
} from './shared/common';

// Export type utilities
export type {
  OptionalExcept,
  RequiredExcept,
  PartialExcept,
  DeepPartial,
  DeepRequired,
  ComponentWithChildren,
  ComponentWithOptionalChildren,
} from './shared/common';
