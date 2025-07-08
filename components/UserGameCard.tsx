'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { GameRatingDialog } from './GameRatingDialog';
import type { UserGameEntry } from '@/lib/game-actions';

type UserGameCardProps = {
  game: UserGameEntry;
};

export function UserGameCard({ game }: UserGameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format release date
  const formatReleaseDate = (date: string | null) => {
    if (!date) return 'TBA';
    return new Date(date).toLocaleDateString('en-US', { 
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

  // Get rating color
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-400';
    if (rating >= 6) return 'text-lime-400';
    if (rating >= 4) return 'text-yellow-400';
    if (rating >= 2) return 'text-orange-400';
    return 'text-red-400';
  };

  const statusInfo = getStatusInfo(game.status);
  
  // Handle the case when games is null
  const gameName = game.games?.name || 'Unknown Game';
  const gameImage = game.games?.background_image || null;
  const gameReleased = game.games?.released || null;
  const gameRating = game.games?.rating || null;
  
  return (
    <Card 
      className="overflow-hidden h-full flex flex-col bg-slate-800 border-slate-700 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-40 w-full">
        {gameImage ? (
          <Image
            src={gameImage}
            alt={`${gameName} cover`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="h-full w-full bg-slate-700 flex items-center justify-center">
            <span className="text-slate-400">No image</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-2 left-2 ${statusInfo.color} ${statusInfo.textColor} px-2 py-1 rounded text-xs font-bold`}>
          <span className="mr-1">{statusInfo.icon}</span>
          {game.status}
        </div>
        
        {/* Rating Badge */}
        {game.rating && game.rating > 0 && (
          <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs font-bold">
            <span className={`${getRatingColor(game.rating)}`}>★ {game.rating.toFixed(1)}</span>
          </div>
        )}
        
        {/* Hover Actions */}
        <div
          className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-2 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Link href={`/games/${game.game_id}`}>
            <Button variant="outline" size="sm" className="bg-slate-800/90 text-white border-slate-600 hover:bg-slate-700">
              View Details
            </Button>
          </Link>
          <div onClick={(e) => e.stopPropagation()} data-dialog-trigger="true">
            <GameRatingDialog
              gameId={game.game_id}
              gameName={gameName}
              gameImage={gameImage || undefined}
              gameReleased={gameReleased || undefined}
              gameRating={gameRating || undefined}
              triggerComponent={
                <Button variant="outline" size="sm" className="bg-purple-600/90 text-white border-purple-500 hover:bg-purple-700">
                  Edit
                </Button>
              }
            />
          </div>
        </div>
      </div>
      
      <CardContent className="p-3 flex flex-col flex-grow text-white">
        <h3 className="font-semibold text-base line-clamp-1 text-white">{gameName}</h3>
        
        <div className="mt-auto pt-2 flex items-center justify-between text-xs text-slate-400">
          <div>
            {gameReleased ? formatReleaseDate(gameReleased) : 'TBA'}
          </div>
          <div>
            Updated: {new Date(game.updated_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 