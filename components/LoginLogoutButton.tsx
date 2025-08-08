"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";
import type { User } from "@supabase/supabase-js";

const LoginButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error
        } = await supabase.auth.getUser();
        
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
  }, [supabase.auth]);
  if (user) {
    return (
      <div className="flex gap-2">
        <Button
          variant="default"
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          Dashboard
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            signout();
            setUser(null);
          }}
        >
          Log out
        </Button>
      </div>
    );
  }
  return (
    <Button
      variant="outline"
      className="text-black"
      onClick={() => {
        router.push("/login");
      }}
    >
      Login
    </Button>
  );
};

export default LoginButton;
