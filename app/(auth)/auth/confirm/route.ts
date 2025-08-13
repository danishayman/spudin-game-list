import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')
  redirectTo.searchParams.delete('code')

  const supabase = await createClient()

  // Handle OAuth callback (Twitch, etc.) with code
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('OAuth exchange error:', error);
    if (!error) {
      // Wait a moment for the trigger to create the profile, then redirect to profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the user's profile to redirect to their username
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        
        if (profile?.username) {
          redirectTo.pathname = `/profile/${encodeURIComponent(profile.username)}`;
        } else {
          redirectTo.pathname = '/home'; // Fallback to home if no username
        }
      }
      
      redirectTo.searchParams.delete('next')
      return NextResponse.redirect(redirectTo)
    }
  }
  
  // Handle email-based auth with token_hash
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    console.log('OTP verification error:', error);
    if (!error) {
      redirectTo.searchParams.delete('next')
      return NextResponse.redirect(redirectTo)
    }
  }
  
  // return the user to an error page with some instructions
  redirectTo.pathname = '/error'
  return NextResponse.redirect(redirectTo)
}