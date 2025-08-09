// IGDB Service Layer
// High-level business logic for different game data operations

import { makeIgdbRequest, buildQuery } from './client';
import { convertIgdbToStandardFormat } from './transformer';
import { filterAdultContent, isAdultContent } from './content-filter';
import { IgdbGame, IgdbSearchResponse } from '../../../types/igdb';
import { SEARCH_CONFIG, TRENDING_CONFIG, NEW_RELEASES_CONFIG, GAME_DETAILS_CONFIG } from './config';
import { 
  getCachedSearchResults, 
  cacheSearchResults,
  getCachedGameDetails,
  cacheGameDetails,
  getCachedTrendingGames,
  cacheTrendingGames,
  getCachedNewReleases,
  cacheNewReleases,
  CACHE_TYPE
} from '../../utils/cacheUtils';
import { createClient } from '@/supabase/server';

/**
 * Search games from IGDB API
 */
export async function searchGames(query: string): Promise<IgdbSearchResponse> {
  // First, check the cache
  const cachedResults = await getCachedSearchResults(query);
  if (cachedResults) {
    console.log(`[IGDB Service] Using cached search results for query: ${query}`);
    return {
      ...cachedResults,
      results: filterAdultContent(cachedResults.results)
    };
  }

  console.log(`[IGDB Service] Fetching search results for query: ${query}`);
  
  const igdbQuery = buildQuery(
    ['cover.url', 'first_release_date', 'total_rating', 'total_rating_count', 
     'genres.name', 'platforms.name', 'summary', 'themes.id', 'age_ratings.rating'],
    `search "${query}"`,
    SEARCH_CONFIG.PAGE_SIZE
  );

  const igdbResults = await makeIgdbRequest('games', igdbQuery);
  
  // Convert IGDB format to our format
  const convertedResults = igdbResults.map(convertIgdbToStandardFormat);
  
  // Filter out adult content
  const filteredResults = filterAdultContent(convertedResults);
  
  const results: IgdbSearchResponse = {
    count: filteredResults.length,
    next: null,
    previous: null,
    results: filteredResults
  };
  
  // Cache the results
  await cacheSearchResults(query, results);
  
  return results;
}

/**
 * Get detailed game information by ID
 */
export async function getGameById(id: number): Promise<IgdbGame> {
  // First, check the cache
  const cachedGame = await getCachedGameDetails(id);
  if (cachedGame) {
    console.log(`[IGDB Service] Using cached game details for ID: ${id}`);
    return cachedGame;
  }

  console.log(`[IGDB Service] Fetching game details for ID: ${id}`);
  
  // Build comprehensive query for game details
  const baseFields = [
    'cover.url', 'first_release_date', 'total_rating', 'total_rating_count',
    'genres.name', 'platforms.name', 'summary', 'storyline', 'themes.name',
    'age_ratings.category', 'age_ratings.rating',
    'websites.url', 'websites.category', 'game_modes.name', 'player_perspectives.name',
    'involved_companies.company.name', 'involved_companies.developer', 'involved_companies.publisher',
    'category', 'status'
  ];

  // Add screenshots and additional fields if enabled
  const detailFields = GAME_DETAILS_CONFIG.INCLUDE_SCREENSHOTS ? [
    ...baseFields,
    'screenshots.url', 'videos.video_id', 'videos.name', 'artworks.url'
  ] : baseFields;

  const igdbQuery = buildQuery(detailFields, `where id = ${id}`);
  const igdbResults = await makeIgdbRequest('games', igdbQuery);
  
  if (!igdbResults || igdbResults.length === 0) {
    throw new Error(`Game with ID ${id} not found`);
  }
  
  const gameData = convertIgdbToStandardFormat(igdbResults[0]);
  
  // Check if this game contains adult content
  if (isAdultContent(gameData)) {
    console.log(`[IGDB Service] Blocked access to game "${gameData.name}" due to adult content`);
    throw new Error('This game contains content that is not suitable for display');
  }
  
  // Cache the game data
  await cacheGameDetails(id, gameData);
  
  return gameData;
}

/**
 * Get trending games
 */
