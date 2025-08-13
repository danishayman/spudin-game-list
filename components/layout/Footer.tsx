"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-lg font-bold mb-4">Spudin Game List</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Track, discover, and share your favorite games. Build your personal game library, 
              rate games, and connect with fellow gamers in our community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/games" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Browse Games
                </Link>
              </li>
              <li>
                <Link 
                  href="/my-games" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  My Games
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal & Support</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms-of-service" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:support@spudingamelist.com" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © {currentYear} Spudin Game List. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <p className="text-gray-400 text-xs">
                Game data provided by{" "}
                <a 
                  href="https://igdb.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  IGDB
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
