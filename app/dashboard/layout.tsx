import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // Redirect to login if not authenticated
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-indigo-600">
                  Spudin Game List
                </Link>
              </div>
              <nav className="ml-6 flex space-x-4 sm:space-x-6">
                <Link 
                  href="/dashboard" 
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/games" 
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Discover Games
                </Link>
                <Link 
                  href="/" 
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Home
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <Link 
                href="/logout" 
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                Log out
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 