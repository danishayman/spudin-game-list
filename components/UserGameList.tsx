'use client';

import Image from 'next/image';
import Link from 'next/link';
import { UserGameEntry } from '@/lib/game-actions';
import { GameRatingDialog } from './GameRatingDialog';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

interface UserGameListProps {
  games: UserGameEntry[];
}

export function UserGameList({ games }: UserGameListProps) {
  const router = useRouter();
  
  // Log the games data to see what we're getting
  console.log('UserGameList games:', games);

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
              <div className="flex items-start p-4">
                <div className="mr-4 font-bold text-xl text-slate-400 mt-1">
                  {index + 1}
                </div>
                
                <div className="relative h-24 w-24 flex-shrink-0">
                  {gameImage ? (
                    <Image
                      src={gameImage}
                      alt={`${gameName} cover`}
                      fill
                      className="object-cover rounded-md"
                      sizes="96px"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-700 flex items-center justify-center rounded-md">
                      <span className="text-slate-400 text-xs">No image</span>
                    </div>
                  )}
                </div>
                
                <div className="ml-4 flex-1">
                  <h3 className="font-bold text-xl text-white">
                    <Link href={`/games/${game.game_id}`} className="hover:text-purple-400 transition-colors inline">
                      {gameName}
                    </Link>
                  </h3>
                  
                  <div className="text-sm text-slate-400 mt-1">
                    <div className="line-clamp-1">{gameGenres}</div>
                  </div>
                  
                  <div className="flex justify-between mt-1 text-sm text-slate-400">
                    <div>
                      {gameReleased ? formatReleaseDate(gameReleased) : 'TBA'}
                    </div>
                    <div>
                      {formatAddedDate(game.updated_at)}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end justify-between ml-4">
                  <div className="flex items-center">
                    {game.rating && game.rating > 0 ? (
                      <div className="text-center mr-2">
                        <div className="text-5xl font-bold text-cyan-400">
                          {formatRating(game.rating)}
                        </div>
                      </div>
                    ) : (
                      <div className="mr-2"></div>
                    )}
                    
                    <div>
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
                    </div>
                  </div>
                  
                  {game.status && (
                    <div className={`${statusInfo.color} rounded-md px-3 py-1 text-white text-sm mt-2`}>
                      {game.status}
                    </div>
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