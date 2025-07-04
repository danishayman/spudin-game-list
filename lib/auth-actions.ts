"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log("Signout error:", error);
    redirect(`/error?error=${encodeURIComponent(error.message)}&message=${encodeURIComponent("Failed to sign out. Please try again.")}`);
  }

  redirect("/logout");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log("Google sign-in error:", error);
    redirect(`/error?error=${encodeURIComponent(error.message)}&message=${encodeURIComponent("Failed to sign in with Google. Please try again.")}`);
  }

  redirect(data.url);
}
