'use client';

import { GamesByStatus } from '@/lib/actions/gameActions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { UserGameList } from '../user/UserGameList';

interface PublicGameCollectionProps {
  gamesByStatus: GamesByStatus;
  isOwnProfile?: boolean;
}

export function PublicGameCollection({ gamesByStatus, isOwnProfile = false }: PublicGameCollectionProps) {
  // Get counts for each status
  const counts = {
    all: gamesByStatus.All?.length || 0,
    playing: gamesByStatus.Playing?.length || 0,
    finished: gamesByStatus.Finished?.length || 0,
    want: gamesByStatus.Want?.length || 0,
    onhold: gamesByStatus['On-hold']?.length || 0,
    dropped: gamesByStatus.Dropped?.length || 0
  };
  
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-lg border border-slate-600/50 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Game Collection</h2>
          {counts.all > 0 && (
            <div className="ml-auto px-3 py-1 bg-slate-600 rounded-full text-sm text-slate-300">
              {counts.all} {counts.all === 1 ? 'game' : 'games'}
            </div>
          )}
        </div>
        
        {gamesByStatus.All?.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-slate-300 text-lg font-medium">No games in collection yet</p>
            <p className="text-slate-400 text-sm mt-1">Start building your gaming library!</p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            {/* Mobile: Horizontal scrollable tabs */}
            <div className="md:hidden mb-6">
              <div className="overflow-x-auto scrollbar-hide">
                <TabsList className="flex w-max min-w-full bg-slate-700/50 border border-slate-600/50 rounded-lg p-1 gap-1">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-white transition-all duration-200 rounded-md whitespace-nowrap px-3 py-2 text-sm"
                  >
                    All ({counts.all})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="playing" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-white transition-all duration-200 rounded-md whitespace-nowrap px-3 py-2 text-sm"
                  >
                    Playing ({counts.playing})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="finished" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-white transition-all duration-200 rounded-md whitespace-nowrap px-3 py-2 text-sm"
                  >
                    Finished ({counts.finished})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="want" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-white transition-all duration-200 rounded-md whitespace-nowrap px-3 py-2 text-sm"
                  >
                    Want ({counts.want})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="onhold" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-white transition-all duration-200 rounded-md whitespace-nowrap px-3 py-2 text-sm"
                  >
                    On-hold ({counts.onhold})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="dropped" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-white transition-all duration-200 rounded-md whitespace-nowrap px-3 py-2 text-sm"
                  >
                    Dropped ({counts.dropped})
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Desktop: Grid layout */}
            <div className="hidden md:block mb-6">
              <TabsList className="grid grid-cols-6 bg-slate-700/50 border border-slate-600/50 rounded-lg p-1">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-white transition-all duration-200 rounded-md"
                >
                  All ({counts.all})
                </TabsTrigger>
                <TabsTrigger 
                  value="playing" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-white transition-all duration-200 rounded-md"
                >
                  Playing ({counts.playing})
                </TabsTrigger>
                <TabsTrigger 
                  value="finished" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-white transition-all duration-200 rounded-md"
                >
                  Finished ({counts.finished})
                </TabsTrigger>
                <TabsTrigger 
                  value="want" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-white transition-all duration-200 rounded-md"
                >
                  Want ({counts.want})
                </TabsTrigger>
                <TabsTrigger 
                  value="onhold" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-white transition-all duration-200 rounded-md"
                >
                  On-hold ({counts.onhold})
                </TabsTrigger>
                <TabsTrigger 
                  value="dropped" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-white transition-all duration-200 rounded-md"
                >
                  Dropped ({counts.dropped})
                </TabsTrigger>
              </TabsList>
            </div>
          
            <TabsContent value="all" className="mt-6">
              {gamesByStatus.All?.length > 0 ? (
                <UserGameList games={gamesByStatus.All} isOwnProfile={isOwnProfile} />
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-slate-600/50 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-400">No games found</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="playing" className="mt-6">
              {gamesByStatus.Playing?.length > 0 ? (
                <UserGameList games={gamesByStatus.Playing} isOwnProfile={isOwnProfile} />
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-400">No games currently being played</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="finished" className="mt-6">
              {gamesByStatus.Finished?.length > 0 ? (
                <UserGameList games={gamesByStatus.Finished} isOwnProfile={isOwnProfile} />
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-400">No finished games</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="want" className="mt-6">
              {gamesByStatus.Want?.length > 0 ? (
                <UserGameList games={gamesByStatus.Want} isOwnProfile={isOwnProfile} />
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-400">No games in want to play list</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="onhold" className="mt-6">
              {gamesByStatus['On-hold']?.length > 0 ? (
                <UserGameList games={gamesByStatus['On-hold']} isOwnProfile={isOwnProfile} />
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-amber-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-400">No games on hold</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="dropped" className="mt-6">
              {gamesByStatus.Dropped?.length > 0 ? (
                <UserGameList games={gamesByStatus.Dropped} isOwnProfile={isOwnProfile} />
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <p className="text-slate-400">No dropped games</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}