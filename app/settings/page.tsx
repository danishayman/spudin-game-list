import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/forms/SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect("/login");
  }
  
  // Fetch the user's profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
    
  if (profileError) {
    console.error("Error fetching profile:", profileError);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
            <p className="text-slate-400">
              Manage your account settings, privacy preferences, and profile information.
            </p>
          </div>
          
          <SettingsForm user={user} profile={profile} />
        </div>
      </div>
    </div>
  );
}