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
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-700 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {profile.avatar_url ? (
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <Image 
                    src={profile.avatar_url} 
                    alt={profile.full_name || "User"}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-slate-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-slate-300">
                    {(profile.full_name || "User").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <div>
                <h1 className="text-2xl font-bold text-white">{profile.full_name || profile.username || "User"}</h1>
                {profile.full_name && profile.username && profile.full_name !== profile.username && (
                  <p className="text-slate-400">{profile.username}</p>
                )}
              </div>
            </div>
            
            {isOwnProfile && (
              <ShareProfileButton username={profile.username} />
            )}
          </div>
        </div>
        
        {/* Profile stats section */}
        <UserProfileStats stats={gameStats} />
        
        {/* Game collection section */}
        <PublicGameCollection gamesByStatus={gamesByStatus} isOwnProfile={!!isOwnProfile} />
      </div>
    </div>
  );
} 