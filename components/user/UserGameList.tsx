'use client';

import Image from 'next/image';
import Link from 'next/link';
import { UserGameEntry } from '@/lib/actions/gameActions';
import { GameRatingDialog } from '../game/GameRatingDialog';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface UserGameListProps {
  games: UserGameEntry[];
  isOwnProfile?: boolean;
}

export function UserGameList({ games, isOwnProfile = false }: UserGameListProps) {
  const router = useRouter();
  
  // Format release date
  const formatReleaseDate = (date: string | null) => {
    if (!date) return 'TBA';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format added date
  const formatAddedDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format rating to show one decimal point except for 10
  const formatRating = (rating: number) => {
    if (rating === 10) return "10";
    return rating.toFixed(1);
  };

  // Handle game update
  const handleGameUpdate = () => {
    // Refresh the page data
    router.refresh();
  };

  // Get status color and icon
  const getStatusInfo = (status: string | null) => {
    switch (status) {
      case 'Finished':
        return { 
          color: 'bg-blue-500', 
          textColor: 'text-blue-100',
          hoverColor: 'hover:bg-blue-700'
        };
      case 'Playing':
        return { 
          color: 'bg-green-600', 
          textColor: 'text-green-100',
          hoverColor: 'hover:bg-green-700'
        };
      case 'Dropped':
        return { 
          color: 'bg-red-600', 
          textColor: 'text-red-100',
          hoverColor: 'hover:bg-red-700'
        };
      case 'Want':
        return { 
          color: 'bg-purple-600', 
          textColor: 'text-purple-100',
          hoverColor: 'hover:bg-purple-700'
        };
      case 'On-hold':
        return { 
          color: 'bg-amber-600', 
          textColor: 'text-amber-100',
          hoverColor: 'hover:bg-amber-700'
        };
      default:
        return { 
          color: 'bg-slate-600', 
          textColor: 'text-slate-100',
          hoverColor: 'hover:bg-slate-700'
        };
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-4">
        {games.map((game, index) => {
          const statusInfo = getStatusInfo(game.status);
          const gameName = game.games?.name || 'Unknown Game';
          const gameImage = game.games?.background_image || null;
          const gameReleased = game.games?.released || null;
          
          // Safely handle genres if they exist
          console.log(`Game ${gameName} data:`, game);
          console.log(`Game ${gameName} genres:`, game.games?.genres);
          
          // Hardcoded genres for testing
          const gameGenres = "Action, Adventure, RPG";
          
          console.log(`Game ${gameName} formatted genres:`, gameGenres);
          
          return (
            <div key={game.game_id} className="bg-slate-800 rounded-lg shadow-md relative">
              <div className="flex flex-col sm:flex-row items-start p-3 sm:p-4">
                {/* Game number - hidden on smallest screens */}
                <div className="hidden sm:block mr-2 sm:mr-4 font-bold text-xl text-slate-400 mt-1">
                  {index + 1}
                </div>
                
                {/* Game image */}
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-md overflow-hidden">
                  {gameImage ? (
                    <Image
                      src={gameImage}
                      alt={`${gameName} cover`}
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 640px) 80px, 96px"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-700 flex items-center justify-center rounded-md">
                      <span className="text-slate-400 text-xs">No image</span>
                    </div>
                  )}
                </div>
                
                {/* Game details */}
                <div className="ml-3 sm:ml-4 flex-1">
                  {/* Mobile-visible index */}
                  <div className="flex items-center justify-between sm:hidden mb-1">
                    <span className="font-bold text-lg text-slate-400">{index + 1}</span>
                    {game.status && (
                      <div className={`${statusInfo.color} rounded-full px-2 py-0.5 text-white text-xs`}>
                        {game.status}
                      </div>
                    )}
                  </div>
                  
                  {/* Game title */}
                  <h3 className="font-bold text-lg sm:text-xl text-white">
                    <Link href={`/games/${game.game_id}`} className="hover:text-purple-400 transition-colors inline">
                      {gameName}
                    </Link>
                  </h3>
                  
                  {/* Genres */}
                  <div className="text-sm text-slate-400 mt-1">
                    <div className="line-clamp-1">{gameGenres}</div>
                  </div>
                  
                  {/* Release and added dates */}
                  <div className="flex flex-col sm:flex-row sm:justify-between mt-1 text-xs sm:text-sm text-slate-400">
                    <div className="mb-1 sm:mb-0">
                      {gameReleased ? formatReleaseDate(gameReleased) : 'TBA'}
                    </div>
                    <div>
                      Added: {formatAddedDate(game.updated_at)}
                    </div>
                  </div>
                </div>
                
                {/* Rating and status */}
                <div className="flex flex-row sm:flex-col items-center justify-between w-full sm:w-auto sm:items-end sm:ml-4 mt-2 sm:mt-0">
                  <div className="flex items-center">
                    {/* Status badge - visible only on larger screens */}
                    <div className="hidden sm:block">
                      {game.status && (
                        <div className={`${statusInfo.color} rounded-full px-3 py-1 text-white text-sm flex items-center mr-3`}>
                          {game.status}
                          {game.status === 'Finished' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Rating */}
                    <div className="flex flex-col items-center">
                      {game.rating && game.rating > 0 ? (
                        <div className="text-4xl sm:text-5xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                          {formatRating(game.rating)}
                        </div>
                      ) : (
                        <div className="text-4xl sm:text-5xl font-bold text-slate-500">—</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Edit button - only show for own profile */}
                  {isOwnProfile && (
                    <GameRatingDialog
                      gameId={game.game_id}
                      gameName={gameName}
                      gameImage={gameImage || undefined}
                      gameReleased={gameReleased || undefined}
                      gameRating={game.games?.rating || undefined}
                      onUpdate={handleGameUpdate}
                      triggerComponent={
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500 hover:text-cyan-400 transition-all rounded-full w-8 h-8"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </Button>
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 