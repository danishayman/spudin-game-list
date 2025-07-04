// RAWG API wrapper
// Documentation: https://rawg.io/apidocs
import { 
  getCachedSearchResults, 
  cacheSearchResults,
  getCachedGameDetails,
  cacheGameDetails,
  getCachedTrendingGames,
  cacheTrendingGames,
  getCachedNewReleases,
  cacheNewReleases
} from './cache-utils';

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = 'https://api.rawg.io/api';

export type RawgGame = {
  id: number;
  name: string;
  background_image: string | null;
  released: string | null;
  rating: number;
  metacritic: number | null;
  genres: { id: number; name: string }[];
  platforms: { platform: { id: number; name: string } }[];
  // Additional fields for detailed view
  description?: string;
  description_raw?: string;
  background_image_additional?: string | null;
  website?: string | null;
  developers?: { id: number; name: string; image_background?: string }[];
  publishers?: { id: number; name: string; image_background?: string }[];
  esrb_rating?: { id: number; name: string; slug: string } | null;
  screenshots?: { id: number; image: string; width: number; height: number }[];
  stores?: { id: number; store: { id: number; name: string; domain?: string; slug: string } }[];
  tags?: { id: number; name: string; slug: string }[];
  playtime?: number;
  updated?: string;
  ratings?: { id: number; title: string; count: number; percent: number }[];
  reddit_url?: string | null;
  reddit_name?: string | null;
  reddit_description?: string | null;
  reddit_logo?: string | null;
  metacritic_url?: string | null;
};

export type RawgSearchResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgGame[];
};

/**
 * Search games from RAWG API
 * This function should only be called from server components or API routes
 */
export async function searchGames(query: string): Promise<RawgSearchResponse> {
  // First, check the cache
  const cachedResults = await getCachedSearchResults(query);
  if (cachedResults) {
    console.log(`[Cache] Using cached search results for query: ${query}`);
    return cachedResults;
  }

  console.log(`[API] Fetching search results for query: ${query}`);
  
  if (!RAWG_API_KEY) {
    throw new Error('RAWG API key is not defined');
  }

  const url = new URL(`${RAWG_BASE_URL}/games`);
  url.searchParams.append('key', RAWG_API_KEY);
  url.searchParams.append('search', query);
  url.searchParams.append('page_size', '10');

  const response = await fetch(url.toString(), { 
    cache: 'no-store' 
  });
  
  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status}`);
  }
  
  const results = await response.json();
  
  // Cache the results
  await cacheSearchResults(query, results);
  
  return results;
}

/**
 * Get detailed game information by ID
 * This function should only be called from server components or API routes
 */
export async function getGameById(id: number): Promise<RawgGame> {
  // First, check the cache
  const cachedGame = await getCachedGameDetails(id);
  if (cachedGame) {
    console.log(`[Cache] Using cached game details for ID: ${id}`);
    return cachedGame;
  }

  console.log(`[API] Fetching game details for ID: ${id}`);
  
  if (!RAWG_API_KEY) {
    throw new Error('RAWG API key is not defined');
  }

  const url = new URL(`${RAWG_BASE_URL}/games/${id}`);
  url.searchParams.append('key', RAWG_API_KEY);

  // Request game details
  const response = await fetch(url.toString(), { 
    cache: 'no-store' 
  });
  
  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status}`);
  }
  
  const gameData = await response.json();
  
  // Get screenshots
  const screenshotsUrl = new URL(`${RAWG_BASE_URL}/games/${id}/screenshots`);
  screenshotsUrl.searchParams.append('key', RAWG_API_KEY);
  
  try {
    const screenshotsResponse = await fetch(screenshotsUrl.toString(), {
      cache: 'no-store'
    });
    
    if (screenshotsResponse.ok) {
      const screenshotsData = await screenshotsResponse.json();
      if (screenshotsData.results && Array.isArray(screenshotsData.results)) {
        gameData.screenshots = screenshotsData.results;
      }
    }
  } catch (error) {
    console.error("Error fetching screenshots:", error);
    // Continue without screenshots if there's an error
  }
  
  // Cache the game data
  await cacheGameDetails(id, gameData);
  
  return gameData;
}

