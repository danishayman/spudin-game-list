'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import { GameCard } from './GameCard';
import { type IgdbGame as RawgGame } from '@/lib/igdb';
import { searchGamesClient } from '@/lib/games-client';

interface GameSearchProps {
  onGameSelect?: (gameId: number) => void;
  className?: string;
}

export function GameSearch({ onGameSelect, className = '' }: GameSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RawgGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await searchGamesClient(query);
        setResults(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search games');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const handleGameClick = (gameId: number) => {
    if (onGameSelect) {
      onGameSelect(gameId);
    } else {
      router.push(`/games/${gameId}`);
    }
  };

  // Filter results based on selected platform
  const filteredResults = selectedPlatform === 'all' 
    ? results 
    : results.filter(game => 
        game.platforms?.some(p => p && p.name && (
          p.name.toLowerCase() === selectedPlatform || 
          p.name.toLowerCase().includes(selectedPlatform)
        ))
      );

  // Sort results based on selected sort option
  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'released':
        return new Date(b.released || 0).getTime() - new Date(a.released || 0).getTime();
      default:
        return 0; // Default is relevance (API order)
    }
  });

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <Input
          type="text"
          placeholder="Search for games..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-4 py-3 rounded-lg shadow-sm bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none text-lg"
          autoFocus
        />
      </div>

      {query.trim() && (
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium text-slate-300 whitespace-nowrap">Platform:</span>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2 min-w-0 flex-1 sm:flex-none"
            >
              <option value="all">All Platforms</option>
              <option value="pc">PC</option>
              <option value="playstation5">PlayStation 5</option>
              <option value="xbox-series-x">Xbox Series X</option>
              <option value="nintendo-switch">Nintendo Switch</option>
              <option value="ios">iOS</option>
              <option value="android">Android</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium text-slate-300 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2 min-w-0 flex-1 sm:flex-none"
            >
              <option value="relevance">Relevance</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="released">Release Date</option>
            </select>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {error && (
        <div className="p-6 bg-red-900/30 border border-red-800 text-red-300 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd"></path>
          </svg>
          {error}
        </div>
      )}

      {sortedResults.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Search Results</h2>
            <span className="text-sm text-slate-400">{sortedResults.length} games found</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto pr-2 pb-4">
            {sortedResults.map((game) => (
              <GameCard 
                key={game.id} 
                game={game} 
                onClick={() => handleGameClick(game.id)}
              />
            ))}
          </div>
        </>
      )}

      {sortedResults.length === 0 && query && !isLoading && !error && (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-700 rounded-lg border border-slate-600">
          <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-lg font-medium text-white mb-1">No games found</h3>
          <p className="text-slate-300 text-center">
            We couldn&apos;t find any games matching &quot;{query}&quot;
          </p>
        </div>
      )}

      {!query.trim() && !isLoading && (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-slate-700/50 p-4 sm:p-6 rounded-lg border border-slate-600 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Discover Games</h3>
              <p className="text-slate-300">Search through our database of 300,000+ games across all platforms</p>
            </div>
            
            <div className="bg-slate-700/50 p-4 sm:p-6 rounded-lg border border-slate-600 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Track Your Collection</h3>
              <p className="text-slate-300">Add games to your collection and track your progress</p>
            </div>
            
            <div className="bg-slate-700/50 p-4 sm:p-6 rounded-lg border border-slate-600 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Rate & Review</h3>
              <p className="text-slate-300">Share your opinions and see what others think</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-slate-600 p-4 sm:p-6">
            <h3 className="text-xl font-bold text-white mb-4">Search Tips</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"></path>
                </svg>
                <span>Use specific game titles for best results</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"></path>
                </svg>
                <span>Filter by platform to narrow down results</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"></path>
                </svg>
                <span>Sort by rating to find the highest rated games</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"></path>
                </svg>
                <span>Try searching by genre (e.g., &quot;RPG&quot;, &quot;FPS&quot;, &quot;Strategy&quot;)</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-slate-400">Start typing to search our database of over 300,000+ games</p>
          </div>
        </div>
      )}
    </div>
  );
} 