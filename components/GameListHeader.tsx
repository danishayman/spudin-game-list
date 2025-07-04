'use client';

import Image from 'next/image';
import Link from 'next/link';
import { GameRatingDialog } from './GameRatingDialog';
import { Button } from './ui/button';
import type { UserGameEntry } from '@/lib/game-actions';

interface GameListHeaderProps {
  game: UserGameEntry;
}

export function GameListHeader({ game }: GameListHeaderProps) {
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color and icon
  const getStatusInfo = (status: string | null) => {
    switch (status) {
      case 'Finished':
        return { 
          icon: '✓', 
          color: 'bg-blue-600', 
          textColor: 'text-blue-100',
          hoverColor: 'hover:bg-blue-700'
        };
      case 'Playing':
        return { 
          icon: '◉', 
          color: 'bg-green-600', 
          textColor: 'text-green-100',
          hoverColor: 'hover:bg-green-700'
        };
      case 'Dropped':
        return { 
          icon: '✗', 
          color: 'bg-red-600', 
          textColor: 'text-red-100',
          hoverColor: 'hover:bg-red-700'
        };
      case 'Want':
        return { 
          icon: '✧', 
          color: 'bg-purple-600', 
          textColor: 'text-purple-100',
          hoverColor: 'hover:bg-purple-700'
        };
      case 'On-hold':
        return { 
          icon: '❚❚', 
          color: 'bg-amber-600', 
          textColor: 'text-amber-100',
          hoverColor: 'hover:bg-amber-700'
        };
      default:
        return { 
          icon: '?', 
          color: 'bg-slate-600', 
          textColor: 'text-slate-100',
          hoverColor: 'hover:bg-slate-700'
        };
    }
  };

  const statusInfo = getStatusInfo(game.status);
  const gameName = game.games?.name || 'Unknown Game';
  const gameImage = game.games?.background_image || null;
  const gameReleased = game.games?.released || null;
  const gameRating = game.games?.rating || null;
  
  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg p-4 mb-6 w-full hover:bg-slate-800 transition-colors group relative">
      <div className="flex items-center gap-4">
        {/* Game Image */}
        <div className="hidden sm:block h-24 w-24 relative rounded overflow-hidden flex-shrink-0">
          <Link href={`/games/${game.game_id}`}>
            {gameImage ? (
              <Image
                src={gameImage}
                alt={gameName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-slate-700 flex items-center justify-center">
                <span className="text-slate-400">No image</span>
              </div>
            )}
          </Link>
        </div>
        
        {/* Game Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Rank/Position (optional) */}
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-slate-300 font-bold">
                2
              </div>
              
              {/* Game Title */}
              <Link href={`/games/${game.game_id}`} className="hover:underline">
                <h2 className="text-2xl font-bold text-white">{gameName}</h2>
              </Link>
            </div>
            
            {/* Rating */}
            <div className="text-5xl font-bold text-cyan-400">
              {game.rating && game.rating > 0 ? game.rating.toFixed(1) : '-'}
            </div>
          </div>
          
          {/* Game Metadata */}
          <div className="mt-2 text-slate-400 text-sm">
            {/* This would come from game.games.genres if available */}
            <span>Role-playing (RPG), Hack and slash/Beat &apos;em up, Adventure, Indie</span>
            <span className="mx-2">•</span>
            <span>{gameReleased ? new Date(gameReleased).getFullYear() : 'TBA'}</span>
            <span className="mx-2">•</span>
            <span>Main Game</span>
          </div>
          
          {/* Status and Date */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Status Badge */}
              <div className={`${statusInfo.color} ${statusInfo.textColor} px-3 py-1 rounded-full text-sm font-medium flex items-center`}>
                <span className="mr-1">{statusInfo.icon}</span>
                {game.status}
              </div>
              
              {/* Date Added */}
              <div className="text-slate-400 text-sm">
                Added: {formatDate(game.updated_at)}
              </div>
            </div>
            
            {/* Edit Button */}
            <GameRatingDialog
              gameId={game.game_id}
              gameName={gameName}
              gameImage={gameImage || undefined}
              gameReleased={gameReleased || undefined}
              gameRating={gameRating || undefined}
              triggerComponent={
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-purple-600/90 text-white border-purple-500 hover:bg-purple-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Button>
              }
            />
          </div>
        </div>
      </div>
      
      {/* Absolute positioned edit button that appears on hover for mobile */}
      <div className="absolute top-2 right-2 sm:hidden opacity-0 group-hover:opacity-100 transition-opacity">
        <GameRatingDialog
          gameId={game.game_id}
          gameName={gameName}
          gameImage={gameImage || undefined}
          gameReleased={gameReleased || undefined}
          gameRating={gameRating || undefined}
          triggerComponent={
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-purple-600/90 text-white border-purple-500 hover:bg-purple-700 p-1 h-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
          }
        />
      </div>
    </div>
  );
} 