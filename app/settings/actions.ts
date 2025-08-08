"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const username = formData.get('username') as string;
  const email = formData.get('email') as string;

  try {
    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        username,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileError) {
      throw profileError;
    }

    // Update email if changed
    if (email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email,
      });

      if (emailError) {
        throw emailError;
      }
    }

    revalidatePath('/settings');
    return { success: true, message: 'Profile updated successfully!' };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to update profile' 
    };
  }
}

// Note: This function is deprecated and replaced by the /api/delete-account route
// Keeping it for now to avoid breaking changes, but it should not be used
export async function deleteAccount(confirmationText: string) {
  console.warn('deleteAccount server action is deprecated. Use /api/delete-account route instead.');
  return {
    success: false,
    message: 'This method is no longer supported. Please refresh the page and try again.'
  };
}
