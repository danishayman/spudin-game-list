import { GameSearch } from '@/components/GameSearch';

export const metadata = {
  title: 'Discover Games - Spudin Game List',
  description: 'Search and discover new games to add to your collection',
};

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      {/* <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              Discover Your Next Gaming Adventure
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Search through thousands of games across all platforms. Find hidden gems, trending titles, and upcoming releases.
            </p>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 -mt-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Game Explorer</h2>
              <p className="text-gray-600 mt-1">
                Powered by RAWG video games database
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center text-sm">
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium">
                300,000+ Games
              </span>
              <span className="mx-2">•</span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                50+ Platforms
              </span>
            </div>
          </div>
          
          <GameSearch />
          
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Search Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium mb-2">Search by title</p>
                <p className="text-gray-600">Type the name of any game to find it quickly</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium mb-2">Filter by platform</p>
                <p className="text-gray-600">Narrow down results to your preferred gaming system</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium mb-2">Sort results</p>
                <p className="text-gray-600">Arrange games by relevance, name, rating or release date</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 