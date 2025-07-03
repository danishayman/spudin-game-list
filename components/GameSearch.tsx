'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { GameCard } from './GameCard';
import { type RawgGame } from '@/lib/rawg';
import { searchGamesClient } from '@/lib/games-client';

export function GameSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RawgGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    router.push(`/games/details?id=${gameId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for games..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      {isLoading && (
        <div className="p-4 text-center text-gray-500">
          Searching...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((game) => (
            <GameCard 
              key={game.id} 
              game={game} 
              onClick={() => handleGameClick(game.id)}
            />
          ))}
        </div>
      )}

      {results.length === 0 && query && !isLoading && !error && (
        <div className="p-4 text-center text-gray-500">
          No games found matching "{query}"
        </div>
      )}
    </div>
  );
} 