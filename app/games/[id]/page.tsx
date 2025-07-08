import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import GameDetails from './GameDetails';
import GameLoading from './loading';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id;
  
  return {
    title: `Game Details - Spudin Game List`,
    description: 'View detailed information about this game including ratings, screenshots, videos, and more.'
  };
}

export default async function GamePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const gameId = parseInt(id, 10);
  
  if (isNaN(gameId)) {
    notFound();
  }
  
  return (
    <div className="relative">
      {/* Server-side rendered skeleton UI */}
      <GameLoading />
      
      {/* Client-side game details that will replace the skeleton */}
      <Suspense fallback={null}>
        <GameDetails gameId={gameId} />
      </Suspense>
    </div>
  );
} 