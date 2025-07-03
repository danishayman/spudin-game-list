// RAWG API wrapper
// Documentation: https://rawg.io/apidocs

const RAWG_API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
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
 */
export async function searchGames(query: string): Promise<RawgSearchResponse> {
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
  
  return response.json();
}

/**
 * Get detailed game information by ID
 */
export async function getGameById(id: number): Promise<RawgGame> {
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
  
  return response.json();
} 