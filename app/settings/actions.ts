"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export async function deleteAccount(confirmationText: string) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Verify confirmation text
  if (confirmationText !== 'DELETE') {
    return {
      success: false,
      message: 'Please type "DELETE" to confirm account deletion'
    };
  }

  try {
    // Step 1: Delete user's game reviews
    const { error: reviewsError } = await supabase
      .from('reviews')
      .delete()
      .eq('user_id', user.id);

    if (reviewsError) {
      console.error('Error deleting reviews:', reviewsError);
      // Don't throw here, continue with deletion
    }

    // Step 2: Delete user's game list entries
    const { error: gameListError } = await supabase
      .from('game_lists')
      .delete()
      .eq('user_id', user.id);

    if (gameListError) {
      console.error('Error deleting game lists:', gameListError);
      // Don't throw here, continue with deletion
    }

    // Step 3: Delete user's profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileError) {
      console.error('Error deleting profile:', profileError);
      throw new Error('Failed to delete profile data');
    }

    // Step 4: Delete the auth user using admin client
    const adminSupabase = createAdminClient();
    const { error: userError } = await adminSupabase.auth.admin.deleteUser(user.id);
    
    if (userError) {
      console.error('Error deleting auth user:', userError);
      throw new Error('Failed to delete user account');
    }

    // Step 5: Sign out the user
    await supabase.auth.signOut();

    // Redirect to home page after successful deletion
    redirect('/');
    
    return { 
      success: true, 
      message: 'Account deleted successfully.' 
    };
  } catch (error) {
    console.error('Error deleting account:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to delete account. Please try again or contact support.' 
    };
  }
}
