'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

type SupabaseUserGameEntry = {
  game_id: number;
  status: string | null;
  rating: number | null;
  updated_at: string;
  games: {
    id: number;
    name: string;
    background_image: string | null;
    released: string | null;
    rating: number | null;
  } | null;
};

export type UserGameEntry = {
  game_id: number;
  status: string | null;
  rating: number | null;
  updated_at: string;
  games: {
    id: number;
    name: string;
    background_image: string | null;
    released: string | null;
    rating: number | null;
  } | null;
};

export type GamesByStatus = {
  [key: string]: UserGameEntry[];
};

/**
 * Fetch all games in a user's list, grouped by status
 */
export async function getUserGames(): Promise<GamesByStatus> {
  const supabase = await createClient();
  
  try {
    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user) {
      redirect('/login');
    }
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw new Error('Authentication error');
    }
    
    // First check if the games exist in the games table
    const { data: gameListEntries, error: gameListError } = await supabase
      .from('game_lists')
      .select('game_id')
      .eq('user_id', user.id);
      
    if (gameListError) {
      console.error('Error fetching game list entries:', gameListError);
      throw new Error('Failed to fetch your game list');
    }
    
    console.log('Game list entries:', gameListEntries);
    
    // Fetch all games in the user's list with game details
    const { data: rawGamesData, error } = await supabase
      .from('game_lists')
      .select(`
        game_id,
        status,
        rating,
        updated_at,
        games (
          id,
          name,
          background_image,
          released,
          rating
        )
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching user games:', error);
      throw new Error('Failed to fetch your games');
    }
    
    console.log('Raw games data from join:', rawGamesData);

    // Check if we have any games with missing game details
    const missingGameDetails = Array.isArray(rawGamesData)
      ? rawGamesData.filter((item: any) => !item.games)
      : [];

    if (missingGameDetails.length > 0) {
      console.error('Games with missing details:', missingGameDetails);
    }

    // Transform the data to match expected format
    const gamesData: UserGameEntry[] = Array.isArray(rawGamesData)
      ? rawGamesData.map((item: any) => {
          // Defensive: if item.games is an array, take the first element (should be 1:1 join)
          const gameDetails = Array.isArray(item.games) ? item.games[0] : item.games;
          return {
            game_id: item.game_id,
            status: item.status,
            rating: item.rating,
            updated_at: item.updated_at,
            games: gameDetails
              ? {
                  id: gameDetails.id,
                  name: gameDetails.name,
                  background_image: gameDetails.background_image,
                  released: gameDetails.released,
                  rating: gameDetails.rating,
                }
              : null,
          };
        })
      : [];

    // Group games by status
    const gamesByStatus: GamesByStatus = {
      'Playing': [],
      'Finished': [],
      'Want': [],
      'On-hold': [],
      'Dropped': [],
      'All': gamesData || []
    };
    
    // Populate the groups
    gamesData?.forEach((game) => {
      if (game.status) {
        gamesByStatus[game.status].push(game);
      }
    });
    
    return gamesByStatus;
  } catch (error) {
    console.error('Error in getUserGames:', error);
    // Return empty data structure instead of throwing to prevent page crash
    return {
      'Playing': [],
      'Finished': [],
      'Want': [],
      'On-hold': [],
      'Dropped': [],
      'All': []
    };
  }
}

/**
 * Get a count of games in each status for a user
 */
export async function getUserGameCounts() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  
  // Fetch all games for the user
  const { data: gamesData, error } = await supabase
    .from('game_lists')
    .select('status')
    .eq('user_id', user.id);
    
  if (error) {
    console.error('Error fetching user game counts:', error);
    return null;
  }
  
  // Format the counts
  const counts: { [key: string]: number } = {
    'Playing': 0,
    'Finished': 0,
    'Want': 0,
    'On-hold': 0,
    'Dropped': 0,
    'All': 0
  };
  
  // Count games by status
  gamesData?.forEach((game) => {
    if (game.status) {
      counts[game.status] = (counts[game.status] || 0) + 1;
      counts['All']++;
    }
  });
  
  return counts;
} 