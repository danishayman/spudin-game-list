'use client';

import { RawgGame } from '@/lib/rawg';
import { GameCard } from './GameCard';
import DragScrollContainer from './DragScrollContainer';
import Link from 'next/link';

interface GameCollectionProps {
  title: string;
  description?: string;
  games: RawgGame[];
  isLoading?: boolean;
  error?: string | null;
}

export function GameCollection({ 
  title, 
  description, 
  games, 
  isLoading = false, 
  error = null 
}: GameCollectionProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
          {description && (
            <p className="text-slate-300 text-sm mt-1">{description}</p>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-16">
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

      {!isLoading && !error && games.length === 0 && (
        <div className="p-6 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-center">
          No games available
        </div>
      )}

      {!isLoading && !error && games.length > 0 && (
        <div className="relative">
          <DragScrollContainer className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="flex-shrink-0 group"
              >
                <div className="bg-slate-700 rounded-lg overflow-hidden w-64 h-64 flex flex-col transition-transform group-hover:scale-105">
                  <div className="relative h-36">
                    {game.background_image ? (
                      <div className="relative h-full w-full">
                        <img
                          src={game.background_image}
                          alt={game.name}
                          className="object-cover h-full w-full"
                        />
                      </div>
                    ) : (
                      <div className="h-full w-full bg-slate-600 flex items-center justify-center">
                        <span className="text-slate-400 text-sm">No image</span>
                      </div>
                    )}
                    {game.metacritic && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-bold">
                        {game.metacritic}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-sm mb-1 truncate text-white">{game.name}</h3>
                    <p className="text-slate-400 text-xs mb-2 h-8 line-clamp-2 overflow-hidden">
                      {game.genres?.map((g: any) => g.name).join(', ') || 'Various Genres'}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {game.released ? new Date(game.released).getFullYear() : 'TBA'}
                      </span>
                      <span className={`text-xs flex items-center ${
                        game.rating >= 4 ? 'text-green-400' : 
                        game.rating >= 3 ? 'text-yellow-400' : 'text-slate-400'
                      }`}>
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        {game.rating ? game.rating.toFixed(1) : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </DragScrollContainer>
        </div>
      )}
    </div>
  );
} 