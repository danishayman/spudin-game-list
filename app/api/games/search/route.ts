import { NextResponse } from 'next/server';
import { searchGames } from '@/lib/rawg';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Get search results from RAWG
    const results = await searchGames(query);
    
    // Check if user is logged in
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // If user is logged in, check which games are in their list
    if (user) {
      // Get all games in user's list
      const { data: userGames } = await supabase
        .from('game_lists')
        .select('game_id, status, rating')
        .eq('user_id', user.id);
      
      // Create a map of user's games for quick lookup
      const userGameMap = new Map();
      if (userGames) {
        userGames.forEach(game => {
          userGameMap.set(game.game_id, {
            status: game.status,
            rating: game.rating
          });
        });
      }
      
      // Add user's game status and rating to search results
      if (results.results && results.results.length > 0) {
        results.results = results.results.map(game => {
          const userGame = userGameMap.get(game.id);
          return {
            ...game,
            user_status: userGame?.status || null,
            user_rating: userGame?.rating || null,
            in_user_list: !!userGame
          };
        });
      }
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching games:', error);
    return NextResponse.json(
      { error: 'Failed to search games' },
      { status: 500 }
    );
  }
} 