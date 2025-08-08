import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const { confirmationText } = await request.json();

        // Verify confirmation text
        if (confirmationText !== 'DELETE') {
            return NextResponse.json(
                { error: 'Please type "DELETE" to confirm account deletion' },
                { status: 400 }
            );
        }

        // Create regular Supabase client to check authentication
        const supabase = await createClient();

        // Get the authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('Authentication error:', authError);
            return NextResponse.json(
                { error: 'User not authenticated' },
                { status: 401 }
            );
        }

        console.log(`Starting account deletion for user: ${user.id}`);

        // Create admin client for operations that need elevated privileges
        const adminSupabase = createAdminClient();

        // Robust deletion approach: Delete data in reverse dependency order
        const deletionSteps = [
            {
                name: 'reviews',
                action: () => adminSupabase.from('reviews').delete().eq('user_id', user.id)
            },
            {
                name: 'game_lists',
                action: () => adminSupabase.from('game_lists').delete().eq('user_id', user.id)
            },
            {
                name: 'profiles',
                action: () => adminSupabase.from('profiles').delete().eq('id', user.id)
            }
        ];

        // Execute deletion steps
        for (const step of deletionSteps) {
            console.log(`Deleting ${step.name}...`);
            const { error } = await step.action();
            if (error) {
                console.error(`Error deleting ${step.name}:`, error);
                // Continue with other deletions - some might not exist
            } else {
                console.log(`Successfully deleted ${step.name}`);
            }
        }

        // Final step: Soft delete the auth user (disable and mark deleted)
        console.log('Soft-deleting auth user...');
        const { error: softDeleteError } = await adminSupabase.auth.admin.deleteUser(user.id, true);
        if (softDeleteError) {
            // If user is already deleted, treat as success
            if (softDeleteError.message?.includes('User not found') || (softDeleteError as any)?.status === 404) {
                console.log('User already deleted (not found) - considering this success');
            } else {
                console.error('Error soft-deleting auth user:', softDeleteError);
                return NextResponse.json(
                    { error: `Failed to delete user account: ${softDeleteError.message}` },
                    { status: 500 }
                );
            }
        }

        console.log(`Successfully deleted account for user: ${user.id}`);

        // Return success response
        return NextResponse.json({
            success: true,
            message: 'Account deleted successfully. You will be redirected shortly...'
        });

    } catch (error) {
        console.error('Unexpected error during account deletion:', error);
        return NextResponse.json(
            {
                error: error instanceof Error
                    ? error.message
                    : 'Failed to delete account. Please try again or contact support.'
            },
            { status: 500 }
        );
    }
}
