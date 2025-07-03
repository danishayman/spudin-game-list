// RAWG API wrapper
// Documentation: https://rawg.io/apidocs
import { 
  getCachedSearchResults, 
  cacheSearchResults,
  getCachedGameDetails,
  cacheGameDetails,
  getCachedTrendingGames,
  cacheTrendingGames
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

  const response = await fetch(url.toString(), { 
    cache: 'no-store' 
  });
  
  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status}`);
  }
  
  const gameData = await response.json();
  
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