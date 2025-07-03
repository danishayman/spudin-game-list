import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import type { RawgGame } from '@/lib/rawg';

type GameCardProps = {
  game: RawgGame;
  onClick?: () => void;
};

export function GameCard({ game, onClick }: GameCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="relative h-40 w-full">
        {game.background_image ? (
          <Image
            src={game.background_image}
            alt={`${game.name} cover`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{game.name}</h3>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
          <span>{game.released ? new Date(game.released).getFullYear() : 'N/A'}</span>
          <div className="flex items-center">
            <span>⭐ {game.rating.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 