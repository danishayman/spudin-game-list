'use server';

import { createClient } from '@/supabase/server';

export interface UserStats {
  totalGames: number;
  gamesFinished: number;
  gamesPlaying: number;
  gamesWantToPlay: number;
  gamesOnHold: number;
  gamesDropped: number;
  averageRating: number;
  totalReviews: number;
  recentActivity: string | null;
}

/**
 * Refresh user profile data from auth metadata
 * This is useful after migrating from Google to Twitch to update profile info
 */
export async function refreshProfileFromAuth() {
  const supabase = await createClient();
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) {
      throw new Error('Not authenticated');
    }

    console.log('User auth metadata:', user.user_metadata);

    // Update profile with fresh auth data
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_url: user.user_metadata?.profile_image_url || 
                   user.user_metadata?.avatar_url,
        username: user.user_metadata?.preferred_username || 
                 user.user_metadata?.login || 
                 user.user_metadata?.username ||
                 user.user_metadata?.display_name
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      throw new Error('Failed to update profile');
    }

    console.log('Profile updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error refreshing profile:', error);
    throw new Error('Failed to refresh profile');
  }
}

/**
 * Get current user's profile data
 */
export async function getCurrentUserProfile() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user, profile };
}

/**
 * Get public profile data by username (for API and public access)
 */
export async function getPublicProfile(username: string) {
  const supabase = await createClient();
  
  try {
    // Get profile by username
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (profileError || !profile) {
      return null;
    }

    // Get game stats for this user
    const { data: gamesData, error: gamesError } = await supabase
      .from('game_lists')
      .select('status, rating')
      .eq('user_id', profile.id);

    if (gamesError) {
      console.error('Error fetching game stats:', gamesError);
      // Return profile without stats if game stats fail
      return {
        ...profile,
        stats: {
          totalGames: 0,
          gamesFinished: 0,
          gamesPlaying: 0,
          gamesWantToPlay: 0,
          gamesOnHold: 0,
          gamesDropped: 0,
          averageRating: 0,
          totalReviews: 0,
          recentActivity: null
        }
      };
    }

    // Calculate stats
    const statCounts = {
      total: gamesData?.length || 0,
      finished: gamesData?.filter(g => g.status === 'Finished').length || 0,
      playing: gamesData?.filter(g => g.status === 'Playing').length || 0,
      wantToPlay: gamesData?.filter(g => g.status === 'Want').length || 0,
      onHold: gamesData?.filter(g => g.status === 'On-hold').length || 0,
      dropped: gamesData?.filter(g => g.status === 'Dropped').length || 0,
    };

    // Calculate average rating
    const ratedGames = gamesData?.filter(g => g.rating) || [];
    const averageRating = ratedGames.length > 0 
      ? ratedGames.reduce((sum, game) => sum + game.rating, 0) / ratedGames.length 
      : 0;

    // Get review count
    const { count: reviewCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id);

    return {
      ...profile,
      stats: {
        totalGames: statCounts.total,
        gamesFinished: statCounts.finished,
        gamesPlaying: statCounts.playing,
        gamesWantToPlay: statCounts.wantToPlay,
        gamesOnHold: statCounts.onHold,
        gamesDropped: statCounts.dropped,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews: reviewCount || 0,
        recentActivity: null // Could be enhanced later
      }
    };
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return null;
  }
}