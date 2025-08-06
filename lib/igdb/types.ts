// IGDB API Types
// Centralized type definitions for IGDB API

export type IgdbGame = {
  id: number;
  name: string;
  cover?: {
    id: number;
    url: string;
    width: number;
    height: number;
  };
  first_release_date?: number; // Unix timestamp
  total_rating?: number; // 0-100
  total_rating_count?: number;
  genres?: Array<{ id: number; name: string }>;
  platforms?: Array<{ id: number; name: string }>;
  // Additional fields for detailed view
  summary?: string;
  storyline?: string;
  screenshots?: Array<{ id: number; url: string; width: number; height: number }>;
  videos?: Array<{ id: number; video_id: string; name: string }>;
  websites?: Array<{ id: number; url: string; category: number }>;
  involved_companies?: Array<{
    id: number;
    company: { id: number; name: string };
    developer: boolean;
    publisher: boolean;
  }>;
  age_ratings?: Array<{ id: number; category: number; rating: number }>;
  themes?: Array<{ id: number; name: string }>;
  game_modes?: Array<{ id: number; name: string }>;
  player_perspectives?: Array<{ id: number; name: string }>;
  // New comprehensive IGDB fields
  artworks?: Array<{ id: number; url: string; width: number; height: number }>;
  collection?: {
    id: number;
    name: string;
    games?: Array<{ id: number; name: string; first_release_date?: number }>;
  };
  franchises?: Array<{ id: number; name: string }>;
  similar_games?: Array<{ 
    id: number; 
    name: string; 
    cover?: { id: number; url: string };
    total_rating?: number;
  }>;
  dlcs?: Array<{ id: number; name: string; first_release_date?: number }>;
  expansions?: Array<{ id: number; name: string; first_release_date?: number }>;
  standalone_expansions?: Array<{ id: number; name: string; first_release_date?: number }>;
  remakes?: Array<{ id: number; name: string; first_release_date?: number }>;
  remasters?: Array<{ id: number; name: string; first_release_date?: number }>;
  ports?: Array<{ id: number; name: string; first_release_date?: number }>;
  forks?: Array<{ id: number; name: string; first_release_date?: number }>;
  category?: number; // Game category (main game, DLC, etc.)
  status?: number; // Release status
  version_parent?: { id: number; name: string };
  version_title?: string;
  time_to_beat?: {
    hastly?: number;
    normally?: number;
    completely?: number;
  };
  // User-specific fields for games in user's list (added by application)
  user_status?: string | null;
  user_rating?: number | null;
  in_user_list?: boolean;
  // Compatibility fields to match RAWG structure
  background_image?: string | null;
  released?: string | null;
  rating?: number;
  metacritic?: number | null;
  // Additional fields for compatibility with existing components
  developers?: Array<{ id: number; name: string }>;
  publishers?: Array<{ id: number; name: string }>;
  tags?: Array<{ id: number; name: string }>;
  // Additional RAWG compatibility fields
  background_image_additional?: string | null;
  description_raw?: string;
  website?: string | null;
  metacritic_url?: string | null;
  reddit_url?: string | null;
  reddit_name?: string | null;
  reddit_description?: string | null;
  playtime?: number | null;
  esrb_rating?: { id: number; name: string } | null;
  stores?: Array<{ id: number; store: { id: number; name: string; domain?: string; slug: string } }>;
};

export type IgdbSearchResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: IgdbGame[];
};

// Raw IGDB API response types (before conversion)
export type IgdbRawGame = {
  id: number;
  name: string;
  cover?: { id: number; url: string; width?: number; height?: number };
  first_release_date?: number;
  total_rating?: number;
  total_rating_count?: number;
  genres?: Array<{ id: number; name: string }>;
  platforms?: Array<{ id: number; name: string }>;
  summary?: string;
  storyline?: string;
  screenshots?: Array<{ id: number; url: string; width?: number; height?: number }>;
  videos?: Array<{ id: number; video_id: string; name: string }>;
  websites?: Array<{ id: number; url: string; category: number }>;
  involved_companies?: Array<{
    id: number;
    company: { id: number; name: string };
    developer: boolean;
    publisher: boolean;
  }>;
  age_ratings?: Array<{ id: number; category: number; rating: number }>;
  themes?: Array<{ id: number; name: string }> | Array<number>;
  game_modes?: Array<{ id: number; name: string }>;
  player_perspectives?: Array<{ id: number; name: string }>;
  artworks?: Array<{ id: number; url: string; width?: number; height?: number }>;
  collection?: {
    id: number;
    name: string;
    games?: Array<{ id: number; name: string; first_release_date?: number }>;
  };
  franchises?: Array<{ id: number; name: string }>;
  similar_games?: Array<{ 
    id: number; 
    name: string; 
    cover?: { id: number; url: string };
    total_rating?: number;
  }>;
  [key: string]: unknown; // Allow additional fields from IGDB API
};

// OAuth token response
export type IgdbTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

// Export compatibility types
export type RawgGame = IgdbGame;
export type RawgSearchResponse = IgdbSearchResponse;
