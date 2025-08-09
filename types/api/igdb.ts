// IGDB API Types
// Types for IGDB (Internet Game Database) API integration

// Core IGDB game type
export interface IgdbGame {
  id: number;
  name: string;
  cover?: IgdbCover;
  first_release_date?: number; // Unix timestamp
  total_rating?: number; // 0-100
  total_rating_count?: number;
  genres?: IgdbGenre[];
  platforms?: IgdbPlatform[];
  // Additional fields for detailed view
  summary?: string;
  storyline?: string;
  screenshots?: IgdbScreenshot[];
  videos?: IgdbVideo[];
  websites?: IgdbWebsite[];
  involved_companies?: IgdbInvolvedCompany[];
  age_ratings?: IgdbAgeRating[];
  themes?: IgdbTheme[];
  game_modes?: IgdbGameMode[];
  player_perspectives?: IgdbPlayerPerspective[];
  // Comprehensive IGDB fields
  artworks?: IgdbArtwork[];
  collection?: IgdbCollection;
  franchises?: IgdbFranchise[];
  similar_games?: IgdbSimilarGame[];
  dlcs?: IgdbGameReference[];
  expansions?: IgdbGameReference[];
  standalone_expansions?: IgdbGameReference[];
  remakes?: IgdbGameReference[];
  remasters?: IgdbGameReference[];
  ports?: IgdbGameReference[];
  forks?: IgdbGameReference[];
  category?: number; // Game category (main game, DLC, etc.)
  status?: number; // Release status
  version_parent?: IgdbGameReference;
  version_title?: string;
  time_to_beat?: IgdbTimeToBeat;
  // User-specific fields (added by application)
  user_status?: string | null;
  user_rating?: number | null;
  in_user_list?: boolean;
  // Compatibility fields for legacy support
  background_image?: string | null;
  released?: string | null;
  rating?: number;
  metacritic?: number | null;
  developers?: IgdbDeveloper[];
  publishers?: IgdbPublisher[];
  tags?: IgdbTag[];
  // Additional compatibility fields
  background_image_additional?: string | null;
  description_raw?: string;
  website?: string | null;
  metacritic_url?: string | null;
  reddit_url?: string | null;
  reddit_name?: string | null;
  reddit_description?: string | null;
  playtime?: number | null;
  esrb_rating?: IgdbESRBRating | null;
  stores?: IgdbStore[];
}

// Raw IGDB API response types (before transformation)
export interface IgdbRawGame {
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
  dlcs?: Array<{ id: number; name: string; first_release_date?: number }>;
  expansions?: Array<{ id: number; name: string; first_release_date?: number }>;
  standalone_expansions?: Array<{ id: number; name: string; first_release_date?: number }>;
  remakes?: Array<{ id: number; name: string; first_release_date?: number }>;
  remasters?: Array<{ id: number; name: string; first_release_date?: number }>;
  ports?: Array<{ id: number; name: string; first_release_date?: number }>;
  forks?: Array<{ id: number; name: string; first_release_date?: number }>;
  category?: number;
  status?: number;
  version_parent?: { id: number; name: string };
  version_title?: string;
  time_to_beat?: {
    hastly?: number;
    normally?: number;
    completely?: number;
  };
  [key: string]: unknown; // Allow additional fields from IGDB API
}

// IGDB sub-types
export interface IgdbCover {
  id: number;
  url: string;
  width: number;
  height: number;
}

export interface IgdbGenre {
  id: number;
  name: string;
}

export interface IgdbPlatform {
  id: number;
  name: string;
}

export interface IgdbScreenshot {
  id: number;
  url: string;
  width: number;
  height: number;
}

export interface IgdbVideo {
  id: number;
  video_id: string;
  name: string;
}

export interface IgdbWebsite {
  id: number;
  url: string;
  category: number;
}

export interface IgdbInvolvedCompany {
  id: number;
  company: { id: number; name: string };
  developer: boolean;
  publisher: boolean;
}

export interface IgdbAgeRating {
  id: number;
  category: number;
  rating: number;
}

export interface IgdbTheme {
  id: number;
  name: string;
}

export interface IgdbGameMode {
  id: number;
  name: string;
}

export interface IgdbPlayerPerspective {
  id: number;
  name: string;
}

export interface IgdbArtwork {
  id: number;
  url: string;
  width: number;
  height: number;
}

export interface IgdbCollection {
  id: number;
  name: string;
  games?: Array<{ id: number; name: string; first_release_date?: number }>;
}

export interface IgdbFranchise {
  id: number;
  name: string;
}

export interface IgdbSimilarGame {
  id: number;
  name: string;
  cover?: { id: number; url: string };
  total_rating?: number;
}

export interface IgdbGameReference {
  id: number;
  name: string;
  first_release_date?: number;
}

export interface IgdbTimeToBeat {
  hastly?: number;
  normally?: number;
  completely?: number;
}

export interface IgdbDeveloper {
  id: number;
  name: string;
}

export interface IgdbPublisher {
  id: number;
  name: string;
}

export interface IgdbTag {
  id: number;
  name: string;
}

export interface IgdbESRBRating {
  id: number;
  name: string;
}

export interface IgdbStore {
  id: number;
  store: {
    id: number;
    name: string;
    domain?: string;
    slug: string;
  };
}

// Search response types
export interface IgdbSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IgdbGame[];
}

// OAuth token response
export interface IgdbTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

// Export compatibility types for backward compatibility
export type RawgSearchResponse = IgdbSearchResponse;
