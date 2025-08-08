"use server";

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

export async function signInWithTwitch() {
  const supabase = await createClient();
  
  // Use localhost for development, production URL for production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // For development, use port 3000 (which your server is currently using)
  const redirectTo = isDevelopment 
    ? 'http://localhost:3000/auth/confirm'
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://spudin-game-list.vercel.app/'}/auth/confirm`;
  
  console.log('Twitch OAuth redirect URL:', redirectTo);
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "twitch",
    options: {
      redirectTo,
      scopes: "openid user:read:email", // OpenID Connect scope to get username via preferred_username claim
    },
  });

  if (error) {
    console.log("Twitch sign-in error:", error);
    redirect(`/error?error=${encodeURIComponent(error.message)}&message=${encodeURIComponent("Failed to sign in with Twitch. Please try again.")}`);
  }

  redirect(data.url);
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("Email sign-in error:", error);
    redirect(`/error?error=${encodeURIComponent(error.message)}&message=${encodeURIComponent("Failed to sign in. Please check your credentials.")}`);
  }

  redirect("/");
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = await createClient();
  
  // Use localhost for development, production URL for production
  const isDevelopment = process.env.NODE_ENV === 'development';
  const redirectTo = isDevelopment 
    ? 'http://localhost:3000/auth/confirm'
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-production-domain.com'}/auth/confirm`;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) {
    console.log("Email sign-up error:", error);
    redirect(`/error?error=${encodeURIComponent(error.message)}&message=${encodeURIComponent("Failed to sign up. Please try again.")}`);
  }

  redirect("/login?message=Check your email to confirm your account");
}

export async function resetPassword(email: string) {
  const supabase = await createClient();
  
  // Use localhost for development, production URL for production
  const isDevelopment = process.env.NODE_ENV === 'development';
  const redirectTo = isDevelopment 
    ? 'http://localhost:3000/auth/confirm?type=recovery'
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-production-domain.com'}/auth/confirm?type=recovery`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    console.log("Password reset error:", error);
    redirect(`/error?error=${encodeURIComponent(error.message)}&message=${encodeURIComponent("Failed to send reset email. Please try again.")}`);
  }

  redirect("/login?message=Check your email for password reset instructions");
}
