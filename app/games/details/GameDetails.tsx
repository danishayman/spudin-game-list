'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { type RawgGame } from '@/lib/rawg';
import { getGameByIdClient } from '@/lib/games-client';

interface GameDetailsProps {
  gameId: number;
}

export default function GameDetails({ gameId }: GameDetailsProps) {
  const [game, setGame] = useState<RawgGame | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGame() {
      try {
        const gameData = await getGameByIdClient(gameId);
        setGame(gameData);
        
        // Dynamically update the document title
        if (gameData?.name) {
          document.title = `${gameData.name} - Spudin Game List`;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load game details');
      } finally {
        setIsLoading(false);
      }
    }

    fetchGame();
  }, [gameId]);

  if (isLoading) {
    return null; // Parent component handles loading state
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="p-4 bg-red-900/30 border border-red-800 text-red-300 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto py-8">
        <div className="p-4 bg-amber-900/30 border border-amber-800 text-amber-300 rounded-md">
          Game not found
        </div>
      </div>
    );
  }

  // Function to determine metacritic color
  const getMetacriticColorClass = (score: number) => {
    if (score >= 75) return 'bg-green-700 text-green-100';
    if (score >= 50) return 'bg-yellow-600 text-yellow-100';
    return 'bg-red-700 text-red-100';
  };

  return (
    <div className="container mx-auto py-8 text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Game Image */}
        <div className="md:col-span-1">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-md">
            {game.background_image ? (
              <Image
                src={game.background_image}
                alt={`${game.name} cover`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            ) : (
              <div className="h-full w-full bg-slate-700 flex items-center justify-center">
                <span className="text-slate-400">No image available</span>
              </div>
            )}
          </div>
          
          {/* Add to Collection Button Placeholder */}
          <div className="mt-4">
            <button 
              className="w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              disabled
            >
              Add to Collection
            </button>
            <p className="text-xs text-center mt-2 text-slate-400">
              (Coming soon in the next step)
            </p>
          </div>
        </div>
        
        {/* Game Details */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4 text-white">{game.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">⭐</span>
              <span className="font-semibold">{game.rating.toFixed(1)}</span>
            </div>
            
            {game.metacritic && (
              <div className={`px-2 py-1 rounded-md text-sm font-medium ${getMetacriticColorClass(game.metacritic)}`}>
                Metacritic: {game.metacritic}
              </div>
            )}
            
            {game.released && (
              <div className="text-slate-300">
                Released: {new Date(game.released).toLocaleDateString()}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-white">Genres</h2>
            <div className="flex flex-wrap gap-2">
              {game.genres?.map((genre) => (
                <span 
                  key={genre.id}
                  className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-white">Platforms</h2>
            <div className="flex flex-wrap gap-2">
              {game.platforms?.map((platform) => (
                <span 
                  key={platform.platform.id}
                  className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm"
                >
                  {platform.platform.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 