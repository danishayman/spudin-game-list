import { IgdbGame, IgdbSearchResponse } from './igdb';

// Type aliases for backward compatibility
export type { IgdbGame } from './igdb';
export type RawgSearchResponse = IgdbSearchResponse;

/**
 * Search games through the API route
 */
export async function searchGamesClient(query: string): Promise<RawgSearchResponse> {
  const response = await fetch(`/api/games/search?q=${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Error searching games: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Get detailed game information by ID through the API route
 */
export async function getGameByIdClient(id: number): Promise<IgdbGame> {
  const response = await fetch(`/api/games/${id}`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Error fetching game details: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Get trending games through the API route
 */
export async function getTrendingGamesClient(): Promise<RawgSearchResponse> {
  const response = await fetch('/api/games/trending');
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Error fetching trending games: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Get new releases through the API route
 */
export async function getNewReleasesClient(count: number = 8): Promise<RawgSearchResponse> {
  const response = await fetch(`/api/games/new-releases?count=${count}`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Error fetching new releases: ${response.status}`);
  }
  
  return response.json();
} 