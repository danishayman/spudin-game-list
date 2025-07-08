import { Suspense } from 'react';
import Link from 'next/link';
import { getUserGames, getUserGameCounts } from '@/lib/game-actions';
import ClientTabsWrapper from '@/components/ClientTabsWrapper';

export const metadata = {
  title: 'My Games - Spudin Game List',
  description: 'Your personal game collection and tracking list',
};

export default async function MyGamesPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto py-6 px-4">
        <div className="bg-slate-800/50 text-white rounded-lg shadow-md p-4 md:p-6">
          <h1 className="text-2xl font-bold mb-6">My Games</h1>
          
          <Suspense fallback={<GameListSkeleton />}>
            <GameListContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function GameListContent() {
  const gamesByStatus = await getUserGames();
  const counts = await getUserGameCounts();
  
  if (!gamesByStatus.All.length) {
    return <EmptyGameList />;
  }
  
  return (
    <ClientTabsWrapper 
      gamesByStatus={gamesByStatus}
      counts={counts}
    />
  );
}

function EmptyGameList() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 mb-6 bg-slate-700 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold mb-2">Your game list is empty</h2>
      <p className="text-slate-400 mb-6 max-w-md">
        Start building your game collection by adding games to your list.
      </p>
      <Link href="/games">
        <div className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
          Discover Games
        </div>
      </Link>
    </div>
  );
}

function GameListSkeleton() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2 bg-slate-900 p-1 rounded-md overflow-x-auto w-full">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-800 rounded-sm px-4 animate-pulse flex-1"></div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-4 flex items-start animate-pulse">
            <div className="mr-4 w-6"></div>
            <div className="h-24 w-24 bg-slate-700 rounded-md flex-shrink-0"></div>
            <div className="ml-4 flex-1">
              <div className="h-6 bg-slate-700 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-1/5"></div>
            </div>
            <div className="flex flex-col items-end">
              <div className="h-12 w-12 bg-slate-700 rounded-full mb-2"></div>
              <div className="h-6 w-20 bg-slate-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
