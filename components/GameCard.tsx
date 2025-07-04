import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import type { RawgGame } from '@/lib/rawg';

type GameCardProps = {
  game: RawgGame;
  onClick?: () => void;
};

export function GameCard({ game, onClick }: GameCardProps) {
  // Get platform icons
  const getPlatformIcon = (slug: string) => {
    switch (slug) {
      case 'pc':
        return '🖥️';
      case 'playstation5':
      case 'playstation4':
      case 'playstation3':
      case 'playstation2':
      case 'playstation1':
        return '🎮';
      case 'xbox-series-x':
      case 'xbox-one':
      case 'xbox360':
      case 'xbox-old':
        return '🎮';
      case 'nintendo-switch':
        return '🎮';
      case 'ios':
      case 'android':
        return '📱';
      default:
        return '🎮';
    }
  };

  // Get rating color class
  const getRatingColorClass = (rating: number) => {
    if (rating >= 4) return 'text-green-500';
    if (rating >= 3) return 'text-yellow-500';
    return 'text-gray-500';
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
    ? [...new Set(game.platforms.map(p => p.platform.slug))]
      .slice(0, 3) // Limit to 3 platforms
    : [];

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
      onClick={onClick}
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
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        {game.metacritic && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-bold">
            {game.metacritic}
          </div>
        )}
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg line-clamp-1">{game.name}</h3>
        
        <div className="flex items-center gap-1 mt-2 mb-3">
          {uniquePlatforms.map((platform) => (
            <span 
              key={platform} 
              className="text-xs bg-gray-100 px-2 py-1 rounded-full"
              title={platform}
            >
              {getPlatformIcon(platform)}
            </span>
          ))}
          {game.platforms && game.platforms.length > 3 && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              +{game.platforms.length - 3}
            </span>
          )}
        </div>
        
        <div className="mt-auto pt-2 flex items-center justify-between text-sm">
          <div className="text-gray-600">
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