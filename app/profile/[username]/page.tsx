import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getUserGamesByUsername, getUserGameStatsByUsername } from "@/lib/game-actions";
import { UserProfileStats } from "@/components/UserProfileStats";
import { PublicGameCollection } from "@/components/PublicGameCollection";
import { ShareProfileButton } from "./ShareProfileButton";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  // Properly await the params object before using it
  const { username } = await params;
  const supabase = await createClient();
  
  // Decode the username parameter
  const decodedUsername = decodeURIComponent(username);
  
  // Get the current authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch the profile by username
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", decodedUsername)
    .single();
  
  if (error || !profile) {
    console.error("Error fetching profile:", error);
    notFound();
  }

  // Check if the current user is viewing their own profile
  const isOwnProfile = user && user.id === profile.id;

  // Fetch user's game stats and collection
  const gameStats = await getUserGameStatsByUsername(decodedUsername);
  const gamesByStatus = await getUserGamesByUsername(decodedUsername);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Cover/Banner Section */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          
          {/* Profile Header Content */}
          <div className="relative h-full flex items-end p-6 md:p-8">
            <div className="flex items-end gap-6 w-full">
              <div className="relative">
                {profile.avatar_url ? (
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl backdrop-blur-sm">
                    <Image 
                      src={profile.avatar_url} 
                      alt={profile.username || "User"}
                      width={144}
                      height={144}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-4 border-white/20 shadow-2xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-3xl md:text-4xl font-bold text-white">
                      {(profile.username || "User").charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                {/* Online status indicator (could be added later) */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 rounded-full border-3 border-white shadow-lg"></div>
              </div>
              
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                      {profile.username || "User"}
                    </h1>
                    <div className="flex items-center gap-4 text-white/80">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  
                  {isOwnProfile && (
                    <div className="hidden md:block">
                      <ShareProfileButton username={profile.username} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Share Button */}
        {isOwnProfile && (
          <div className="md:hidden p-4">
            <ShareProfileButton username={profile.username} />
          </div>
        )}
        
        {/* Content Section */}
        <div className="p-4 md:p-8 space-y-8">
          {/* Profile stats section */}
          <UserProfileStats stats={gameStats} />
          
          {/* Game collection section */}
          <PublicGameCollection gamesByStatus={gamesByStatus} isOwnProfile={!!isOwnProfile} />
        </div>
      </div>
    </div>
  );
} 