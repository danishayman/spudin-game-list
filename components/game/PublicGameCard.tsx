'use client';

import Image from 'next/image';
import Link from 'next/link';

interface PublicGameCardProps {
  game: {
    game_id: number;
    status: string | null;
    rating: number | null;
    updated_at: string;
    games: {
      id: number;
      name: string;
      background_image: string | null;
      released: string | null;
      rating: number | null;
    } | null;
  };
}

export function PublicGameCard({ game }: PublicGameCardProps) {
  const gameName = game.games?.name || 'Unknown Game';
  const gameImage = game.games?.background_image || null;
  const userRating = game.rating;
  const status = game.status;

  // Get status color
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'Finished':
        return 'bg-blue-500 text-white';
      case 'Playing':
        return 'bg-green-500 text-white';
      case 'Dropped':
        return 'bg-red-500 text-white';
      case 'Want':
        return 'bg-purple-500 text-white';
      case 'On-hold':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  // Format rating
  const formatRating = (rating: number) => {
    if (rating === 10) return "10";
    return rating.toFixed(1);
  };

  return (
    <Link href={`/games/${game.game_id}`}>
      <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group">
        {/* Game Image */}
        <div className="relative h-32 sm:h-40 w-full">
          {gameImage ? (
            <Image
              src={gameImage}
              alt={`${gameName} cover`}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="h-full w-full bg-slate-700 flex items-center justify-center">
              <span className="text-slate-400 text-xs">No image</span>
            </div>
          )}
          
          {/* Status overlay */}
          {status && (
            <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {status}
            </div>
          )}
          
          {/* Rating overlay */}
          {userRating && userRating > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
              <div className="flex items-center text-yellow-400 text-xs font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {formatRating(userRating)}
              </div>
            </div>
          )}
        </div>
        
        {/* Game Info */}
        <div className="p-3">
          <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1 group-hover:text-purple-400 transition-colors">
            {gameName}
          </h3>
          
          {/* Release year */}
          {game.games?.released && (
            <p className="text-slate-400 text-xs">
              {new Date(game.games.released).getFullYear()}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
