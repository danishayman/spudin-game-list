import { createClient } from '@/utils/supabase/server';
import { refreshProfileFromAuth, getCurrentUserProfile } from '@/lib/profile-actions';
import { Button } from '@/components/ui/button';

async function RefreshProfileButton() {
  async function handleRefresh() {
    'use server';
    await refreshProfileFromAuth();
  }

  return (
    <form action={handleRefresh}>
      <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
        Refresh Profile from Twitch Data
      </Button>
    </form>
  );
}

export default async function DebugProfilePage() {
  const data = await getCurrentUserProfile();
  
  if (!data?.user) {
    return (
      <div className="min-h-screen bg-slate-900 p-8 text-white">
        <h1>Not logged in</h1>
        <p>Please log in to see your profile data.</p>
      </div>
    );
  }

  const { user, profile } = data;

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Debug</h1>
        
        <div className="grid gap-6">
          {/* Current Profile Data */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Current Profile Data</h2>
            <div className="space-y-2 font-mono text-sm">
              <p><strong>Username:</strong> {profile?.username || 'null'}</p>
              <p><strong>Full Name:</strong> {profile?.full_name || 'null'}</p>
              <p><strong>Avatar URL:</strong> {profile?.avatar_url || 'null'}</p>
              <p><strong>Email:</strong> {profile?.email || 'null'}</p>
            </div>
          </div>

          {/* Auth User Metadata */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Auth User Metadata</h2>
            <div className="space-y-2 font-mono text-sm">
              <p><strong>Provider:</strong> {user.app_metadata?.provider || 'unknown'}</p>
              <p><strong>Login (Twitch username):</strong> {user.user_metadata?.login || 'null'}</p>
              <p><strong>Display Name:</strong> {user.user_metadata?.display_name || 'null'}</p>
              <p><strong>Profile Image URL:</strong> {user.user_metadata?.profile_image_url || 'null'}</p>
              <p><strong>Email:</strong> {user.user_metadata?.email || 'null'}</p>
              <p><strong>Preferred Username:</strong> {user.user_metadata?.preferred_username || 'null'}</p>
            </div>
          </div>

          {/* Full Auth Metadata (for debugging) */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">Full Auth Metadata (Debug)</h2>
            <pre className="text-xs overflow-auto bg-slate-900 p-4 rounded">
              {JSON.stringify(user.user_metadata, null, 2)}
            </pre>
          </div>

          {/* Refresh Button */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Actions</h2>
            <RefreshProfileButton />
            <p className="text-sm text-slate-400 mt-2">
              This will update your profile using the latest data from your Twitch authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}