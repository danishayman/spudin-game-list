// Game Component Types
// Props and interfaces for game-related components

import { IgdbGame } from '../api/igdb';
import { GameStatus } from '../shared/enums';

// GameCard component types
export interface GameCardProps {
  game: IgdbGame;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  onStatusChange?: (status: GameStatus) => void;
  onRatingChange?: (rating: number) => void;
}

// PublicGameCard component types  
export interface PublicGameCardProps {
  game: {
    id: number;
    name: string;
    background_image: string | null;
    released: string | null;
    rating: number | null;
    genres?: { id: number; name: string }[];
    user_status?: string | null;
    user_rating?: number | null;
    updated_at?: string;
  };
  showUserInfo?: boolean;
  compact?: boolean;
  className?: string;
}

// GameCollection component types
export interface GameCollectionProps {
  games: IgdbGame[];
  title?: string;
  viewMode?: 'grid' | 'list';
  sortBy?: 'name' | 'rating' | 'release_date' | 'user_rating';
  sortOrder?: 'asc' | 'desc';
  filterBy?: {
    status?: GameStatus[];
    genres?: string[];
    platforms?: string[];
    rating?: { min: number; max: number };
  };
  onGameSelect?: (game: IgdbGame) => void;
  onGameUpdate?: (gameId: number, updates: Partial<IgdbGame>) => void;
  loading?: boolean;
  className?: string;
}

// GameDetails component types
export interface GameDetailsProps {
  gameId: number;
  showUserActions?: boolean;
  className?: string;
}

export interface ScreenshotData {
  id: number;
  url: string;
  width?: number;
  height?: number;
}

// GameStatusButtons component types
export interface GameStatusButtonsProps {
  gameId?: number;
  initialStatus?: GameStatus;
  onChange?: (status: GameStatus) => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
}

// GameRatingDialog component types
export interface GameRatingDialogProps {
  gameId: number;
  gameName: string;
  gameImage?: string;
  gameReleased?: string;
  gameRating?: number;
  gameGenres?: Array<{ id: number; name: string }>;
  triggerComponent?: React.ReactNode;
  onUpdate?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface GameListEntryComponent {
  game_id: number;
  status: string | null;
  rating: number | null;
  review?: string | null;
}

// GameReviews component types
export interface GameReviewsProps {
  gameId: number;
  currentUserReview?: GameReview;
  onReviewUpdate?: (review: GameReview) => void;
  className?: string;
}

export interface GameReview {
  id: string;
  user_id: string;
  game_id: number;
  rating: number;
  review_text: string | null;
  is_spoiler: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
  };
}

export interface GameReviewsRef {
  refreshReviews: () => void;
}

// GameSearch component types
export interface GameSearchProps {
  onGameSelect?: (game: IgdbGame) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

export interface SearchResult extends IgdbGame {
  // Additional fields that might come from search
  search_score?: number;
  search_highlight?: string;
}

// GameLinks component types
export interface GameLink {
  type: 'steam' | 'epic' | 'gog' | 'playstation' | 'xbox' | 'nintendo' | 'website' | 'other';
  name: string;
  url: string;
  icon?: string;
}

export interface GameLinksProps {
  links: GameLink[];
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'grid';
}

// GameExplorerHero component types
export interface GameExplorerHeroProps {
  featuredGames?: IgdbGame[];
  onSearch?: (query: string) => void;
  onGameSelect?: (game: IgdbGame) => void;
  className?: string;
}

// GameListHeader component types
export interface GameListHeaderProps {
  title: string;
  count?: number;
  sortOptions?: SortOption[];
  filterOptions?: FilterOption[];
  viewMode?: 'grid' | 'list';
  onSortChange?: (sort: string) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onSearch?: (query: string) => void;
  className?: string;
}

export interface SortOption {
  value: string;
  label: string;
  direction?: 'asc' | 'desc';
}

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'boolean';
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
}

// Game utility types
export interface GameFilters {
  search?: string;
  status?: GameStatus[];
  genres?: string[];
  platforms?: string[];
  rating?: { min: number; max: number };
  releaseYear?: { min: number; max: number };
  developer?: string[];
  publisher?: string[];
}

export interface GameSortOptions {
  field: 'name' | 'rating' | 'release_date' | 'user_rating' | 'updated_at' | 'created_at';
  direction: 'asc' | 'desc';
}

// Game action types
export interface GameActions {
  addToList: (gameId: number, status: GameStatus) => Promise<void>;
  updateStatus: (gameId: number, status: GameStatus) => Promise<void>;
  updateRating: (gameId: number, rating: number) => Promise<void>;
  updateReview: (gameId: number, review: string) => Promise<void>;
  removeFromList: (gameId: number) => Promise<void>;
}

// User game entry type (for actions)
export interface UserGameEntry {
  game_id: number;
  status: string | null;
  rating: number | null;
  updated_at: string;
  games: {
    id: number;
    name: string;
    background_image: string | null;
    released: string | null;
    rating: number | null;
    genres?: { id: number; name: string }[];
  } | null;
}

// Game list types by status
export interface GamesByStatus {
  [key: string]: UserGameEntry[];
}
