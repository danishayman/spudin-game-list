"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export default function ModernNavBar() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch profile data
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        setProfile(profileData);
      }
    };
    
    fetchUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        } else if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          fetchUser();
        }
      }
    );

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      subscription?.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close dropdown if open
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-opacity-10 bg-black backdrop-blur-sm text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side - Logo and nav links */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white mr-8">
              Spudin Game List
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link 
                href="/" 
                className="text-white hover:text-gray-300 transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="text-white hover:text-gray-300 transition-colors"
              >
                About
              </Link>
              {user && (
                <Link 
                  href="/my-games" 
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  My Games
                </Link>
              )}
            </nav>
          </div>

          {/* Right side - Search and profile */}
          <div className="flex items-center space-x-4">
            {/* Game search button */}
            <Link href="/games" className="flex items-center">
              <Button variant="outline" className="text-black border-gray-700 hover:bg-gray-800">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="mr-2 h-4 w-4"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              Game
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden flex items-center focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                {user && profile?.avatar_url ? (
                  <Image 
                    src={profile.avatar_url}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : user ? (
                  <span className="text-lg font-semibold">
                    {(profile?.full_name || user.user_metadata?.full_name || "U").charAt(0)}
                  </span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </div>
            </button>

            {/* Desktop profile dropdown */}
            {user ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  className="flex items-center focus:outline-none"
                  onClick={toggleDropdown}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <Image 
                        src={profile.avatar_url}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold">
                        {(profile?.full_name || user.user_metadata?.full_name || "U").charAt(0)}
                      </span>
                    )}
                  </div>
                </button>

                {/* Desktop dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <Link 
                      href={`/profile/${profile?.username || user.id}`}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    >
                      Profile
                    </Link>
                    <Link 
                      href="/settings"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden md:block">
                <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div 
                ref={mobileMenuRef}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                <div className="absolute right-0 top-0 h-full w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out animate-slide-in-right">
                  <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center justify-between">
                      {user ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                            {profile?.avatar_url ? (
                              <Image 
                                src={profile.avatar_url}
                                alt="Profile"
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-lg font-semibold">
                                {(profile?.full_name || user.user_metadata?.full_name || "U").charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {profile?.username || profile?.full_name || user.user_metadata?.full_name || "User"}
                            </p>
                            <p className="text-gray-400 text-sm truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <h2 className="text-white text-lg font-medium">Menu</h2>
                        </div>
                      )}
                      <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <nav className="p-4">
                    <ul className="space-y-2">
                      <li>
                        <Link 
                          href="/" 
                          className="block py-2 px-4 text-white hover:bg-gray-800 rounded-md"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/about" 
                          className="block py-2 px-4 text-white hover:bg-gray-800 rounded-md"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          About
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/games" 
                          className="block py-2 px-4 text-white hover:bg-gray-800 rounded-md"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Browse Games
                        </Link>
                      </li>
                      {user && (
                        <li>
                          <Link 
                            href="/my-games" 
                            className="block py-2 px-4 text-white hover:bg-gray-800 rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            My Games
                          </Link>
                        </li>
                      )}
                      {user && (
                        <li>
                          <Link 
                            href={`/profile/${profile?.username || user.id}`}
                            className="block py-2 px-4 text-white hover:bg-gray-800 rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Profile
                          </Link>
                        </li>
                      )}
                      {user && (
                        <li>
                          <Link 
                            href="/settings"
                            className="block py-2 px-4 text-white hover:bg-gray-800 rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Settings
                          </Link>
                        </li>
                      )}
                      {user ? (
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left py-2 px-4 text-white hover:bg-gray-800 rounded-md"
                          >
                            Sign out
                          </button>
                        </li>
                      ) : (
                        <li>
                          <Link
                            href="/login"
                            className="block py-2 px-4 text-white hover:bg-gray-800 rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Login
                          </Link>
                        </li>
                      )}
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
