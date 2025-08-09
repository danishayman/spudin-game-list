import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client with the service role key for admin operations
 * This should only be used in server-side code for operations that require
 * elevated privileges, such as bypassing RLS policies.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase URL or service role key. Check your environment variables.');
  }
  
  return createSupabaseClient(supabaseUrl, supabaseServiceKey);
} 