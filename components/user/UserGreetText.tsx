
"use client";
import { createClient } from "@/supabase/client";
import React, { useEffect, useState, useMemo } from "react";
import type { User } from "@supabase/supabase-js";

const UserGreetText = () => {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  
  // Memoize the auth instance to prevent useEffect from re-running on every render
  const supabaseAuth = useMemo(() => supabase.auth, []);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error
        } = await supabaseAuth.getUser();
        
        if (error) {
          // Handle AuthSessionMissingError gracefully - this is expected when user is not logged in
          if (error.message?.includes('Auth session missing') || error.name === 'AuthSessionMissingError') {
            setUser(null);
            return;
          }
          console.error('Error getting user:', error);
          setUser(null);
          return;
        }
        
        setUser(user);
      } catch (err) {
        console.error('Error fetching user:', err);
        setUser(null);
      }
    };
    fetchUser();
  }, [supabaseAuth]);
  if (user !== null) {
    console.log(user);
    return (
      <p
        className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 
        backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"
      >
        hello&nbsp;
        <code className="font-mono font-bold">{user.user_metadata.preferred_username ?? user.user_metadata.display_name ?? "user"}!</code>
      </p>
    );
  }
  return (
    <p>
    </p>
  );
};

export default UserGreetText;