/**
 * Get trending games
 * This function should only be called from server components or API routes
 */
export async function getTrendingGames(): Promise<RawgSearchResponse> {
  // First, check the cache
  const cachedTrending = await getCachedTrendingGames();
  if (cachedTrending) {
    console.log('[Cache] Using cached trending games');
    return cachedTrending;
  }

  console.log('[API] Fetching trending games');
  
  if (!RAWG_API_KEY) {
    throw new Error('RAWG API key is not defined');
  }

  const url = new URL(`${RAWG_BASE_URL}/games`);
  url.searchParams.append('key', RAWG_API_KEY);
  url.searchParams.append('ordering', '-added');
  url.searchParams.append('page_size', '10');

  const response = await fetch(url.toString(), { 
    cache: 'no-store' 
  });
  
  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status}`);
  }
  
  const results = await response.json();
  
  // Cache the results
  await cacheTrendingGames(results);
  
  return results;
}

/**
 * Get new releases with decent ratings
 * This function should only be called from server components or API routes
 */
export async function getNewReleases(): Promise<RawgSearchResponse> {
  // First, check the cache
  const cachedNewReleases = await getCachedNewReleases();
  if (cachedNewReleases) {
    console.log('[Cache] Using cached new releases');
    return cachedNewReleases;
  }

  console.log('[API] Fetching new releases');
  
  if (!RAWG_API_KEY) {
    throw new Error('RAWG API key is not defined');
  }

  // Get current date and date from 3 months ago
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  
  // Format dates as YYYY-MM-DD
  const toDate = now.toISOString().split('T')[0];
  const fromDate = threeMonthsAgo.toISOString().split('T')[0];

  const url = new URL(`${RAWG_BASE_URL}/games`);
  url.searchParams.append('key', RAWG_API_KEY);
  url.searchParams.append('dates', `${fromDate},${toDate}`);
  url.searchParams.append('ordering', '-released');  // Sort by release date, newest first
  url.searchParams.append('page_size', '20');  // Increased page size to get more results to filter from
  
  // Filter for decent ratings (minimum 70/100 on Metacritic or 3.5/5 on RAWG rating)
  url.searchParams.append('metacritic', '60,100');  // Games with Metacritic score between 70 and 100
  
  const response = await fetch(url.toString(), { 
    cache: 'no-store' 
  });
  
  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status}`);
  }
  
  const results = await response.json();
  
  // If no results with Metacritic filter, try with minimum rating instead
  if (!results.results || results.results.length < 5) {
    console.log('[API] Not enough results with Metacritic filter, trying with rating filter');
    
    const ratingUrl = new URL(`${RAWG_BASE_URL}/games`);
    ratingUrl.searchParams.append('key', RAWG_API_KEY);
    ratingUrl.searchParams.append('dates', `${fromDate},${toDate}`);
    ratingUrl.searchParams.append('ordering', '-released');
    ratingUrl.searchParams.append('page_size', '20');
    ratingUrl.searchParams.append('ratings_count', '5');  // At least 5 ratings
    
    const ratingResponse = await fetch(ratingUrl.toString(), { 
      cache: 'no-store' 
    });
    
    if (!ratingResponse.ok) {
      throw new Error(`RAWG API error: ${ratingResponse.status}`);
    }
    
    const ratingResults = await ratingResponse.json();
    
    // Filter locally for games with at least 3.5 rating
    if (ratingResults.results && ratingResults.results.length > 0) {
      ratingResults.results = ratingResults.results.filter((game: RawgGame) => game.rating >= 3.5);
      
      // Limit to 10 results after filtering
      ratingResults.results = ratingResults.results.slice(0, 10);
      
      // Cache these results
      await cacheNewReleases(ratingResults);
      
      return ratingResults;
    }
  }
  
  // Limit to 10 results
  if (results.results && results.results.length > 10) {
    results.results = results.results.slice(0, 10);
  }
  
  // Cache the results
  await cacheNewReleases(results);
  
  return results;
} 