// IGDB API wrapper - Refactored and modular
// This file now acts as a compatibility layer for the existing codebase
// The actual implementation is split into modular files in the ./igdb/ directory

export {
  searchGames,
  getGameById,
  getTrendingGames,
  getNewReleases,
  getGameSeriesById,
  type IgdbGame,
  type IgdbSearchResponse,
  type RawgGame,
  type RawgSearchResponse
} from './igdb/index';

// Note: This file maintains backward compatibility while the implementation
// has been refactored into the following modular structure:
// - ./igdb/config.ts - Configuration management
// - ./igdb/types.ts - Type definitions
// - ./igdb/auth.ts - Authentication handling
// - ./igdb/client.ts - HTTP client
// - ./igdb/content-filter.ts - Content filtering
// - ./igdb/transformer.ts - Data transformation
// - ./igdb/service.ts - Business logic
// - ./igdb/index.ts - Main entry point