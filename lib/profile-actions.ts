'use server';

import { createClient } from '@/utils/supabase/server';

export interface UserStats {
  totalGames: number;
  gamesFinished: number;
  gamesPlaying: number;
  gamesWantToPlay: number;
  gamesOnHold: number;
  gamesDropped: number;
  averageRating: number;
  totalReviews: number;
  favoriteGenres: string[];
  recentActivity: string;
}

export interface ProfileData {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  stats: UserStats;
}

/**
 * Get public profile data for a user by username
 */
export async function getPublicProfile(username: string): Promise<ProfileData | null> {
  const supabase = await createClient();
  
  try {
    // Fetch the profile by username
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .eq('username', username)
      .single();
    
    if (profileError || !profile) {
      console.error('Error fetching profile:', profileError);
      return null;
    }

    // Get user's game statistics
    const stats = await getUserStats(profile.id);
    
    return {
      ...profile,
      stats
    };
  } catch (error) {
    console.error('Error in getPublicProfile:', error);
    return null;
  }
}

/**
 * Get user statistics from their game list and reviews
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  const supabase = await createClient();
  
  try {
    // Fetch all games in user's list with game details
    const { data: gameListData, error: gameListError } = await supabase
      .from('game_lists')
      .select(`
        status,
        rating,
        updated_at,
        games (
          genres
        )
      `)
      .eq('user_id', userId);
    
    if (gameListError) {
      console.error('Error fetching game list:', gameListError);
      throw gameListError;
    }

    // Fetch reviews count
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', userId);
    
    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      throw reviewsError;
    }

    const games = gameListData || [];
    const reviews = reviewsData || [];

    // Calculate basic stats
    const totalGames = games.length;
    const gamesFinished = games.filter(g => g.status === 'Finished').length;
    const gamesPlaying = games.filter(g => g.status === 'Playing').length;
    const gamesWantToPlay = games.filter(g => g.status === 'Want').length;
    const gamesOnHold = games.filter(g => g.status === 'On-hold').length;
    const gamesDropped = games.filter(g => g.status === 'Dropped').length;
    const totalReviews = reviews.length;

    // Calculate average rating (only for games with ratings > 0)
    const ratedGames = games.filter(g => g.rating && g.rating > 0);
    const averageRating = ratedGames.length > 0 
      ? ratedGames.reduce((sum, g) => sum + (g.rating || 0), 0) / ratedGames.length
      : 0;

    // Calculate favorite genres (this would need game genre data)
    // For now, we'll return empty array since genres aren't consistently available
    const favoriteGenres: string[] = [];

    // Get most recent activity
    const recentGame = games.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )[0];
    
    const recentActivity = recentGame 
      ? `Last updated ${new Date(recentGame.updated_at).toLocaleDateString()}`
      : 'No recent activity';

    return {
      totalGames,
      gamesFinished,
      gamesPlaying,
      gamesWantToPlay,
      gamesOnHold,
      gamesDropped,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews,
      favoriteGenres,
      recentActivity
    };
  } catch (error) {
    console.error('Error calculating user stats:', error);
    // Return empty stats instead of throwing
    return {
      totalGames: 0,
      gamesFinished: 0,
      gamesPlaying: 0,
      gamesWantToPlay: 0,
      gamesOnHold: 0,
      gamesDropped: 0,
      averageRating: 0,
      totalReviews: 0,
      favoriteGenres: [],
      recentActivity: 'No activity'
    };
  }
}

/**
 * Get public game list for a user (only completed and playing games)
 */
export async function getPublicGameList(userId: string, limit: number = 12) {
  const supabase = await createClient();
  
  try {
    const { data: rawGames, error } = await supabase
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
      .eq('user_id', userId)
      .in('status', ['Finished', 'Playing']) // Only show completed and currently playing games
      .order('updated_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching public game list:', error);
      return [];
    }

    // Transform the data to match expected format (handle array from join)
    const games = (rawGames || []).map((item: any) => ({
      game_id: item.game_id,
      status: item.status,
      rating: item.rating,
      updated_at: item.updated_at,
      games: Array.isArray(item.games) ? item.games[0] : item.games
    }));

    return games;
  } catch (error) {
    console.error('Error in getPublicGameList:', error);
    return [];
  }
}
