'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type UserGameEntry = {
  game_id: number;
  status: string | null;
  rating: number;
  updated_at: string;
  games: {
    id: number;
    name: string;
    background_image: string | null;
    released: string | null;
    rating: number | null;
  };
};

export type GamesByStatus = {
  [key: string]: UserGameEntry[];
};

/**
 * Fetch all games in a user's list, grouped by status
 */
export async function getUserGames(): Promise<GamesByStatus> {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) {
    redirect('/login');
  }
  
  // Fetch all games in the user's list with game details
  const { data: gamesData, error } = await supabase
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
    .eq('user_id', data.session.user.id)
    .order('updated_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching user games:', error);
    throw new Error('Failed to fetch your games');
  }
  
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
}

/**
 * Get a count of games in each status for a user
 */
export async function getUserGameCounts() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) {
    return null;
  }
  
  // Fetch all games for the user
  const { data: gamesData, error } = await supabase
    .from('game_lists')
    .select('status')
    .eq('user_id', data.session.user.id);
    
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