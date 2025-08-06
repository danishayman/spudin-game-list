"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";
import { deleteAccount } from "@/app/settings/actions";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    email: user.email || '',
  });

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) {
        throw profileError;
      }

      // Update email if changed
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email,
        });

        if (emailError) {
          throw emailError;
        }
      }

      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to update settings' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDeleteAccount = async (confirmationText: string) => {
    setIsDeleting(true);
    setMessage(null);

    try {
      const result = await deleteAccount(confirmationText);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setShowDeleteDialog(false);
        // The server action will handle the redirect
      } else {
        setMessage({ type: 'error', text: result.message });
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
      {/* Profile Settings */}
      <div className="bg-slate-800 text-white rounded-lg shadow-md p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Profile Settings</h2>
            <p className="text-slate-400 text-sm">Update your personal information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                  {(formData.username || "User").charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-medium mb-1">Profile Picture</h3>
              <p className="text-sm text-slate-400 mb-2">
                Avatar is synced with your Google account
              </p>
              <Button type="button" variant="outline" size="sm" disabled>
                Change Avatar (Coming Soon)
              </Button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                placeholder="Choose a username"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email" className="text-slate-300">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-600/20 text-green-300 border border-green-600/20' 
                : 'bg-red-600/20 text-red-300 border border-red-600/20'
            }`}>
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
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
            <Button variant="outline" size="sm" disabled>
              Enabled (Coming Soon)
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <h3 className="font-medium">Game Collection Visibility</h3>
              <p className="text-sm text-slate-400">Control who can see your game lists and ratings</p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Public (Coming Soon)
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <h3 className="font-medium">Activity Sharing</h3>
              <p className="text-sm text-slate-400">Share your gaming activity with others</p>
            </div>
            <Button variant="outline" size="sm" disabled>
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
            <Button variant="outline" size="sm" disabled>
              Enabled (Coming Soon)
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <h3 className="font-medium">Default Rating System</h3>
              <p className="text-sm text-slate-400">Choose between 5-star or 10-point rating scale</p>
            </div>
            <Button variant="outline" size="sm" disabled>
              10-point (Coming Soon)
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <h3 className="font-medium">Platform Preferences</h3>
              <p className="text-sm text-slate-400">Set your preferred gaming platforms</p>
            </div>
            <Button variant="outline" size="sm" disabled>
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
            <Button variant="outline" size="sm" disabled>
              Change Password (Coming Soon)
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div>
              <h3 className="font-medium">Export Data</h3>
              <p className="text-sm text-slate-400">Download your gaming data and preferences</p>
            </div>
            <Button variant="outline" size="sm" disabled>
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
              <Button type="submit" variant="outline" size="sm">
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
