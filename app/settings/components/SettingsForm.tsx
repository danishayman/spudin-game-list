"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface SettingsFormProps {
  user: User;
  profile: Profile | null;
}

export function SettingsForm({ user, profile }: SettingsFormProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const supabase = createClient();

  // Form submission removed as we're no longer editing username/email

  // Form change handler removed as we're no longer editing username/email

  const handleDeleteAccount = async (confirmationText?: string) => {
    const confirmation = confirmationText || '';
    
    // Local validation: Check confirmation text before making server call
    if (confirmation !== 'DELETE') {
      setMessage({ 
        type: 'error', 
        text: 'Please type "DELETE" to confirm account deletion' 
      });
      return;
    }

    setIsDeleting(true);
    setMessage(null);

    try {
      // Call the API route to delete the account
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirmationText: confirmation }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ type: 'success', text: result.message });
        setShowDeleteDialog(false);
        
        // Sign out the user client-side and redirect
        await supabase.auth.signOut();
        
        // Show success message briefly before redirecting
        setTimeout(() => {
          window.location.href = '/';
        }, 2000); // 2 second delay to show confirmation
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || 'Failed to delete account. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-900/30 border-green-800 text-green-300' 
            : 'bg-red-900/30 border-red-800 text-red-300'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd"></path>
              </svg>
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Profile Settings */}
      <div className="bg-slate-800 text-white rounded-lg shadow-md p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <p className="text-slate-400 text-sm">View your personal information</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            {profile?.avatar_url ? (
              <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-slate-600">
                <Image 
                  src={profile.avatar_url} 
                  alt="Profile"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center ring-2 ring-slate-600">
                <span className="text-xl font-bold text-purple-300">
                  {(profile?.username || user.email || "User").charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-medium mb-1">Profile Picture</h3>
              <p className="text-sm text-slate-400 mb-2">
                Avatar is synced with your Google account
              </p>
              <Button type="button" variant="outline" size="sm" disabled className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white">
                Change Avatar (Coming Soon)
              </Button>
            </div>
          </div>

          {/* User Information Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Username</Label>
              <div className="bg-slate-700 border border-slate-600 text-white p-3 rounded-md">
                {profile?.username || 'No username set'}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-300">Email Address</Label>
              <div className="bg-slate-700 border border-slate-600 text-white p-3 rounded-md">
                {user.email || 'No email available'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-slate-800 text-white rounded-lg shadow-md p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Privacy Settings</h2>
            <p className="text-slate-400 text-sm">Control your privacy and data preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <h3 className="font-medium">Public Profile</h3>
              <p className="text-sm text-slate-400">Allow others to view your gaming profile</p>
            </div>
            <Button variant="outline" size="sm" disabled className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white">
              Enabled (Coming Soon)
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <h3 className="font-medium">Game Collection Visibility</h3>
              <p className="text-sm text-slate-400">Control who can see your game lists and ratings</p>
            </div>
            <Button variant="outline" size="sm" disabled className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white">
              Public (Coming Soon)
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <h3 className="font-medium">Activity Sharing</h3>
              <p className="text-sm text-slate-400">Share your gaming activity with others</p>
            </div>
            <Button variant="outline" size="sm" disabled className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white">
              Enabled (Coming Soon)
            </Button>
          </div>
        </div>
      </div>

      {/* Content Preferences */}
      <div className="bg-slate-800 text-white rounded-lg shadow-md p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Content Preferences</h2>
            <p className="text-slate-400 text-sm">Customize your gaming content experience</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <h3 className="font-medium">Content Filtering</h3>
              <p className="text-sm text-slate-400">Filter mature or adult content from search results</p>
            </div>
            <Button variant="outline" size="sm" disabled className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white">
              Enabled (Coming Soon)
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <h3 className="font-medium">Default Rating System</h3>
              <p className="text-sm text-slate-400">Choose between 5-star or 10-point rating scale</p>
            </div>
            <Button variant="outline" size="sm" disabled className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white">
              10-point (Coming Soon)
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <h3 className="font-medium">Platform Preferences</h3>
              <p className="text-sm text-slate-400">Set your preferred gaming platforms</p>
            </div>
            <Button variant="outline" size="sm" disabled className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white">
              Configure (Coming Soon)
            </Button>
          </div>
        </div>
      </div>

      {/* Account Management */}
      <div className="bg-slate-800 text-white rounded-lg shadow-md p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-8 bg-red-600/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Account Management</h2>
            <p className="text-slate-400 text-sm">Manage your account and security settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <h3 className="font-medium">Change Password</h3>
              <p className="text-sm text-slate-400">Update your account password</p>
            </div>
            <Button variant="outline" size="sm" disabled className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white">
              Change Password (Coming Soon)
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <h3 className="font-medium">Export Data</h3>
              <p className="text-sm text-slate-400">Download your gaming data and preferences</p>
            </div>
            <Button variant="outline" size="sm" disabled className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white">
              Export (Coming Soon)
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-600/10 border border-red-600/20 rounded-lg">
            <div>
              <h3 className="font-medium text-red-300">Delete Account</h3>
              <p className="text-sm text-slate-400">Permanently delete your account and all data</p>
            </div>
            <Button 
              type="button" 
              variant="destructive" 
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              Delete Account
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <h3 className="font-medium">Sign Out</h3>
              <p className="text-sm text-slate-400">Sign out of your account</p>
            </div>
            <form action={signout}>
              <Button type="submit" variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Account"
        description="This action cannot be undone. This will permanently delete your account, game collection, reviews, and all associated data."
        confirmationText="DELETE"
        confirmationPlaceholder="Type DELETE to confirm"
        confirmButtonText="Delete Account"
        confirmButtonVariant="destructive"
        onConfirm={handleDeleteAccount}
        isLoading={isDeleting}
      />
    </div>
  );
}
