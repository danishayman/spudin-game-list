// IGDB API Configuration
// All configuration parameters centralized here

// =============================================================================
// CONFIGURATION PARAMETERS - Adjust these values as needed
// =============================================================================

// API Configuration
export const IGDB_CONFIG = {
  CLIENT_ID: process.env.IGDB_CLIENT_ID,
  CLIENT_SECRET: process.env.IGDB_CLIENT_SECRET,
  BASE_URL: 'https://api.igdb.com/v4',
  OAUTH_URL: 'https://id.twitch.tv/oauth2/token',
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  REVALIDATION_TIME: 3600, // 1 hour in seconds
} as const;

// Search Configuration
export const SEARCH_CONFIG = {
  PAGE_SIZE: 50,
} as const;

// Game Details Configuration
export const GAME_DETAILS_CONFIG = {
  INCLUDE_SCREENSHOTS: true,
} as const;

// Trending Games Configuration
export const TRENDING_CONFIG = {
  PAGE_SIZE: 50,
} as const;

// New Releases Configuration
export const NEW_RELEASES_CONFIG = {
  MONTHS_BACK: 1, // How many months back to search for new releases
  PAGE_SIZE: 50, // Initial fetch size (gets filtered down)
  FINAL_SIZE: 25, // Final number of results to return
  MIN_RATING: 60, // Minimum IGDB total rating (0-100)
  MIN_RATINGS_COUNT: 0, // Minimum number of ratings required
} as const;

// Content Filtering Configuration
export const CONTENT_FILTER_CONFIG = {
  ENABLED: true, // Set to false to disable content filtering
  BLOCKED_ESRB_RATINGS: [] as number[], // No ESRB ratings blocked by default
  BLOCKED_THEMES: [42] as number[], // Block games with adult themes (Theme ID 42 = Erotic)
} as const;

// Validation
export function validateConfig(): void {
  if (!IGDB_CONFIG.CLIENT_ID || !IGDB_CONFIG.CLIENT_SECRET) {
    throw new Error('IGDB Client ID and Client Secret are required');
  }
}
