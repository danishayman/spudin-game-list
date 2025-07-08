import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import type { RawgGame } from '@/lib/rawg';
import { GameRatingDialog } from './GameRatingDialog';

type GameCardProps = {
  game: RawgGame;
  onClick?: () => void;
};

export function GameCard({ game, onClick }: GameCardProps) {
  // Get platform icons
  const getPlatformIcon = (platformName: string) => {
    const name = platformName.toLowerCase();
    if (name.includes('pc')) return '🖥️';
    if (name.includes('playstation')) return '🎮';
    if (name.includes('xbox')) return '🎮';
    if (name.includes('nintendo') || name.includes('switch')) return '🎮';
    if (name.includes('ios') || name.includes('android')) return '📱';
    return '🎮';
  };

  // Get rating color class
  const getRatingColorClass = (rating: number) => {
    if (rating >= 4) return 'text-green-400';
    if (rating >= 3) return 'text-yellow-400';
    return 'text-slate-400';
  };

  // Format release date
  const formatReleaseDate = (date: string | null) => {
    if (!date) return 'TBA';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get unique platforms (to avoid duplicates)
  const uniquePlatforms = game.platforms 
    ? [...new Set(game.platforms.map(p => p.platform.name))]
      .slice(0, 3) // Limit to 3 platforms
    : [];

  // Handle card click but prevent propagation when clicking on the dialog trigger
  const handleCardClick = (e: React.MouseEvent) => {
    // Only call the onClick handler if it exists and the click wasn't on the add list button
    if (onClick && !(e.target as HTMLElement).closest('[data-dialog-trigger="true"]')) {
      onClick();
    }
  };

  // Add to list button (used in dialog trigger)
  const addToListButton = (
    <Button
      variant="ghost"
      className="absolute bottom-3 right-3 bg-black/80 hover:bg-purple-600 text-white text-xs py-1.5 px-3 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 shadow-md hover:shadow-purple-500/40 hover:translate-y-[-2px]"
      data-dialog-trigger="true"
      onClick={(e) => e.stopPropagation()}
    >
      + Add to List
    </Button>
  );

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col bg-slate-800 border-slate-700 group relative"
      onClick={handleCardClick}
    >
      <div className="relative h-48 w-full">
        {game.background_image ? (
          <Image
            src={game.background_image}
            alt={`${game.name} cover`}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-slate-700 flex items-center justify-center">
            <span className="text-slate-400">No image</span>
          </div>
        )}
        {game.metacritic && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-bold">
            {game.metacritic}
          </div>
        )}
        <div data-dialog-trigger="true" onClick={(e) => e.stopPropagation()}>
          <GameRatingDialog
            gameId={game.id}
            gameName={game.name}
            gameImage={game.background_image || undefined}
            gameReleased={game.released || undefined}
            gameRating={game.rating || undefined}
            triggerComponent={addToListButton}
          />
        </div>
      </div>
      <CardContent className="p-4 flex flex-col flex-grow text-white">
        <h3 className="font-semibold text-lg line-clamp-1 text-white">{game.name}</h3>
        
        <div className="flex items-center gap-1 mt-2 mb-3">
          {uniquePlatforms.map((platform) => (
            <span 
              key={platform} 
              className="text-xs bg-slate-700 px-2 py-1 rounded-full"
              title={platform}
            >
              {getPlatformIcon(platform)}
            </span>
          ))}
          {game.platforms && game.platforms.length > 3 && (
            <span className="text-xs bg-slate-700 px-2 py-1 rounded-full">
              +{game.platforms.length - 3}
            </span>
          )}
        </div>
        
        <div className="mt-auto pt-2 flex items-center justify-between text-sm">
          <div className="text-slate-300">
            {formatReleaseDate(game.released)}
          </div>
          <div className={`flex items-center font-medium ${getRatingColorClass(game.rating)}`}>
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            {game.rating.toFixed(1)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 