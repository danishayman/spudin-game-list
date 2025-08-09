import { Suspense } from 'react';
import Link from 'next/link';
import { getUserGames, getUserGameCounts } from '@/lib/actions/gameActions';
import ClientTabsWrapper from '@/components/common/ClientTabsWrapper';

export const metadata = {
  title: 'My Games - Spudin Game List',
  description: 'Your personal game collection and tracking list',
};

export default async function MyGamesPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto py-3 sm:py-6 px-3 sm:px-4">
        <div className="bg-slate-800/50 text-white rounded-lg shadow-md p-3 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Games</h1>
          
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
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 mb-4 sm:mb-6 bg-slate-700 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-lg sm:text-xl font-semibold mb-2">Your game list is empty</h2>
      <p className="text-slate-400 mb-4 sm:mb-6 max-w-md px-4">
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
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="flex space-x-2 bg-slate-900 p-1 rounded-md overflow-x-auto w-full">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 sm:h-10 bg-slate-800 rounded-sm px-3 sm:px-4 animate-pulse flex-1"></div>
          ))}
        </div>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-3 sm:p-4 flex items-start animate-pulse">
            <div className="mr-2 sm:mr-4 w-4 sm:w-6"></div>
            <div className="h-20 w-20 sm:h-24 sm:w-24 bg-slate-700 rounded-md flex-shrink-0"></div>
            <div className="ml-3 sm:ml-4 flex-1">
              <div className="h-5 sm:h-6 bg-slate-700 rounded w-1/3 mb-2"></div>
              <div className="h-3 sm:h-4 bg-slate-700 rounded w-1/4 mb-2"></div>
              <div className="h-3 sm:h-4 bg-slate-700 rounded w-1/5"></div>
            </div>
            <div className="flex flex-col items-end">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-slate-700 rounded-full mb-2"></div>
              <div className="h-5 sm:h-6 w-16 sm:w-20 bg-slate-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
