import { GameSearch } from '@/components/GameSearch';

export const metadata = {
  title: 'Discover Games - Spudin Game List',
  description: 'Search and discover new games to add to your collection',
};

export default function GamesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Discover Games</h1>
      <p className="text-gray-600 mb-8">
        Search for games to add to your collection. Powered by RAWG video games database.
      </p>
      
      <GameSearch />
    </div>
  );
} 