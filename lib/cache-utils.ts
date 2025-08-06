import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { IgdbGame, IgdbSearchResponse } from './igdb';

// Cache types
export const CACHE_TYPE = {
  SEARCH: 'search',
  GAME_DETAILS: 'game_details',
  TRENDING: 'trending',
  NEW_RELEASES: 'new_releases',
};

// Cache expiration in milliseconds
const DEFAULT_CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const CACHE_EXPIRATION = {
  [CACHE_TYPE.SEARCH]: 7 * 24 * 60 * 60 * 1000,       // 7 days
  [CACHE_TYPE.GAME_DETAILS]: 14 * 24 * 60 * 60 * 1000, // 14 days
  [CACHE_TYPE.TRENDING]: 3 * 24 * 60 * 60 * 1000,     // 3 days
  [CACHE_TYPE.NEW_RELEASES]: 24 * 60 * 60 * 1000,     // 1 day
};

/**
 * Check if a cache entry is expired
 */
export function isCacheExpired(lastUpdated: string, cacheType: string): boolean {
  const lastUpdatedDate = new Date(lastUpdated);
  const now = new Date();
  const expirationTime = CACHE_EXPIRATION[cacheType as keyof typeof CACHE_EXPIRATION] || DEFAULT_CACHE_EXPIRATION;
  return now.getTime() - lastUpdatedDate.getTime() > expirationTime;
}

/**
 * Get cached search results
 */
export async function getCachedSearchResults(query: string): Promise<IgdbSearchResponse | null> {
  const supabase = await createClient();
  const cacheKey = `search:${query.toLowerCase().trim()}`;
  
  console.log(`[CACHE] Checking cache for search: ${cacheKey}`);
  
  const { data, error } = await supabase
    .from('game_cache')
    .select('data, last_updated')
    .eq('cache_key', cacheKey)
    .eq('cache_type', CACHE_TYPE.SEARCH)
    .single();
  
  if (error) {
    console.log(`[CACHE] Error fetching from cache: ${error.message}`);
    return null;
  }
  
  if (!data) {
    console.log(`[CACHE] No cached data found for: ${cacheKey}`);
    return null;
  }
  
  // Check if cache is expired
  if (isCacheExpired(data.last_updated, CACHE_TYPE.SEARCH)) {
    console.log(`[CACHE] Expired cache for: ${cacheKey}, last updated: ${data.last_updated}`);
    return null;
  }
  
  console.log(`[CACHE] Cache hit for: ${cacheKey}`);
  return data.data as IgdbSearchResponse;
}

/**
 * Cache search results
 */
export async function cacheSearchResults(query: string, results: IgdbSearchResponse): Promise<void> {
  try {
    // Use admin client to bypass RLS policies
    const supabase = createAdminClient();
    const cacheKey = `search:${query.toLowerCase().trim()}`;
    
    console.log(`[CACHE] Storing in cache: ${cacheKey}`);
    
    // Use upsert to handle both insert and update cases
    const { error } = await supabase
      .from('game_cache')
      .upsert({
        cache_key: cacheKey,
        data: results,
        cache_type: CACHE_TYPE.SEARCH,
        last_updated: new Date().toISOString(),
      }, {
        onConflict: 'cache_key',
      });
      
    if (error) {
      console.error(`[CACHE] Error storing in cache: ${error.message}`, error);
    } else {
      console.log(`[CACHE] Successfully stored in cache: ${cacheKey}`);
    }
  } catch (error) {
    console.error('[CACHE] Exception while caching search results:', error);
  }
}

/**
 * Get cached game details
 */
export async function getCachedGameDetails(gameId: number): Promise<IgdbGame | null> {
  const supabase = await createClient();
  const cacheKey = `game:${gameId}`;
  
  console.log(`[CACHE] Checking cache for game: ${cacheKey}`);
  
  const { data, error } = await supabase
    .from('game_cache')
    .select('data, last_updated')
    .eq('cache_key', cacheKey)
    .eq('cache_type', CACHE_TYPE.GAME_DETAILS)
    .single();
  
  if (error) {
    console.log(`[CACHE] Error fetching from cache: ${error.message}`);
    return null;
  }
  
  if (!data) {
    console.log(`[CACHE] No cached data found for: ${cacheKey}`);
    return null;
  }
  
  // Check if cache is expired
  if (isCacheExpired(data.last_updated, CACHE_TYPE.GAME_DETAILS)) {
    console.log(`[CACHE] Expired cache for: ${cacheKey}, last updated: ${data.last_updated}`);
    return null;
  }
  
  console.log(`[CACHE] Cache hit for: ${cacheKey}`);
  return data.data as IgdbGame;
}

/**
 * Cache game details
 */
