'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import { GameCard } from './GameCard';
import { type RawgGame } from '@/lib/rawg';
import { searchGamesClient } from '@/lib/games-client';

export function GameSearch() {
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
    router.push(`/games/${gameId}`);
  };

  // Filter results based on selected platform
  const filteredResults = selectedPlatform === 'all' 
    ? results 
    : results.filter(game => 
        game.platforms?.some(p => p.platform.name.toLowerCase() === selectedPlatform || 
                               p.platform.name.toLowerCase().includes(selectedPlatform))
      );

  // Sort results based on selected sort option
  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'released':
        return new Date(b.released || 0).getTime() - new Date(a.released || 0).getTime();
      default:
        return 0; // Default is relevance (API order)
    }
  });

  return (
    <div className="space-y-6">
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
          className="pl-10 pr-4 py-3 rounded-lg shadow-sm bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {query.trim() && (
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-300">Platform:</span>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2"
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
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </div>
  );
} 