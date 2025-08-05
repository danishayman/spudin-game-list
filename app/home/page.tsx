import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // If no user is found, redirect to login
    redirect("/login");
  }
  
  // Fetch the user's profile from the profiles table
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
    
  if (error) {
    console.error("Error fetching profile:", error);
  }

  const username = profile?.username;

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">
            Welcome to your Dashboard, {profile?.username || user.user_metadata.display_name || "User"}!
          </h1>
          <p className="text-gray-600 mb-4">
            This is your personal dashboard where you can manage your game collection.
          </p>
          <Link 
            href={`/profile/${encodeURIComponent(username)}`}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View your public profile →
          </Link>
        </div>
        
        {/* Placeholder for future dashboard content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Game Collection</h2>
          <p className="text-gray-500">
            Your games will appear here once you start adding them to your collection.
          </p>
        </div>
      </div>
    </div>
  );
} 