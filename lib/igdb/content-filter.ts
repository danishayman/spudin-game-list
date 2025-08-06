// Content Filtering for IGDB Games
// Handles filtering of adult/inappropriate content

import { IgdbGame } from './types';
import { CONTENT_FILTER_CONFIG } from './config';

/**
 * Filter out games with sexual or adult content
 */
export function filterAdultContent(games: IgdbGame[]): IgdbGame[] {
  if (!CONTENT_FILTER_CONFIG.ENABLED) {
    console.log('[Content Filter] Content filtering is disabled, returning all games');
    return games;
  }
  
  const originalCount = games.length;
  
  const filteredGames = games.filter(game => {
    // Check ESRB rating
    if (game.age_ratings && Array.isArray(game.age_ratings)) {
      const hasBlockedRating = game.age_ratings.some(rating => 
        CONTENT_FILTER_CONFIG.BLOCKED_ESRB_RATINGS.includes(rating.rating || 0)
      );
      
      if (hasBlockedRating) {
        console.log(`[Content Filter] Blocked game "${game.name}" due to ESRB rating`);
        return false;
      }
    }
    
    // Check themes for adult content
    if (game.themes && Array.isArray(game.themes)) {
      const hasBlockedTheme = game.themes.some(theme => {
        const themeId = typeof theme === 'number' ? theme : theme.id;
        return CONTENT_FILTER_CONFIG.BLOCKED_THEMES.includes(themeId);
      });
      
      if (hasBlockedTheme) {
        console.log(`[Content Filter] Blocked game "${game.name}" due to adult themes`);
        return false;
      }
    }
    
    return true;
  });

  if (filteredGames.length < originalCount) {
    console.log(`[Content Filter] Filtered out ${originalCount - filteredGames.length} games with adult content`);
  }
  
  return filteredGames;
}

/**
 * Check if a single game contains adult content
 */
export function isAdultContent(game: IgdbGame): boolean {
  if (!CONTENT_FILTER_CONFIG.ENABLED) {
    return false;
  }
  
  // Check ESRB rating
  if (game.age_ratings && Array.isArray(game.age_ratings)) {
    const hasBlockedRating = game.age_ratings.some(rating => 
      CONTENT_FILTER_CONFIG.BLOCKED_ESRB_RATINGS.includes(rating.rating || 0)
    );
    
    if (hasBlockedRating) {
      return true;
    }
  }
  
  // Check themes for adult content
  if (game.themes && Array.isArray(game.themes)) {
    const hasBlockedTheme = game.themes.some(theme => {
      const themeId = typeof theme === 'number' ? theme : theme.id;
      return CONTENT_FILTER_CONFIG.BLOCKED_THEMES.includes(themeId);
    });
    
    if (hasBlockedTheme) {
      return true;
    }
  }
  
  return false;
}