export async function getTrendingGames(): Promise<IgdbSearchResponse> {
  // First, check the cache
  const cachedTrending = await getCachedTrendingGames();
  if (cachedTrending) {
    console.log('[IGDB Service] Using cached trending games');
    return {
      ...cachedTrending,
      results: filterAdultContent(cachedTrending.results)
    };
  }

  console.log('[IGDB Service] Fetching trending games');
  
  const igdbQuery = buildQuery(
    ['cover.url', 'first_release_date', 'total_rating', 'total_rating_count',
     'genres.name', 'platforms.name', 'summary', 'themes.id', 'age_ratings.rating'],
    'where total_rating_count > 50 & total_rating > 70',
    TRENDING_CONFIG.PAGE_SIZE,
    'total_rating desc'
  );

  const igdbResults = await makeIgdbRequest('games', igdbQuery);
  
  // Convert IGDB format to our format
  const convertedResults = igdbResults.map(convertIgdbToStandardFormat);
  
  // Filter out adult content
  const filteredResults = filterAdultContent(convertedResults);
  
  const results: IgdbSearchResponse = {
    count: filteredResults.length,
    next: null,
    previous: null,
    results: filteredResults
  };
  
  // Cache the results
  await cacheTrendingGames(results);
  
  return results;
}

/**
 * Get new releases with decent ratings
 */
export async function getNewReleases(): Promise<IgdbSearchResponse> {
  // First, check the cache
  try {
    const cachedNewReleases = await getCachedNewReleases();
    if (cachedNewReleases) {
      console.log('[IGDB Service] Using cached new releases');
      return {
        ...cachedNewReleases,
        results: filterAdultContent(cachedNewReleases.results)
      };
    }
  } catch (error) {
    console.error('[IGDB Service] Error checking cache:', error);
  }

  console.log('[IGDB Service] Fetching new releases');
  
  try {
    // Get current date and date from N months ago
    const now = new Date();
    const monthsAgo = new Date();
    monthsAgo.setMonth(now.getMonth() - NEW_RELEASES_CONFIG.MONTHS_BACK);
    
    // Convert to Unix timestamps
    const toDate = Math.floor(now.getTime() / 1000);
    const fromDate = Math.floor(monthsAgo.getTime() / 1000);

    const igdbQuery = buildQuery(
      ['cover.url', 'first_release_date', 'total_rating', 'total_rating_count',
       'genres.name', 'platforms.name', 'summary', 'themes.id', 'age_ratings.rating'],
      `where first_release_date >= ${fromDate} & first_release_date <= ${toDate} 
            & total_rating >= ${NEW_RELEASES_CONFIG.MIN_RATING} 
            & total_rating_count >= ${NEW_RELEASES_CONFIG.MIN_RATINGS_COUNT}`,
      NEW_RELEASES_CONFIG.PAGE_SIZE,
      'first_release_date desc'
    );
    
    const igdbResults = await makeIgdbRequest('games', igdbQuery);
    
    // Convert IGDB format to our format
    const convertedResults = igdbResults.map(convertIgdbToStandardFormat);
    
    // Filter out adult content
    const filteredResults = filterAdultContent(convertedResults);
    
    // If no results with strict criteria, try with more relaxed criteria
    if (filteredResults.length < 5) {
      console.log('[IGDB Service] Not enough results with strict criteria, trying with relaxed criteria');
      
      const relaxedQuery = buildQuery(
        ['cover.url', 'first_release_date', 'total_rating', 'total_rating_count',
         'genres.name', 'platforms.name', 'summary', 'themes.id', 'age_ratings.rating'],
        `where first_release_date >= ${fromDate} & first_release_date <= ${toDate} 
              & total_rating_count >= 1`,
        NEW_RELEASES_CONFIG.PAGE_SIZE,
        'total_rating desc'
      );
      
      const relaxedResults = await makeIgdbRequest('games', relaxedQuery);
      const convertedRelaxedResults = relaxedResults.map(convertIgdbToStandardFormat);
      const filteredRelaxedResults = filterAdultContent(convertedRelaxedResults);
      
      // Filter locally for games with minimum rating
      const finalResults = filteredRelaxedResults
        .filter((game: IgdbGame) => (game.total_rating || 0) >= NEW_RELEASES_CONFIG.MIN_RATING)
        .slice(0, NEW_RELEASES_CONFIG.FINAL_SIZE);
      
      const results: IgdbSearchResponse = {
        count: finalResults.length,
        next: null,
        previous: null,
        results: finalResults
      };
      
      await cacheNewReleases(results);
      return results;
    }
    
    // Limit to desired number of results
    const finalResults = filteredResults.slice(0, NEW_RELEASES_CONFIG.FINAL_SIZE);
    
    const results: IgdbSearchResponse = {
      count: finalResults.length,
      next: null,
      previous: null,
      results: finalResults
    };
    
    // Cache the results
    await cacheNewReleases(results);
    
    return results;
  } catch (error) {
    console.error('[IGDB Service] Error in getNewReleases:', error);
    
    // Try to get stale cache as last resort
    try {
      const supabase = await createClient();
      const cacheKey = 'new_releases';
      
      const { data, error: cacheError } = await supabase
        .from('game_cache')
        .select('data')
        .eq('cache_key', cacheKey)
        .eq('cache_type', CACHE_TYPE.NEW_RELEASES)
        .single();
      
      if (!cacheError && data) {
        console.log('[IGDB Service] Using stale cache as fallback');
        const fallbackData = data.data as IgdbSearchResponse;
        return {
          ...fallbackData,
          results: filterAdultContent(fallbackData.results)
        };
      }
    } catch (fallbackError) {
      console.error('[IGDB Service] Error getting fallback cache:', fallbackError);
    }
    
    // Return an empty result set if everything fails
    return { count: 0, next: null, previous: null, results: [] };
  }
}

