'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { GameCard } from './GameCard';
import { searchGames, type RawgGame } from '@/lib/rawg';

export function GameSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RawgGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await searchGames(query);
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search games');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameClick = (gameId: number) => {
    router.push(`/games/details?id=${gameId}`);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for games..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>

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