export async function cacheGameDetails(gameId: number, gameData: IgdbGame): Promise<void> {
  try {
    // Use admin client to bypass RLS policies
    const supabase = createAdminClient();
    const cacheKey = `game:${gameId}`;
    
    console.log(`[CACHE] Storing in cache: ${cacheKey}`);
    
    const { error } = await supabase
      .from('game_cache')
      .upsert({
        cache_key: cacheKey,
        data: gameData,
        cache_type: CACHE_TYPE.GAME_DETAILS,
        last_updated: new Date().toISOString(),
      }, {
        onConflict: 'cache_key',
      });
      
    if (error) {
      console.error(`[CACHE] Error storing in cache: ${error.message}`, error);
    } else {
      console.log(`[CACHE] Successfully stored in cache: ${cacheKey}`);
    }
  } catch (error) {
    console.error('[CACHE] Exception while caching game details:', error);
  }
}

/**
 * Get cached trending games
 */
export async function getCachedTrendingGames(): Promise<IgdbSearchResponse | null> {
  const supabase = await createClient();
  const cacheKey = 'trending';
  
  console.log(`[CACHE] Checking cache for: ${cacheKey}`);
  
  const { data, error } = await supabase
    .from('game_cache')
    .select('data, last_updated')
    .eq('cache_key', cacheKey)
    .eq('cache_type', CACHE_TYPE.TRENDING)
    .single();
  
  if (error) {
    console.log(`[CACHE] Error fetching from cache: ${error.message}`);
    return null;
  }
  
  if (!data) {
    console.log(`[CACHE] No cached data found for: ${cacheKey}`);
    return null;
  }
  
  // Check if cache is expired
  if (isCacheExpired(data.last_updated, CACHE_TYPE.TRENDING)) {
    console.log(`[CACHE] Expired cache for: ${cacheKey}, last updated: ${data.last_updated}`);
    return null;
  }
  
  console.log(`[CACHE] Cache hit for: ${cacheKey}`);
  return data.data as IgdbSearchResponse;
}

/**
 * Cache trending games
 */
export async function cacheTrendingGames(results: IgdbSearchResponse): Promise<void> {
  try {
    // Use admin client to bypass RLS policies
    const supabase = createAdminClient();
    const cacheKey = 'trending';
    
    console.log(`[CACHE] Storing in cache: ${cacheKey}`);
    
    const { error } = await supabase
      .from('game_cache')
      .upsert({
        cache_key: cacheKey,
        data: results,
        cache_type: CACHE_TYPE.TRENDING,
        last_updated: new Date().toISOString(),
      }, {
        onConflict: 'cache_key',
      });
      
    if (error) {
      console.error(`[CACHE] Error storing in cache: ${error.message}`, error);
    } else {
      console.log(`[CACHE] Successfully stored in cache: ${cacheKey}`);
    }
  } catch (error) {
    console.error('[CACHE] Exception while caching trending games:', error);
  }
}

/**
 * Get cached new releases
 */
export async function getCachedNewReleases(): Promise<IgdbSearchResponse | null> {
  const supabase = await createClient();
  const cacheKey = 'new_releases';
  
  console.log(`[CACHE] Checking cache for: ${cacheKey}`);
  
  const { data, error } = await supabase
    .from('game_cache')
    .select('data, last_updated')
    .eq('cache_key', cacheKey)
    .eq('cache_type', CACHE_TYPE.NEW_RELEASES)
    .single();
  
  if (error) {
    console.log(`[CACHE] Error fetching from cache: ${error.message}`);
    return null;
  }
  
  if (!data) {
    console.log(`[CACHE] No cached data found for: ${cacheKey}`);
    return null;
  }
  
  // Check if cache is expired
  if (isCacheExpired(data.last_updated, CACHE_TYPE.NEW_RELEASES)) {
    console.log(`[CACHE] Expired cache for: ${cacheKey}, last updated: ${data.last_updated}`);
    return null;
  }
  
  console.log(`[CACHE] Cache hit for: ${cacheKey}`);
  return data.data as IgdbSearchResponse;
}

/**
 * Cache new releases
 */
export async function cacheNewReleases(results: IgdbSearchResponse): Promise<void> {
  try {
    // Use admin client to bypass RLS policies
    const supabase = createAdminClient();
    const cacheKey = 'new_releases';
    
    console.log(`[CACHE] Storing in cache: ${cacheKey}`);
    
    const { error } = await supabase
      .from('game_cache')
      .upsert({
        cache_key: cacheKey,
        data: results,
        cache_type: CACHE_TYPE.NEW_RELEASES,
        last_updated: new Date().toISOString(),
      }, {
        onConflict: 'cache_key',
      });
      
    if (error) {
      console.error(`[CACHE] Error storing in cache: ${error.message}`, error);
    } else {
      console.log(`[CACHE] Successfully stored in cache: ${cacheKey}`);
    }
  } catch (error) {
    console.error('[CACHE] Exception while caching new releases:', error);
  }
} 