/**
 * Get game series/collection information by game ID
 */
export async function getGameSeriesById(id: number): Promise<IgdbSearchResponse> {
  console.log(`[IGDB Service] Fetching game series for ID: ${id}`);
  
  // First, get the game details to find collection and franchise info
  const gameQuery = buildQuery(
    ['collection.id', 'collection.name', 'franchises.id', 'franchises.name'],
    `where id = ${id}`
  );
  
  const gameResults = await makeIgdbRequest('games', gameQuery);
  
  if (!gameResults || gameResults.length === 0) {
    console.log(`[IGDB Service] Game with ID ${id} not found for series lookup`);
    return {
      count: 0,
      next: null,
      previous: null,
      results: []
    };
  }
  
  const game = gameResults[0];
  const seriesGames: IgdbGame[] = [];
  
  // If the game has a collection, fetch games from that collection
  if (game.collection && game.collection.id) {
    console.log(`[IGDB Service] Found collection: ${game.collection.name} (ID: ${game.collection.id})`);
    
    const collectionQuery = buildQuery(
      ['cover.url', 'first_release_date', 'total_rating', 'total_rating_count',
       'genres.name', 'platforms.name', 'summary', 'themes.id', 'age_ratings.rating'],
      `where collection = ${game.collection.id} & id != ${id}`,
      20,
      'first_release_date asc'
    );
    
    const collectionResults = await makeIgdbRequest('games', collectionQuery);
    if (collectionResults && collectionResults.length > 0) {
      const convertedGames = collectionResults.map(convertIgdbToStandardFormat);
      const filteredGames = filterAdultContent(convertedGames);
      seriesGames.push(...filteredGames);
    }
  }
  
  // Add franchise games if needed and available
  if (game.franchises && game.franchises.length > 0 && seriesGames.length < 10) {
    for (const franchise of game.franchises) {
      console.log(`[IGDB Service] Found franchise: ${franchise.name} (ID: ${franchise.id})`);
      
      const franchiseQuery = buildQuery(
        ['cover.url', 'first_release_date', 'total_rating', 'total_rating_count',
         'genres.name', 'platforms.name', 'summary', 'themes.id', 'age_ratings.rating'],
        `where franchises = (${franchise.id}) & id != ${id}`,
        Math.max(1, 15 - seriesGames.length),
        'first_release_date asc'
      );
      
      const franchiseResults = await makeIgdbRequest('games', franchiseQuery);
      if (franchiseResults && franchiseResults.length > 0) {
        const convertedGames = franchiseResults.map(convertIgdbToStandardFormat);
        const filteredGames = filterAdultContent(convertedGames);
        
        // Avoid duplicates by checking if game ID already exists
        const existingIds = new Set(seriesGames.map(g => g.id));
        const newGames = filteredGames.filter(g => !existingIds.has(g.id));
        seriesGames.push(...newGames);
        
        if (seriesGames.length >= 15) break;
      }
    }
  }
  
  console.log(`[IGDB Service] Found ${seriesGames.length} games in series for game ID ${id}`);
  
  return {
    count: seriesGames.length,
    next: null,
    previous: null,
    results: seriesGames
  };
}
