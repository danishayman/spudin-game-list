'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { type RawgGame } from '@/lib/rawg';
import { getGameByIdClient } from '@/lib/games-client';
import { GameRatingDialog } from '@/components/GameRatingDialog';

interface GameDetailsProps {
  gameId: number;
}

// Define a specific type for screenshots to ensure they have string images
interface Screenshot {
  id: number;
  image: string; // Ensuring this is a string, not null
}

// Define a type for game series
interface GameSeries {
  id: number;
  name: string;
  background_image: string | null;
  released?: string;
}

// Define a type for game videos
interface GameVideo {
  id: number;
  name: string;
  preview: string;
  data: {
    480: string;
    max: string;
  };
}

export default function GameDetails({ gameId }: GameDetailsProps) {
  const [game, setGame] = useState<RawgGame | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeScreenshotIndex, setActiveScreenshotIndex] = useState(0);
  const [showAllScreenshots, setShowAllScreenshots] = useState(false);
  const [gameSeries, setGameSeries] = useState<GameSeries[]>([]);
  const [gameVideos, setGameVideos] = useState<GameVideo[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Hide the skeleton UI when game data is loaded
  useEffect(() => {
    if (!isLoading && game) {
      // Short delay to ensure smooth transition
      const timer = setTimeout(() => {
        // Find and hide the skeleton UI
        const skeletonUI = document.querySelector('[data-skeleton="true"]');
        if (skeletonUI) {
          (skeletonUI as HTMLElement).style.display = 'none';
        }
        setIsVisible(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, game]);

  useEffect(() => {
    async function fetchGame() {
      try {
        const gameData = await getGameByIdClient(gameId);
        setGame(gameData);
        
        // Dynamically update the document title
        if (gameData?.name) {
          document.title = `${gameData.name} - Spudin Game List`;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load game details');
      } finally {
        setIsLoading(false);
      }
    }

    fetchGame();
  }, [gameId]);

  // Fetch game series data
  useEffect(() => {
    async function fetchGameSeries() {
      if (!game) return;
      
      try {
        const response = await fetch(`/api/games/${gameId}/series`);
        if (!response.ok) throw new Error('Failed to fetch game series');
        
        const data = await response.json();
        if (data.results && Array.isArray(data.results)) {
          setGameSeries(data.results);
        }
      } catch (err) {
        console.error('Error fetching game series:', err);
      }
    }

    if (game) {
      fetchGameSeries();
    }
  }, [game, gameId]);

  // Fetch game videos
  useEffect(() => {
    async function fetchGameVideos() {
      if (!game) return;
      
      try {
        const response = await fetch(`/api/games/${gameId}/videos`);
        if (!response.ok) throw new Error('Failed to fetch game videos');
        
        const data = await response.json();
        if (data.results && Array.isArray(data.results)) {
          setGameVideos(data.results);
        }
      } catch (err) {
        console.error('Error fetching game videos:', err);
      }
    }

    if (game) {
      fetchGameVideos();
    }
  }, [game, gameId]);

  // If we're still loading, return null
  if (isLoading) {
    return null;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="p-4 bg-red-900/30 border border-red-800 text-red-300 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto py-8">
        <div className="p-4 bg-amber-900/30 border border-amber-800 text-amber-300 rounded-md">
          Game not found
        </div>
      </div>
    );
  }

  // Function to determine metacritic color
  const getMetacriticColorClass = (score: number) => {
    if (score >= 75) return 'bg-green-700 text-green-100';
    if (score >= 50) return 'bg-yellow-600 text-yellow-100';
    return 'bg-red-700 text-red-100';
  };

  // Get all screenshots including the main background image, with proper typing
  const allScreenshots: Screenshot[] = [
    ...(game.background_image ? [{ id: 0, image: game.background_image }] : []),
    ...(game.background_image_additional ? [{ id: -1, image: game.background_image_additional }] : []),
    ...(game.screenshots?.filter(s => s.image != null).map(s => ({ id: s.id, image: s.image as string })) || [])
  ];

  // Get the current active screenshot
  const activeScreenshot = allScreenshots[activeScreenshotIndex]?.image || '';

  return (
    <div className="container mx-auto py-8 text-white" style={{
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.3s ease-in'
    }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Game Image and Screenshots */}
        <div className="md:col-span-1">
          {/* Main Game Image */}
          {allScreenshots.length > 0 && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md mb-4">
              <Image
                src={activeScreenshot}
                alt={`${game.name} screenshot`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
          )}
          
          {/* Thumbnail Screenshots */}
          {allScreenshots.length > 1 && (
            <div className="mb-6">
              <div className="grid grid-cols-4 gap-2">
                {allScreenshots.slice(0, showAllScreenshots ? allScreenshots.length : 4).map((screenshot, index) => (
                  <button
                    key={screenshot.id || index}
                    onClick={() => setActiveScreenshotIndex(index)}
                    className={`relative aspect-video w-full overflow-hidden rounded-md ${
                      index === activeScreenshotIndex ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <Image
                      src={screenshot.image}
                      alt={`${game.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 8vw"
                    />
                  </button>
                ))}
              </div>
              {allScreenshots.length > 4 && (
                <button 
                  onClick={() => setShowAllScreenshots(!showAllScreenshots)}
                  className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                >
                  {showAllScreenshots ? 'Show less' : `Show all ${allScreenshots.length} screenshots`}
                </button>
              )}
            </div>
          )}
          
          {/* Game Rating Dialog */}
          <div className="mb-6">
            <GameRatingDialog 
              gameId={game.id} 
              gameName={game.name} 
              gameImage={game.background_image || undefined}
              gameReleased={game.released || undefined}
              gameRating={game.rating || undefined}
            />
          </div>

          {/* Where to Buy */}
          {game.stores && game.stores.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3 text-white">Where to Buy</h2>
              <div className="grid grid-cols-2 gap-2">
                {game.stores.map(({ store }) => (
                  <a
                    key={store.id}
                    href={`https://${store.domain || `${store.slug}.com`}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-sm text-center transition"
                  >
                    {store.name}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Game Series */}
          {gameSeries && gameSeries.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3 text-white">Games in the Series</h2>
              <div className="space-y-3">
                {gameSeries.map((seriesGame) => (
                  <a 
                    key={seriesGame.id}
                    href={`/games/${seriesGame.id}`}
                    className="flex items-center p-2 bg-slate-800 hover:bg-slate-700 rounded-md transition"
                  >
                    {seriesGame.background_image ? (
                      <div className="relative w-12 h-12 mr-3 rounded overflow-hidden">
                        <Image
                          src={seriesGame.background_image}
                          alt={seriesGame.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 mr-3 bg-slate-700 rounded flex items-center justify-center">
                        <span className="text-xs text-slate-400">No img</span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{seriesGame.name}</p>
                      {seriesGame.released && (
                        <p className="text-xs text-slate-400">
                          {new Date(seriesGame.released).getFullYear()}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Game Details */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4 text-white">{game.name}</h1>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">⭐</span>
              <span className="font-semibold">{game.rating.toFixed(1)}</span>
            </div>
            
            {game.metacritic && (
              <div className={`px-2 py-1 rounded-md text-sm font-medium ${getMetacriticColorClass(game.metacritic)}`}>
                Metacritic: {game.metacritic}
              </div>
            )}
            
            {game.released && (
              <div className="text-slate-300">
                Released: {new Date(game.released).toLocaleDateString()}
              </div>
            )}
            
            {game.playtime && game.playtime > 0 && (
              <div className="text-slate-300">
                Average playtime: {game.playtime} hours
              </div>
            )}
            
            {game.esrb_rating && (
              <div className="px-2 py-1 bg-slate-700 text-slate-200 rounded-md text-sm">
                {game.esrb_rating.name}
              </div>
            )}
          </div>

          {/* Description */}
          {game.description_raw && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-white">About</h2>
              <div className="text-slate-300 space-y-2">
                {game.description_raw.length > 500 ? (
                  <>
                    {game.description_raw.substring(0, 500)}...
                    <div className="mt-2">
                      <button 
                        onClick={() => window.open(`https://rawg.io/games/${game.id}`, '_blank')}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Read more on RAWG
                      </button>
                    </div>
                  </>
                ) : (
                  game.description_raw
                )}
              </div>
            </div>
          )}
          
          {/* Website and Links Section */}
          <div className="mb-6 flex flex-wrap gap-3">
            {game.website && (
              <a
                href={game.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Official Website
              </a>
            )}
            
            {game.metacritic_url && (
              <a
                href={game.metacritic_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Metacritic
              </a>
            )}
            
            {game.reddit_url && (
              <a
                href={game.reddit_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
                Reddit
              </a>
            )}
          </div>
          
          {/* Developers & Publishers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {game.developers && game.developers.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2 text-white">Developers</h2>
                <div className="space-y-2">
                  {game.developers.map(developer => (
                    <div key={developer.id} className="px-3 py-2 bg-slate-700 text-slate-200 rounded-md">
                      {developer.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {game.publishers && game.publishers.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2 text-white">Publishers</h2>
                <div className="space-y-2">
                  {game.publishers.map(publisher => (
                    <div key={publisher.id} className="px-3 py-2 bg-slate-700 text-slate-200 rounded-md">
                      {publisher.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Genres */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-white">Genres</h2>
            <div className="flex flex-wrap gap-2">
              {game.genres?.map((genre) => (
                <span 
                  key={genre.id}
                  className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
          
          {/* Platforms */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-white">Platforms</h2>
            <div className="flex flex-wrap gap-2">
              {game.platforms?.map((platform) => (
                <span 
                  key={platform.platform.id}
                  className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm"
                >
                  {platform.platform.name}
                </span>
              ))}
            </div>
          </div>
          
          {/* Tags */}
          {game.tags && game.tags.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-white">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {game.tags.map(tag => (
                  <span 
                    key={tag.id}
                    className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Game Videos */}
          {gameVideos && gameVideos.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3 text-white">Videos</h2>
              <div className="space-y-6">
                {gameVideos.slice(0, 2).map((video) => (
                  <div key={video.id} className="bg-slate-800 rounded-lg overflow-hidden">
                    <div className="relative aspect-video w-full">
                      <iframe
                        src={video.data.max}
                        title={video.name}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium">{video.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Reddit Information */}
      {game.reddit_name && (
        <div className="mt-8 p-6 bg-slate-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
            </svg>
            Reddit: r/{game.reddit_name}
          </h2>
          {game.reddit_description && (
            <p className="text-slate-300 mb-4">{game.reddit_description}</p>
          )}
          <a
            href={game.reddit_url || `https://www.reddit.com/r/${game.reddit_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-orange-700 hover:bg-orange-600 text-white rounded-md transition"
          >
            Visit Subreddit
          </a>
        </div>
      )}
      
      {/* Data Attribution */}
      <div className="mt-8 text-center text-slate-400 text-sm">
        Game data provided by{' '}
        <a
          href="https://rawg.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          RAWG.io
        </a>
      </div>
    </div>
  );
}