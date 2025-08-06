// Data transformation utilities for IGDB API responses
// Converts raw IGDB API responses to application format

import { IgdbGame, IgdbRawGame } from './types';

/**
 * Convert IGDB raw game response to standardized format
 */
export function convertIgdbToStandardFormat(igdbGame: IgdbRawGame): IgdbGame {
  const game: IgdbGame = {
    id: igdbGame.id,
    name: igdbGame.name,
    total_rating: igdbGame.total_rating,
    total_rating_count: igdbGame.total_rating_count,
    first_release_date: igdbGame.first_release_date,
    summary: igdbGame.summary,
    storyline: igdbGame.storyline,
    
    // Filter and map arrays safely
    genres: filterValidItems(igdbGame.genres),
    platforms: filterValidItems(igdbGame.platforms),
    videos: filterValidItems(igdbGame.videos),
    websites: filterValidItems(igdbGame.websites),
    involved_companies: filterValidItems(igdbGame.involved_companies),
    age_ratings: filterValidItems(igdbGame.age_ratings),
    themes: filterValidThemes(igdbGame.themes),
    game_modes: filterValidItems(igdbGame.game_modes),
    player_perspectives: filterValidItems(igdbGame.player_perspectives),
    franchises: filterValidItems(igdbGame.franchises),
    similar_games: igdbGame.similar_games?.filter(game => game && game.name).map(game => ({
      id: game.id,
      name: game.name,
      cover: game.cover ? transformCoverUrl(game.cover, 't_cover_big') : undefined,
      total_rating: game.total_rating
    })),
    dlcs: filterValidItems(igdbGame.dlcs),
    expansions: filterValidItems(igdbGame.expansions),
    standalone_expansions: filterValidItems(igdbGame.standalone_expansions),
    remakes: filterValidItems(igdbGame.remakes),
    remasters: filterValidItems(igdbGame.remasters),
    ports: filterValidItems(igdbGame.ports),
    forks: filterValidItems(igdbGame.forks),
    
    // Simple field mappings
    category: igdbGame.category,
    status: igdbGame.status,
    version_parent: igdbGame.version_parent,
    version_title: igdbGame.version_title,
    time_to_beat: igdbGame.time_to_beat,
    
    // Transform URLs for media assets
    cover: igdbGame.cover ? transformCoverUrl(igdbGame.cover, 't_cover_big') : undefined,
    screenshots: igdbGame.screenshots?.map(screenshot => 
      transformMediaUrl(screenshot, 't_screenshot_med')
    ),
    artworks: igdbGame.artworks?.map(artwork => 
      transformMediaUrl(artwork, 't_1080p')
    ),
    
    // Collection handling
    collection: igdbGame.collection ? {
      id: igdbGame.collection.id,
      name: igdbGame.collection.name,
      games: filterValidItems(igdbGame.collection.games)
    } : undefined,
    
    // Compatibility fields for RAWG structure
    background_image: igdbGame.cover?.url ? transformUrl(igdbGame.cover.url, 't_1080p') : null,
    released: igdbGame.first_release_date ? 
      new Date(igdbGame.first_release_date * 1000).toISOString().split('T')[0] : null,
    rating: igdbGame.total_rating ? igdbGame.total_rating / 20 : 0, // Convert 0-100 to 0-5 scale
    metacritic: null, // IGDB doesn't have direct Metacritic scores
    
    // Extract developers and publishers from involved_companies
    developers: extractCompanies(igdbGame.involved_companies, true, false),
    publishers: extractCompanies(igdbGame.involved_companies, false, true),
    
    // Tags don't exist in IGDB, but we can use themes
    tags: filterValidThemes(igdbGame.themes),
    
    // Additional RAWG compatibility fields (mostly null for IGDB)
    background_image_additional: null,
    description_raw: igdbGame.summary || undefined,
    website: extractOfficialWebsite(igdbGame.websites),
    metacritic_url: null,
    reddit_url: null,
    reddit_name: null,
    reddit_description: null,
    playtime: null,
    esrb_rating: null,
    stores: [],
  };

  return game;
}

/**
 * Transform IGDB image URL with specific size
 */
function transformUrl(url: string, size: string): string {
  if (!url) return '';
  return `https:${url.replace('t_thumb', size)}`;
}

/**
 * Transform cover URL specifically
 */
function transformCoverUrl(
  cover: { url: string; id: number; width?: number; height?: number }, 
  size: string
): { id: number; url: string; width: number; height: number } {
  return {
    id: cover.id,
    url: transformUrl(cover.url, size),
    width: cover.width || 0,
    height: cover.height || 0
  };
}

/**
 * Transform media URL (screenshots, artworks)
 */
function transformMediaUrl(
  media: { url: string; id: number; width?: number; height?: number }, 
  size: string
): { id: number; url: string; width: number; height: number } {
  return {
    id: media.id,
    url: transformUrl(media.url, size),
    width: media.width || 0,
    height: media.height || 0
  };
}

/**
 * Filter valid items from arrays (removes null/undefined items and items without required fields)
 */
function filterValidItems<T extends { name?: string; id?: number }>(items?: T[]): T[] {
  if (!items || !Array.isArray(items)) return [];
  return items.filter(item => item && (item.name || item.id !== undefined));
}

/**
 * Filter valid themes (handles both number array and object array formats)
 */
function filterValidThemes(themes?: Array<{ id: number; name: string }> | number[]): Array<{ id: number; name: string }> {
  if (!themes || !Array.isArray(themes)) return [];
  
  // If it's an array of numbers, return empty array as we need name field
  if (themes.length > 0 && typeof themes[0] === 'number') {
    return [];
  }
  
  // Filter valid theme objects
  return (themes as Array<{ id: number; name: string }>)
    .filter(theme => theme && theme.name && theme.id !== undefined);
}

/**
 * Extract companies by role (developer/publisher)
 */
function extractCompanies(
  companies: Array<{
    company: { id: number; name: string };
    developer: boolean;
    publisher: boolean;
  }> | undefined,
  isDeveloper: boolean,
  isPublisher: boolean
): Array<{ id: number; name: string }> {
  if (!companies || !Array.isArray(companies)) return [];
  
  return companies
    .filter(company => 
      company && 
      company.company && 
      company.company.name && 
      ((isDeveloper && company.developer) || (isPublisher && company.publisher))
    )
    .map(company => ({
      id: company.company.id,
      name: company.company.name
    }));
}

/**
 * Extract official website URL
 */
function extractOfficialWebsite(websites?: Array<{ url: string; category: number }>): string | null {
  if (!websites || !Array.isArray(websites)) return null;
  const officialSite = websites.find(site => site && site.category === 1); // Category 1 is official website
  return officialSite?.url || null;
}
