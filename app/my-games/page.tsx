import { Suspense } from 'react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getUserGames, getUserGameCounts, type UserGameEntry } from '@/lib/game-actions';
import { ViewModeClientWrapper } from '@/components/ViewModeClientWrapper';
import ClientTabsWrapper from '@/components/ClientTabsWrapper';

export const metadata = {
  title: 'My Games - Spudin Game List',
  description: 'Your personal game collection and tracking list',
};

export default async function MyGamesPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-slate-800 text-white rounded-lg shadow-md p-6 md:p-8 relative z-10">
          <h1 className="text-3xl font-bold mb-6">My Games</h1>
          
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
    <ViewModeClientWrapper>
      <ClientTabsWrapper 
        gamesByStatus={gamesByStatus}
        counts={counts}
      />
    </ViewModeClientWrapper>
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
        <div className="flex space-x-2 bg-slate-900 p-1 rounded-md overflow-x-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-800 rounded-sm px-4 animate-pulse"></div>
          ))}
        </div>
        <div className="hidden md:flex space-x-1 bg-slate-900 p-1 rounded-md">
          <div className="h-8 w-20 bg-slate-800 rounded-sm animate-pulse"></div>
          <div className="h-8 w-20 bg-slate-800 rounded-sm animate-pulse"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg overflow-hidden h-64 animate-pulse">
            <div className="h-40 bg-slate-700"></div>
            <div className="p-3">
              <div className="h-4 bg-slate-700 rounded mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
