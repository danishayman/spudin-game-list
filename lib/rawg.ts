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
  cacheNewReleases,
  CACHE_TYPE
} from './cache-utils';
import { createClient } from '@/utils/supabase/server';

// =============================================================================
// CONFIGURATION PARAMETERS - Adjust these values as needed
// =============================================================================

// API Configuration
const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = 'https://api.rawg.io/api';

// Cache Configuration
const CACHE_REVALIDATION_TIME = 3600; // 1 hour in seconds

// Search Configuration
const SEARCH_PAGE_SIZE = 20;

// Game Details Configuration
const INCLUDE_SCREENSHOTS = true;

// Trending Games Configuration
const TRENDING_PAGE_SIZE = 50;
const TRENDING_ORDERING = '-added'; // Options: '-added', '-rating', '-released', '-metacritic'

// New Releases Configuration
const NEW_RELEASES_MONTHS_BACK = 1; // How many months back to search for new releases
const NEW_RELEASES_PAGE_SIZE = 50; // Initial fetch size (gets filtered down)
const NEW_RELEASES_FINAL_SIZE = 20; // Final number of results to return
const NEW_RELEASES_MIN_METACRITIC = 80; // Minimum Metacritic score (0-100)
const NEW_RELEASES_MIN_RATING = 0.0; // Minimum RAWG rating (0-5)
const NEW_RELEASES_MIN_RATINGS_COUNT = 0; // Minimum number of ratings required
const NEW_RELEASES_ORDERING = '-released'; // Options: '-released', '-rating', '-metacritic'

// Content Filtering Configuration
const ENABLE_CONTENT_FILTERING = true; // Set to false to disable content filtering
const BLOCKED_ESRB_RATINGS = ['adults-only-ao']; // Block AO (Adults Only) rated games
const BLOCKED_TAGS = [
  'sexual-content',
  'nudity', 
  'mature',
  'nsfw',
  'adult',
  'erotic',
  'hentai',
  'porn',
  'sexual'
]; // Block games with these tags (case-insensitive)

// =============================================================================

/**
 * Filter out games with sexual or adult content
 */
