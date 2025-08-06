// IGDB API wrapper
// Documentation: https://api-docs.igdb.com/
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
const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;
const IGDB_BASE_URL = 'https://api.igdb.com/v4';

// Cache Configuration
const CACHE_REVALIDATION_TIME = 3600; // 1 hour in seconds

// Search Configuration
const SEARCH_PAGE_SIZE = 50;

// Game Details Configuration
const INCLUDE_SCREENSHOTS = true;

// Trending Games Configuration
const TRENDING_PAGE_SIZE = 50;

// New Releases Configuration
const NEW_RELEASES_MONTHS_BACK = 1; // How many months back to search for new releases
const NEW_RELEASES_PAGE_SIZE = 50; // Initial fetch size (gets filtered down)
const NEW_RELEASES_FINAL_SIZE = 25; // Final number of results to return
const NEW_RELEASES_MIN_RATING = 60; // Minimum IGDB total rating (0-100)
const NEW_RELEASES_MIN_RATINGS_COUNT = 0; // Minimum number of ratings required

// Content Filtering Configuration
const ENABLE_CONTENT_FILTERING = true; // Set to false to disable content filtering
const BLOCKED_ESRB_RATINGS: number[] = []; // No ESRB ratings blocked
const BLOCKED_THEMES = [42]; // Block games with adult themes (Theme ID 42 = Erotic)

// =============================================================================

// OAuth token management
let accessToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get OAuth access token for IGDB API
 */
