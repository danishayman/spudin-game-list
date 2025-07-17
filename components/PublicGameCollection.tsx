'use client';

import { useState } from 'react';
import { UserGameEntry, GamesByStatus } from '@/lib/game-actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { UserGameList } from './UserGameList';

interface PublicGameCollectionProps {
  gamesByStatus: GamesByStatus;
  isOwnProfile?: boolean;
}

export function PublicGameCollection({ gamesByStatus, isOwnProfile = false }: PublicGameCollectionProps) {
  const [activeTab, setActiveTab] = useState('all');
  
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
    <div className="bg-slate-700 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Game Collection</h2>
      
      {gamesByStatus.All?.length === 0 ? (
        <p className="text-slate-400">
          No games in collection yet.
        </p>
      ) : (
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6 bg-slate-600 border-slate-500">
            <TabsTrigger value="all" className="data-[state=active]:bg-slate-500 data-[state=active]:text-white text-slate-300">
              All ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="playing" className="data-[state=active]:bg-slate-500 data-[state=active]:text-white text-slate-300">
              Playing ({counts.playing})
            </TabsTrigger>
            <TabsTrigger value="finished" className="data-[state=active]:bg-slate-500 data-[state=active]:text-white text-slate-300">
              Finished ({counts.finished})
            </TabsTrigger>
            <TabsTrigger value="want" className="data-[state=active]:bg-slate-500 data-[state=active]:text-white text-slate-300">
              Want ({counts.want})
            </TabsTrigger>
            <TabsTrigger value="onhold" className="data-[state=active]:bg-slate-500 data-[state=active]:text-white text-slate-300">
              On-hold ({counts.onhold})
            </TabsTrigger>
            <TabsTrigger value="dropped" className="data-[state=active]:bg-slate-500 data-[state=active]:text-white text-slate-300">
              Dropped ({counts.dropped})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {gamesByStatus.All?.length > 0 ? (
              <UserGameList games={gamesByStatus.All} isOwnProfile={isOwnProfile} />
            ) : (
              <p className="text-slate-400">No games found.</p>
            )}
          </TabsContent>
          
          <TabsContent value="playing">
            {gamesByStatus.Playing?.length > 0 ? (
              <UserGameList games={gamesByStatus.Playing} isOwnProfile={isOwnProfile} />
            ) : (
              <p className="text-slate-400">No games currently being played.</p>
            )}
          </TabsContent>
          
          <TabsContent value="finished">
            {gamesByStatus.Finished?.length > 0 ? (
              <UserGameList games={gamesByStatus.Finished} isOwnProfile={isOwnProfile} />
            ) : (
              <p className="text-slate-400">No finished games.</p>
            )}
          </TabsContent>
          
          <TabsContent value="want">
            {gamesByStatus.Want?.length > 0 ? (
              <UserGameList games={gamesByStatus.Want} isOwnProfile={isOwnProfile} />
            ) : (
              <p className="text-slate-400">No games in want to play list.</p>
            )}
          </TabsContent>
          
          <TabsContent value="onhold">
            {gamesByStatus['On-hold']?.length > 0 ? (
              <UserGameList games={gamesByStatus['On-hold']} isOwnProfile={isOwnProfile} />
            ) : (
              <p className="text-slate-400">No games on hold.</p>
            )}
          </TabsContent>
          
          <TabsContent value="dropped">
            {gamesByStatus.Dropped?.length > 0 ? (
              <UserGameList games={gamesByStatus.Dropped} isOwnProfile={isOwnProfile} />
            ) : (
              <p className="text-slate-400">No dropped games.</p>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}