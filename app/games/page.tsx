'use client';

import { useState, useEffect } from 'react';
import { GameExplorerHero } from '@/components/GameExplorerHero';
import { GameCollection } from '@/components/GameCollection';
import { getTrendingGamesClient, getNewReleasesClient } from '@/lib/games-client';
import { IgdbGame} from '@/lib/igdb';

export default function GamesPage() {
  const [trendingGames, setTrendingGames] = useState<IgdbGame[]>([]);
  const [newReleases, setNewReleases] = useState<IgdbGame[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [isLoadingNewReleases, setIsLoadingNewReleases] = useState(true);
  const [trendingError, setTrendingError] = useState<string | null>(null);
  const [newReleasesError, setNewReleasesError] = useState<string | null>(null);

  // Fetch trending games
  useEffect(() => {
    async function fetchTrendingGames() {
      try {
        const data = await getTrendingGamesClient();
        setTrendingGames(data.results || []);
      } catch (error) {
        setTrendingError(error instanceof Error ? error.message : 'Failed to fetch trending games');
      } finally {
        setIsLoadingTrending(false);
      }
    }

    fetchTrendingGames();
  }, []);

  // Fetch new releases
  useEffect(() => {
    async function fetchNewReleases() {
      try {
        const data = await getNewReleasesClient(8);
        setNewReleases(data.results || []);
      } catch (error) {
        setNewReleasesError(error instanceof Error ? error.message : 'Failed to fetch new releases');
      } finally {
        setIsLoadingNewReleases(false);
      }
    }

    fetchNewReleases();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <GameExplorerHero />
      
      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        {/* Trending Games */}
        <div className="mb-12">
          <GameCollection 
            title="Trending Games" 
            description="Popular games that players are enjoying right now" 
            games={trendingGames}
            isLoading={isLoadingTrending}
            error={trendingError}
          />
        </div>
        
        {/* New Releases */}
        <div className="mb-12">
          <GameCollection 
            title="New Releases" 
            description="The latest games to hit the market" 
            games={newReleases}
            isLoading={isLoadingNewReleases}
            error={newReleasesError}
          />
        </div>
        
        
        {/* Gaming Tips */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <h3 className="text-lg font-medium text-slate-200 mb-4">Game Explorer Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="font-medium mb-2 text-purple-300">Search by title</p>
              <p className="text-slate-300">Type the name of any game to find it quickly</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="font-medium mb-2 text-purple-300">Filter by platform</p>
              <p className="text-slate-300">Narrow down results to your preferred gaming system</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="font-medium mb-2 text-purple-300">Sort results</p>
              <p className="text-slate-300">Arrange games by relevance, name, rating or release date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 