async function getAccessToken(): Promise<string> {
  // Check if we have a valid token
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  if (!IGDB_CLIENT_ID || !IGDB_CLIENT_SECRET) {
    throw new Error('IGDB Client ID and Client Secret are required');
  }

  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: IGDB_CLIENT_ID,
      client_secret: IGDB_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get IGDB access token: ${response.status}`);
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 minute early

  return accessToken!;
}

/**
 * Make authenticated request to IGDB API
 */
async function igdbRequest(endpoint: string, query: string): Promise<any> {
  const token = await getAccessToken();

  console.log(`[IGDB] Making request to ${endpoint} with query:`, query);

  const response = await fetch(`${IGDB_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID': IGDB_CLIENT_ID!,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: query,
    next: { revalidate: CACHE_REVALIDATION_TIME }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[IGDB] API error ${response.status}:`, errorText);
    throw new Error(`IGDB API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Filter out games with sexual or adult content
 */
function filterAdultContent(games: IgdbGame[]): IgdbGame[] {
  if (!ENABLE_CONTENT_FILTERING) {
    return games; // Return all games if filtering is disabled
  }
  
  return games.filter(game => {
    // Check ESRB rating
    if (game.age_ratings && Array.isArray(game.age_ratings)) {
      const hasBlockedRating = game.age_ratings.some(rating => 
        BLOCKED_ESRB_RATINGS.includes(rating.rating || 0)
      );
      
      if (hasBlockedRating) {
        console.log(`[Filter] Blocked game "${game.name}" due to ESRB rating`);
        return false;
      }
    }
    
    // Check themes for adult content
    if (game.themes && Array.isArray(game.themes)) {
      const hasBlockedTheme = game.themes.some(theme => 
        BLOCKED_THEMES.includes(typeof theme === 'number' ? theme : theme.id)
      );
      
      if (hasBlockedTheme) {
        console.log(`[Filter] Blocked game "${game.name}" due to adult themes`);
        return false;
      }
    }
    
    return true;
  });
}

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

/**
 * Convert IGDB game to RAWG-compatible format for easier migration
 */
function convertIgdbToRawgFormat(igdbGame: any): IgdbGame {
  const game: IgdbGame = {
    id: igdbGame.id,
    name: igdbGame.name,
    total_rating: igdbGame.total_rating,
    total_rating_count: igdbGame.total_rating_count,
    first_release_date: igdbGame.first_release_date,
    summary: igdbGame.summary,
    storyline: igdbGame.storyline,
    genres: igdbGame.genres?.filter((genre: any) => genre && genre.name) || [],
    platforms: igdbGame.platforms?.filter((platform: any) => platform && platform.name) || [],
    videos: igdbGame.videos?.filter((video: any) => video && video.name) || [],
    websites: igdbGame.websites?.filter((website: any) => website && website.url) || [],
    involved_companies: igdbGame.involved_companies?.filter((company: any) => company && company.company && company.company.name) || [],
    age_ratings: igdbGame.age_ratings?.filter((rating: any) => rating && rating.rating !== undefined) || [],
    themes: igdbGame.themes?.filter((theme: any) => theme && theme.name) || [],
    game_modes: igdbGame.game_modes?.filter((mode: any) => mode && mode.name) || [],
    player_perspectives: igdbGame.player_perspectives?.filter((perspective: any) => perspective && perspective.name) || [],
    
    // New comprehensive fields
    artworks: igdbGame.artworks?.map((artwork: any) => ({
      ...artwork,
      url: artwork.url ? `https:${artwork.url.replace('t_thumb', 't_1080p')}` : ''
    })),
    collection: igdbGame.collection ? {
      id: igdbGame.collection.id,
      name: igdbGame.collection.name,
      games: igdbGame.collection.games?.filter((g: any) => g && g.name) || []
    } : undefined,
    franchises: igdbGame.franchises?.filter((franchise: any) => franchise && franchise.name) || [],
    similar_games: igdbGame.similar_games?.filter((game: any) => game && game.name).map((game: any) => ({
      id: game.id,
      name: game.name,
      cover: game.cover ? {
        ...game.cover,
        url: game.cover.url ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}` : ''
      } : undefined,
      total_rating: game.total_rating
    })) || [],
    dlcs: igdbGame.dlcs?.filter((dlc: any) => dlc && dlc.name) || [],
    expansions: igdbGame.expansions?.filter((expansion: any) => expansion && expansion.name) || [],
    standalone_expansions: igdbGame.standalone_expansions?.filter((exp: any) => exp && exp.name) || [],
    remakes: igdbGame.remakes?.filter((remake: any) => remake && remake.name) || [],
    remasters: igdbGame.remasters?.filter((remaster: any) => remaster && remaster.name) || [],
    ports: igdbGame.ports?.filter((port: any) => port && port.name) || [],
    forks: igdbGame.forks?.filter((fork: any) => fork && fork.name) || [],
    category: igdbGame.category,
    status: igdbGame.status,
    version_parent: igdbGame.version_parent,
    version_title: igdbGame.version_title,
    time_to_beat: igdbGame.time_to_beat,
    
    // Convert cover URL to full URL
    cover: igdbGame.cover ? {
      ...igdbGame.cover,
      url: igdbGame.cover.url ? `https:${igdbGame.cover.url.replace('t_thumb', 't_cover_big')}` : ''
    } : undefined,
    
    // Convert screenshots URLs
    screenshots: igdbGame.screenshots?.map((screenshot: any) => ({
      ...screenshot,
      url: screenshot.url ? `https:${screenshot.url.replace('t_thumb', 't_screenshot_med')}` : ''
    })),
    
    // Compatibility fields for RAWG structure
    background_image: igdbGame.cover?.url ? `https:${igdbGame.cover.url.replace('t_thumb', 't_1080p')}` : null,
    released: igdbGame.first_release_date ? new Date(igdbGame.first_release_date * 1000).toISOString().split('T')[0] : null,
    rating: igdbGame.total_rating ? igdbGame.total_rating / 20 : 0, // Convert 0-100 to 0-5 scale
    metacritic: null, // IGDB doesn't have direct Metacritic scores
    
    // Extract developers and publishers from involved_companies
    developers: igdbGame.involved_companies?.filter((company: any) => 
      company && company.company && company.company.name && company.developer
    ).map((company: any) => ({
      id: company.company.id,
      name: company.company.name
    })) || [],
    
    publishers: igdbGame.involved_companies?.filter((company: any) => 
      company && company.company && company.company.name && company.publisher
    ).map((company: any) => ({
      id: company.company.id,
      name: company.company.name
    })) || [],
    
    // Tags don't exist in IGDB, but we can use themes or leave empty
    tags: igdbGame.themes?.filter((theme: any) => theme && theme.name).map((theme: any) => ({
      id: theme.id,
      name: theme.name
    })) || [],
    
    // Additional RAWG compatibility fields (mostly null for IGDB)
    background_image_additional: null,
    description_raw: igdbGame.summary || null,
    website: igdbGame.websites?.find((site: any) => site && site.category === 1)?.url || null, // Category 1 is official website
    metacritic_url: null, // IGDB doesn't provide Metacritic URLs
    reddit_url: null,
    reddit_name: null,
    reddit_description: null,
    playtime: null, // IGDB doesn't provide average playtime
    esrb_rating: null, // Would need to parse age_ratings for ESRB specifically
    stores: [], // IGDB doesn't provide store information
  };

  return game;
}

/**
 * Search games from IGDB API
 * This function should only be called from server components or API routes
 */
export async function searchGames(query: string): Promise<IgdbSearchResponse> {
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
  
  const igdbQuery = `
    fields id, name, cover.url, first_release_date, total_rating, total_rating_count, 
           genres.name, platforms.name, summary, themes.id, age_ratings.rating;
    search "${query}";
    limit ${SEARCH_PAGE_SIZE};
  `;

  const igdbResults = await igdbRequest('games', igdbQuery);
  
  // Convert IGDB format to our format
  const convertedResults = igdbResults.map(convertIgdbToRawgFormat);
  
  // Filter out adult content
  const originalCount = convertedResults.length;
  const filteredResults = filterAdultContent(convertedResults);
  if (filteredResults.length < originalCount) {
    console.log(`[Filter] Filtered out ${originalCount - filteredResults.length} adult content games from search results`);
  }
  
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
 * This function should only be called from server components or API routes
 */
export async function getGameById(id: number): Promise<IgdbGame> {
  // First, check the cache
  const cachedGame = await getCachedGameDetails(id);
  if (cachedGame) {
    console.log(`[Cache] Using cached game details for ID: ${id}`);
    return cachedGame;
  }

  console.log(`[API] Fetching game details for ID: ${id}`);
  
  // Start with a basic query and add fields progressively
  let igdbQuery = `
    fields id, name, cover.url, first_release_date, total_rating, total_rating_count,
           genres.name, platforms.name, summary, storyline, themes.name,
           age_ratings.category, age_ratings.rating,
           websites.url, websites.category, game_modes.name, player_perspectives.name,
           involved_companies.company.name, involved_companies.developer, involved_companies.publisher,
           category, status;
    where id = ${id};
  `;

  // Add screenshots and additional fields if enabled
  if (INCLUDE_SCREENSHOTS) {
    igdbQuery = `
      fields id, name, cover.url, first_release_date, total_rating, total_rating_count,
             genres.name, platforms.name, summary, storyline, themes.name,
             age_ratings.category, age_ratings.rating,
             websites.url, websites.category, game_modes.name, player_perspectives.name,
             involved_companies.company.name, involved_companies.developer, involved_companies.publisher,
             screenshots.url, videos.video_id, videos.name,
             artworks.url, category, status;
      where id = ${id};
    `;
  }

  const igdbResults = await igdbRequest('games', igdbQuery);
  
  if (!igdbResults || igdbResults.length === 0) {
    throw new Error(`Game with ID ${id} not found`);
  }
  
  const gameData = convertIgdbToRawgFormat(igdbResults[0]);
  
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
 * Get game series/collection information by game ID
 * This function should only be called from server components or API routes
 */
export async function getGameSeriesById(id: number): Promise<IgdbSearchResponse> {
  console.log(`[API] Fetching game series for ID: ${id}`);
  
  // First, get the game details to find collection and franchise info
  const gameQuery = `
    fields collection.id, collection.name, franchises.id, franchises.name;
    where id = ${id};
  `;
  
  const gameResults = await igdbRequest('games', gameQuery);
  
  if (!gameResults || gameResults.length === 0) {
    console.log(`[IGDB] Game with ID ${id} not found for series lookup`);
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
    console.log(`[IGDB] Found collection: ${game.collection.name} (ID: ${game.collection.id})`);
    
    const collectionQuery = `
      fields id, name, cover.url, first_release_date, total_rating, total_rating_count,
             genres.name, platforms.name, summary, themes.id, age_ratings.rating;
      where collection = ${game.collection.id} & id != ${id};
      sort first_release_date asc;
      limit 20;
    `;
    
    const collectionResults = await igdbRequest('games', collectionQuery);
    if (collectionResults && collectionResults.length > 0) {
      const convertedGames = collectionResults.map(convertIgdbToRawgFormat);
      const filteredGames = filterAdultContent(convertedGames);
      seriesGames.push(...filteredGames);
    }
  }
  
  // If the game has franchises and we don't have enough results, fetch from franchise
  if (game.franchises && game.franchises.length > 0 && seriesGames.length < 10) {
    for (const franchise of game.franchises) {
      console.log(`[IGDB] Found franchise: ${franchise.name} (ID: ${franchise.id})`);
      
      const franchiseQuery = `
        fields id, name, cover.url, first_release_date, total_rating, total_rating_count,
               genres.name, platforms.name, summary, themes.id, age_ratings.rating;
        where franchises = (${franchise.id}) & id != ${id};
        sort first_release_date asc;
        limit ${Math.max(1, 15 - seriesGames.length)};
      `;
      
      const franchiseResults = await igdbRequest('games', franchiseQuery);
      if (franchiseResults && franchiseResults.length > 0) {
        const convertedGames = franchiseResults.map(convertIgdbToRawgFormat);
        const filteredGames = filterAdultContent(convertedGames);
        
        // Avoid duplicates by checking if game ID already exists
        const existingIds = new Set(seriesGames.map(g => g.id));
        const newGames = filteredGames.filter(g => !existingIds.has(g.id));
        seriesGames.push(...newGames);
        
        if (seriesGames.length >= 15) break; // Limit total results
      }
    }
  }
  
  // If still no results, try to find similar games by name pattern
  if (seriesGames.length === 0) {
    // Get the original game name to search for similar titles
    const originalGameQuery = `
      fields name;
      where id = ${id};
    `;
    
    const originalGameResults = await igdbRequest('games', originalGameQuery);
    if (originalGameResults && originalGameResults.length > 0) {
      const originalName = originalGameResults[0].name;
      
      // Extract potential series name (remove subtitles, numbers, etc.)
      const baseName = originalName
        .replace(/\s*:\s*.+$/, '') // Remove everything after colon
        .replace(/\s+\d+$/, '') // Remove trailing numbers
        .replace(/\s+(II|III|IV|V|VI|VII|VIII|IX|X)$/, '') // Remove roman numerals
        .trim();
      
      if (baseName && baseName !== originalName) {
        console.log(`[IGDB] Searching for similar games with base name: "${baseName}"`);
        
        const similarQuery = `
          fields id, name, cover.url, first_release_date, total_rating, total_rating_count,
                 genres.name, platforms.name, summary, themes.id, age_ratings.rating;
          search "${baseName}";
          where id != ${id};
          limit 10;
        `;
        
        const similarResults = await igdbRequest('games', similarQuery);
        if (similarResults && similarResults.length > 0) {
          const convertedGames = similarResults.map(convertIgdbToRawgFormat);
          const filteredGames = filterAdultContent(convertedGames);
          seriesGames.push(...filteredGames);
        }
      }
    }
  }
  
  console.log(`[IGDB] Found ${seriesGames.length} games in series for game ID ${id}`);
  
  return {
    count: seriesGames.length,
    next: null,
    previous: null,
    results: seriesGames
  };
}

/**
 * Get trending games
 * This function should only be called from server components or API routes
 */
export async function getTrendingGames(): Promise<IgdbSearchResponse> {
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
  
  const igdbQuery = `
    fields id, name, cover.url, first_release_date, total_rating, total_rating_count,
           genres.name, platforms.name, summary, themes.id, age_ratings.rating;
    where total_rating_count > 50 & total_rating > 70;
    sort total_rating desc;
    limit ${TRENDING_PAGE_SIZE};
  `;

  const igdbResults = await igdbRequest('games', igdbQuery);
  
  // Convert IGDB format to our format
  const convertedResults = igdbResults.map(convertIgdbToRawgFormat);
  
  // Filter out adult content
  const originalCount = convertedResults.length;
  const filteredResults = filterAdultContent(convertedResults);
  if (filteredResults.length < originalCount) {
    console.log(`[Filter] Filtered out ${originalCount - filteredResults.length} adult content games from trending results`);
  }
  
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
 * This function should only be called from server components or API routes
 */
export async function getNewReleases(): Promise<IgdbSearchResponse> {
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
        cachedNewReleases = data.data as IgdbSearchResponse;
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
    
    if (!IGDB_CLIENT_ID || !IGDB_CLIENT_SECRET) {
      console.error('[API] IGDB credentials are not defined');
      // If we have stale cache, use it rather than failing
      if (cachedNewReleases) {
        console.log('[Cache] Falling back to stale cache due to missing credentials');
        return cachedNewReleases;
      }
      throw new Error('IGDB credentials are not defined');
    }

    // Get current date and date from N months ago
    const now = new Date();
    const monthsAgo = new Date();
    monthsAgo.setMonth(now.getMonth() - NEW_RELEASES_MONTHS_BACK);
    
    // Convert to Unix timestamps
    const toDate = Math.floor(now.getTime() / 1000);
    const fromDate = Math.floor(monthsAgo.getTime() / 1000);

    const igdbQuery = `
      fields id, name, cover.url, first_release_date, total_rating, total_rating_count,
             genres.name, platforms.name, summary, themes.id, age_ratings.rating;
      where first_release_date >= ${fromDate} & first_release_date <= ${toDate} 
            & total_rating >= ${NEW_RELEASES_MIN_RATING} 
            & total_rating_count >= ${NEW_RELEASES_MIN_RATINGS_COUNT};
      sort first_release_date desc;
      limit ${NEW_RELEASES_PAGE_SIZE};
    `;
    
    console.log('[API] Fetching new releases with query');
    
    try {
      const igdbResults = await igdbRequest('games', igdbQuery);
      console.log(`[API] Initial approach returned ${igdbResults?.length || 0} results`);
      
      // Convert IGDB format to our format
      const convertedResults = igdbResults.map(convertIgdbToRawgFormat);
      
      // Filter out adult content
      const originalCount = convertedResults.length;
      const filteredResults = filterAdultContent(convertedResults);
      if (filteredResults.length < originalCount) {
        console.log(`[Filter] Filtered out ${originalCount - filteredResults.length} adult content games from new releases`);
      }
      
      // If no results with strict criteria, try with more relaxed criteria
      if (filteredResults.length < 5) {
        console.log('[API] Not enough results with strict criteria, trying with relaxed criteria');
        
        const relaxedQuery = `
          fields id, name, cover.url, first_release_date, total_rating, total_rating_count,
                 genres.name, platforms.name, summary, themes.id, age_ratings.rating;
          where first_release_date >= ${fromDate} & first_release_date <= ${toDate} 
                & total_rating_count >= 1;
          sort total_rating desc;
          limit ${NEW_RELEASES_PAGE_SIZE};
        `;
        
        const relaxedResults = await igdbRequest('games', relaxedQuery);
        console.log(`[API] Relaxed approach returned ${relaxedResults?.length || 0} results`);
        
        // Convert and filter
        const convertedRelaxedResults = relaxedResults.map(convertIgdbToRawgFormat);
        const filteredRelaxedResults = filterAdultContent(convertedRelaxedResults);
        
        // Filter locally for games with minimum rating
        const finalResults = filteredRelaxedResults
          .filter((game: IgdbGame) => (game.total_rating || 0) >= NEW_RELEASES_MIN_RATING)
          .slice(0, NEW_RELEASES_FINAL_SIZE);
        
        console.log(`[API] After local filtering, ${finalResults.length} results remain`);
        
        const results: IgdbSearchResponse = {
          count: finalResults.length,
          next: null,
          previous: null,
          results: finalResults
        };
        
        // Cache these results
        await cacheNewReleases(results);
        
        return results;
      }
      
      // Limit to desired number of results
      const finalResults = filteredResults.slice(0, NEW_RELEASES_FINAL_SIZE);
      
      const results: IgdbSearchResponse = {
        count: finalResults.length,
        next: null,
        previous: null,
        results: finalResults
      };
      
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
        const fallbackData = data.data as IgdbSearchResponse;
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

// Export types for compatibility
export type RawgGame = IgdbGame;
export type RawgSearchResponse = IgdbSearchResponse;