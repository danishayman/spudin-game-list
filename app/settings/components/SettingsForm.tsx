"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
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
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
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
          full_name: formData.full_name,
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
                  {(formData.full_name || "User").charAt(0).toUpperCase()}
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
              <Label htmlFor="full_name" className="text-slate-300">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                placeholder="Enter your full name"
              />
            </div>

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
              <h3 className="font-medium">Game Activity</h3>
              <p className="text-sm text-slate-400">Share your gaming activity with friends</p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Enabled (Coming Soon)
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
              <h3 className="font-medium text-red-300">Sign Out</h3>
              <p className="text-sm text-slate-400">Sign out of your account</p>
            </div>
            <form action={signout}>
              <Button type="submit" variant="destructive" size="sm">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
