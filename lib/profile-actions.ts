'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

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
        full_name: user.user_metadata?.display_name || 
                  user.user_metadata?.full_name || 
                  user.user_metadata?.name || 
                  user.user_metadata?.preferred_username,
        avatar_url: user.user_metadata?.profile_image_url || 
                   user.user_metadata?.avatar_url,
        username: user.user_metadata?.display_name || 
                 user.user_metadata?.login || 
                 user.user_metadata?.preferred_username || 
                 user.user_metadata?.username
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