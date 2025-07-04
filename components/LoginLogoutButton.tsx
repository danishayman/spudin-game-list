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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
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
