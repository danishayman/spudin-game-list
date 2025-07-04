'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LogoutPage = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => router.push("/"), 3000);
  }, [router]);
  
  return (
    <main className="flex min-h-screen flex-col bg-slate-900 text-white">
      {/* Hero Section with Banner */}
      <div className="relative h-[60vh] w-full">
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
            See You Soon!
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 drop-shadow-md text-slate-200">
            You've been logged out successfully
          </p>
        </div>
      </div>

      {/* Logout Message Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-b from-slate-900 to-slate-800">
        <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700 shadow-2xl w-full max-w-md">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-white">Logged Out</CardTitle>
            <CardDescription className="text-slate-300">
              Redirecting you to the home page...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
            <p className="text-slate-400 text-sm">
              Thank you for using Spudin's Game List!
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default LogoutPage;