function filterAdultContent(games: RawgGame[]): RawgGame[] {
  if (!ENABLE_CONTENT_FILTERING) {
    return games; // Return all games if filtering is disabled
  }
  
  return games.filter(game => {
    // Check ESRB rating
    if (game.esrb_rating && BLOCKED_ESRB_RATINGS.includes(game.esrb_rating.slug)) {
      console.log(`[Filter] Blocked game "${game.name}" due to ESRB rating: ${game.esrb_rating.name}`);
      return false;
    }
    
    // Check tags for adult content
    if (game.tags && Array.isArray(game.tags)) {
      const hasBlockedTag = game.tags.some(tag => 
        BLOCKED_TAGS.some(blockedTag => 
          tag.name.toLowerCase().includes(blockedTag.toLowerCase()) ||
          tag.slug.toLowerCase().includes(blockedTag.toLowerCase())
        )
      );
      
      if (hasBlockedTag) {
        const matchedTags = game.tags
          .filter(tag => 
            BLOCKED_TAGS.some(blockedTag => 
              tag.name.toLowerCase().includes(blockedTag.toLowerCase()) ||
              tag.slug.toLowerCase().includes(blockedTag.toLowerCase())
            )
          )
          .map(tag => tag.name)
          .join(', ');
        console.log(`[Filter] Blocked game "${game.name}" due to tags: ${matchedTags}`);
        return false;
      }
    }
    
    // Check game name for explicit terms (as an extra safety measure)
    const gameName = game.name.toLowerCase();
    const hasExplicitName = BLOCKED_TAGS.some(term => gameName.includes(term));
    if (hasExplicitName) {
      console.log(`[Filter] Blocked game "${game.name}" due to explicit name`);
      return false;
    }
    
    return true;
  });
}

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
  // User-specific fields for games in user's list
  user_status?: string | null;
  user_rating?: number | null;
  in_user_list?: boolean;
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
    // Apply content filtering to cached results
    if (cachedResults.results && Array.isArray(cachedResults.results)) {
      const originalCount = cachedResults.results.length;
      cachedResults.results = filterAdultContent(cachedResults.results);
      if (cachedResults.results.length < originalCount) {
        console.log(`[Filter] Filtered out ${originalCount - cachedResults.results.length} adult content games from cached search results`);
      }
    }
    return cachedResults;
  }

  console.log(`[API] Fetching search results for query: ${query}`);
  
  if (!RAWG_API_KEY) {
    throw new Error('RAWG API key is not defined');
  }

  const url = new URL(`${RAWG_BASE_URL}/games`);
  url.searchParams.append('key', RAWG_API_KEY);
  url.searchParams.append('search', query);
  url.searchParams.append('page_size', SEARCH_PAGE_SIZE.toString());

  const response = await fetch(url.toString(), { 
    next: { revalidate: CACHE_REVALIDATION_TIME }
  });
  
  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status}`);
  }
  
  const results = await response.json();
  
  // Filter out adult content
  if (results.results && Array.isArray(results.results)) {
    const originalCount = results.results.length;
    results.results = filterAdultContent(results.results);
    if (results.results.length < originalCount) {
      console.log(`[Filter] Filtered out ${originalCount - results.results.length} adult content games from search results`);
    }
  }
  
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
    next: { revalidate: CACHE_REVALIDATION_TIME }
  });
  
  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status}`);
  }
  
  const gameData = await response.json();
  
  // Get screenshots (if enabled)
  if (INCLUDE_SCREENSHOTS) {
    const screenshotsUrl = new URL(`${RAWG_BASE_URL}/games/${id}/screenshots`);
    screenshotsUrl.searchParams.append('key', RAWG_API_KEY);
    
    try {
      const screenshotsResponse = await fetch(screenshotsUrl.toString(), {
        next: { revalidate: CACHE_REVALIDATION_TIME }
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
  }
  
  // Check if this game contains adult content
  const filteredGames = filterAdultContent([gameData]);
  if (filteredGames.length === 0) {
    console.log(`[Filter] Blocked access to game "${gameData.name}" due to adult content`);
    throw new Error('This game contains content that is not suitable for display');
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
    // Apply content filtering to cached results
    if (cachedTrending.results && Array.isArray(cachedTrending.results)) {
      const originalCount = cachedTrending.results.length;
      cachedTrending.results = filterAdultContent(cachedTrending.results);
      if (cachedTrending.results.length < originalCount) {
        console.log(`[Filter] Filtered out ${originalCount - cachedTrending.results.length} adult content games from cached trending results`);
      }
    }
    return cachedTrending;
  }

  console.log('[API] Fetching trending games');
  
  if (!RAWG_API_KEY) {
    throw new Error('RAWG API key is not defined');
  }

  const url = new URL(`${RAWG_BASE_URL}/games`);
  url.searchParams.append('key', RAWG_API_KEY);
  url.searchParams.append('ordering', TRENDING_ORDERING);
  url.searchParams.append('page_size', TRENDING_PAGE_SIZE.toString());

  const response = await fetch(url.toString(), { 
    next: { revalidate: CACHE_REVALIDATION_TIME }
  });
  
  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status}`);
  }
  
  const results = await response.json();
  
  // Filter out adult content
  if (results.results && Array.isArray(results.results)) {
    const originalCount = results.results.length;
    results.results = filterAdultContent(results.results);
    if (results.results.length < originalCount) {
      console.log(`[Filter] Filtered out ${originalCount - results.results.length} adult content games from trending results`);
    }
  }
  
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
  try {
    let cachedNewReleases = null;
    
    try {
      // Try to get cached data, even if it might be expired
      cachedNewReleases = await getCachedNewReleases();
      if (cachedNewReleases) {
        console.log('[Cache] Using fresh cached new releases');
        // Apply content filtering to cached results
        if (cachedNewReleases.results && Array.isArray(cachedNewReleases.results)) {
          const originalCount = cachedNewReleases.results.length;
          cachedNewReleases.results = filterAdultContent(cachedNewReleases.results);
          if (cachedNewReleases.results.length < originalCount) {
            console.log(`[Filter] Filtered out ${originalCount - cachedNewReleases.results.length} adult content games from cached new releases`);
          }
        }
        return cachedNewReleases;
      }
      
      // If no fresh cache, check for stale cache to use as fallback if needed
      const supabase = await createClient();
      const cacheKey = 'new_releases';
      
      console.log(`[CACHE] Checking for potentially stale cache: ${cacheKey}`);
      
      const { data, error } = await supabase
        .from('game_cache')
        .select('data, last_updated')
        .eq('cache_key', cacheKey)
        .eq('cache_type', CACHE_TYPE.NEW_RELEASES)
        .single();
      
      if (!error && data) {
        cachedNewReleases = data.data as RawgSearchResponse;
        // Apply content filtering to stale cached results
        if (cachedNewReleases && cachedNewReleases.results && Array.isArray(cachedNewReleases.results)) {
          const originalCount = cachedNewReleases.results.length;
          cachedNewReleases.results = filterAdultContent(cachedNewReleases.results);
          if (cachedNewReleases.results.length < originalCount) {
            console.log(`[Filter] Filtered out ${originalCount - cachedNewReleases.results.length} adult content games from stale cache`);
          }
        }
        console.log('[Cache] Found stale cache, will try API first');
      }
    } catch (cacheError) {
      console.error('[CACHE] Error checking cache:', cacheError);
    }

    console.log('[API] Fetching new releases');
    
    if (!RAWG_API_KEY) {
      console.error('[API] RAWG API key is not defined');
      // If we have stale cache, use it rather than failing
      if (cachedNewReleases) {
        console.log('[Cache] Falling back to stale cache due to missing API key');
        return cachedNewReleases;
      }
      throw new Error('RAWG API key is not defined');
    }

    // Get current date and date from N months ago
    const now = new Date();
    const monthsAgo = new Date();
    monthsAgo.setMonth(now.getMonth() - NEW_RELEASES_MONTHS_BACK);
    
    // Format dates as YYYY-MM-DD
    const toDate = now.toISOString().split('T')[0];
    const fromDate = monthsAgo.toISOString().split('T')[0];

    const url = new URL(`${RAWG_BASE_URL}/games`);
    url.searchParams.append('key', RAWG_API_KEY);
    url.searchParams.append('dates', `${fromDate},${toDate}`);
    url.searchParams.append('ordering', NEW_RELEASES_ORDERING);
    url.searchParams.append('page_size', NEW_RELEASES_PAGE_SIZE.toString());
    
    // Filter for decent ratings (minimum Metacritic score)
    url.searchParams.append('metacritic', `${NEW_RELEASES_MIN_METACRITIC},100`);
    
    console.log('[API] Fetching from URL:', url.toString().replace(RAWG_API_KEY, '[API_KEY]'));      try {
        const response = await fetch(url.toString(), { 
          next: { revalidate: CACHE_REVALIDATION_TIME }
        });
      
      if (!response.ok) {
        console.error(`[API] RAWG API error: ${response.status} - ${response.statusText}`);
        const errorText = await response.text();
        console.error(`[API] Error response body: ${errorText}`);
        
        // If we have stale cache, use it rather than failing
        if (cachedNewReleases) {
          console.log('[Cache] Falling back to stale cache due to API error');
          return cachedNewReleases;
        }
        
        throw new Error(`RAWG API error: ${response.status}`);
      }
      
      const results = await response.json();
      console.log(`[API] Initial approach returned ${results.results?.length || 0} results`);
      
      // Filter out adult content
      if (results.results && Array.isArray(results.results)) {
        const originalCount = results.results.length;
        results.results = filterAdultContent(results.results);
        if (results.results.length < originalCount) {
          console.log(`[Filter] Filtered out ${originalCount - results.results.length} adult content games from new releases`);
        }
      }
      
      // If no results with Metacritic filter, try with minimum rating instead
      if (!results.results || results.results.length < 5) {
        console.log('[API] Not enough results with Metacritic filter, trying with rating filter');
        
        const ratingUrl = new URL(`${RAWG_BASE_URL}/games`);
        ratingUrl.searchParams.append('key', RAWG_API_KEY);
        ratingUrl.searchParams.append('dates', `${fromDate},${toDate}`);
        ratingUrl.searchParams.append('ordering', NEW_RELEASES_ORDERING);
        ratingUrl.searchParams.append('page_size', NEW_RELEASES_PAGE_SIZE.toString());
        ratingUrl.searchParams.append('ratings_count', NEW_RELEASES_MIN_RATINGS_COUNT.toString());
        
        console.log('[API] Trying with rating filter:', ratingUrl.toString().replace(RAWG_API_KEY, '[API_KEY]'));
        
        const ratingResponse = await fetch(ratingUrl.toString(), { 
          next: { revalidate: CACHE_REVALIDATION_TIME }
        });
        
        if (!ratingResponse.ok) {
          console.error(`[API] Rating API error: ${ratingResponse.status} - ${ratingResponse.statusText}`);
          const errorText = await ratingResponse.text();
          console.error(`[API] Error response body: ${errorText}`);
          
          // If we have stale cache, use it rather than failing
          if (cachedNewReleases) {
            console.log('[Cache] Falling back to stale cache due to rating API error');
            return cachedNewReleases;
          }
          
          throw new Error(`RAWG API error: ${ratingResponse.status}`);
        }
        
        const ratingResults = await ratingResponse.json();
        console.log(`[API] Rating approach returned ${ratingResults.results?.length || 0} results`);
        
        // Filter out adult content first
        if (ratingResults.results && Array.isArray(ratingResults.results)) {
          const originalCount = ratingResults.results.length;
          ratingResults.results = filterAdultContent(ratingResults.results);
          if (ratingResults.results.length < originalCount) {
            console.log(`[Filter] Filtered out ${originalCount - ratingResults.results.length} adult content games from rating approach`);
          }
        }
        
        // Filter locally for games with minimum rating
        if (ratingResults.results && ratingResults.results.length > 0) {
          ratingResults.results = ratingResults.results.filter((game: RawgGame) => game.rating >= NEW_RELEASES_MIN_RATING);
          console.log(`[API] After rating filtering, ${ratingResults.results.length} results remain`);
          
          // Ensure we have exactly the desired number of results
          if (ratingResults.results.length > NEW_RELEASES_FINAL_SIZE) {
            ratingResults.results = ratingResults.results.slice(0, NEW_RELEASES_FINAL_SIZE);
            console.log(`[API] Trimmed to ${NEW_RELEASES_FINAL_SIZE} results`);
          }
          
          // Cache these results
          await cacheNewReleases(ratingResults);
          
          return ratingResults;
        }
      }
      
      // Limit to desired number of results
      if (results.results && results.results.length > NEW_RELEASES_FINAL_SIZE) {
        results.results = results.results.slice(0, NEW_RELEASES_FINAL_SIZE);
      }
      
      // Apply final adult content filter (in case it wasn't applied earlier due to cache fallback)
      if (results.results && Array.isArray(results.results)) {
        const originalCount = results.results.length;
        results.results = filterAdultContent(results.results);
        if (results.results.length < originalCount) {
          console.log(`[Filter] Final filter removed ${originalCount - results.results.length} adult content games`);
        }
      }
      
      // Cache the results
      await cacheNewReleases(results);
      
      return results;
    } catch (fetchError) {
      console.error('[API] Fetch error:', fetchError);
      
      // If we have stale cache, use it rather than failing
      if (cachedNewReleases) {
        console.log('[Cache] Falling back to stale cache due to fetch error');
        return cachedNewReleases;
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.error('[API] Error in getNewReleases:', error);
    
    // Try to get stale cache as last resort
    try {
      const supabase = await createClient();
      const cacheKey = 'new_releases';
      
      console.log(`[CACHE] Checking for any cache as final fallback`);
      
      const { data, error: cacheError } = await supabase
        .from('game_cache')
        .select('data')
        .eq('cache_key', cacheKey)
        .eq('cache_type', CACHE_TYPE.NEW_RELEASES)
        .single();
      
      if (!cacheError && data) {
        console.log('[Cache] Using cache as final fallback after all API failures');
        const fallbackData = data.data as RawgSearchResponse;
        // Apply content filtering to final fallback cache
        if (fallbackData && fallbackData.results && Array.isArray(fallbackData.results)) {
          const originalCount = fallbackData.results.length;
          fallbackData.results = filterAdultContent(fallbackData.results);
          if (fallbackData.results.length < originalCount) {
            console.log(`[Filter] Filtered out ${originalCount - fallbackData.results.length} adult content games from final fallback cache`);
          }
        }
        return fallbackData;
      }
    } catch (fallbackError) {
      console.error('[CACHE] Error getting fallback cache:', fallbackError);
    }
    
    // Return an empty result set if everything fails
    return { count: 0, next: null, previous: null, results: [] };
  }
} 