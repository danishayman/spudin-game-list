'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    // Get the current user session
    async function getUser() {
      try {
        setIsLoading(true);
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          // Handle AuthSessionMissingError gracefully - this is expected when user is not logged in
          if (userError.message?.includes('Auth session missing') || userError.name === 'AuthSessionMissingError') {
            setUser(null);
            return;
          }
          throw userError;
        }
        
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error getting user:', err);
        // For auth session missing errors, don't set error state - just set user to null
        if (err instanceof Error && (err.message?.includes('Auth session missing') || err.name === 'AuthSessionMissingError')) {
          setUser(null);
        } else {
          setError(err instanceof Error ? err : new Error('Failed to get user'));
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    // Call getUser immediately
    getUser();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: { user?: User } | null) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return { user, isLoading, error };
} 