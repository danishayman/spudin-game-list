import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import GameDetails from './GameDetails';

export default async function GamePage({ params }: { params: { id: string } }) {
  // In server components, we can await params
  const id = await params.id;
  const gameId = parseInt(id, 10);
  
  if (isNaN(gameId)) {
    notFound();
  }
  
  return (
    <Suspense fallback={<GameLoading />}>
      <GameDetails gameId={gameId} />
    </Suspense>
  );
}

function GameLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="aspect-[3/4] w-full bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
        <div className="md:col-span-2">
          <div className="h-10 bg-gray-200 animate-pulse rounded mb-4"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded mb-6 w-1/3"></div>
          <div className="h-8 bg-gray-200 animate-pulse rounded mb-2"></div>
          <div className="flex gap-2 mb-6">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-16"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-16"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-16"></div>
          </div>
          <div className="h-8 bg-gray-200 animate-pulse rounded mb-2"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-24"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-24"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 