import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";

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

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-500">
                  {(profile.full_name || "User").charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            <div>
              <h1 className="text-2xl font-bold">{profile.full_name || "User"}</h1>
              <p className="text-gray-600">@{profile.username}</p>
            </div>
          </div>
        </div>
        
        {/* Profile stats section - placeholder for future implementation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-gray-500">Games</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-gray-500">Reviews</div>
            </div>
          </div>
        </div>
        
        {/* Game collection section - placeholder for future implementation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Game Collection</h2>
          <p className="text-gray-500">
            No games in collection yet.
          </p>
        </div>
      </div>
    </div>
  );
} 