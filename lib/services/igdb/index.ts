// IGDB API Main Entry Point
// Clean interface for the rest of the application

import { validateConfig } from './config';
import {
  searchGames as _searchGames,
  getGameById as _getGameById,
  getTrendingGames as _getTrendingGames,
  getNewReleases as _getNewReleases,
  getGameSeriesById as _getGameSeriesById
} from './service';

// Re-export types for convenience
export type { IgdbGame, IgdbSearchResponse, RawgSearchResponse } from '../../../types/igdb';

// Initialize and validate configuration on import
try {
  validateConfig();
} catch (error) {
  console.error('[IGDB] Configuration validation failed:', error);
}

/**
 * Search games from IGDB API
 * This function should only be called from server components or API routes
 */
export const searchGames = _searchGames;

/**
 * Get detailed game information by ID
 * This function should only be called from server components or API routes
 */
export const getGameById = _getGameById;

/**
 * Get trending games
 * This function should only be called from server components or API routes
 */
export const getTrendingGames = _getTrendingGames;

/**
 * Get new releases with decent ratings
 * This function should only be called from server components or API routes
 */
export const getNewReleases = _getNewReleases;

/**
 * Get game series/collection information by game ID
 * This function should only be called from server components or API routes
 */
export const getGameSeriesById = _getGameSeriesById;
