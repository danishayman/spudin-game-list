import React from "react";
import { LoginForm } from "./components/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const LoginPage = () => {
  return (
    <main className="flex min-h-screen flex-col bg-slate-900 text-white">
      {/* Hero Section with Banner */}
      <div className="relative h-[40vh] w-full bg-slate-900">
        <Image
          src="/landing/banner.jpg"
          alt="Spudin's Game List Banner"
          fill
          priority
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900" />
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">
            Welcome to Spudin&apos;s Game List
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 drop-shadow-md text-slate-200">
            Sign in with Twitch to start your gaming journey
          </p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 flex items-start justify-center px-4 py-8 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="w-full max-w-md">
          <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-white">Sign In</CardTitle>
              <CardDescription className="text-slate-300">
                Use your Twitch account to access the app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
          
          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;