'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { UserGameCollection } from './UserGameCollection';
import { ViewToggle } from './ViewToggle';
import type { GamesByStatus } from '@/lib/game-actions';

interface ClientTabsWrapperProps {
  gamesByStatus: GamesByStatus;
  counts: Record<string, number> | null;
}

export default function ClientTabsWrapper({ gamesByStatus, counts }: ClientTabsWrapperProps) {
  return (
    <Tabs defaultValue="All">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <TabsList className="flex justify-start mb-4 md:mb-0 bg-slate-900 p-1">
          <TabsTrigger value="All" badgeCount={counts?.All || gamesByStatus.All.length}>
            All Games
          </TabsTrigger>
          <TabsTrigger value="Playing" badgeCount={counts?.Playing || gamesByStatus.Playing.length}>
            Playing
          </TabsTrigger>
          <TabsTrigger value="Finished" badgeCount={counts?.Finished || gamesByStatus.Finished.length}>
            Finished
          </TabsTrigger>
          <TabsTrigger value="Want" badgeCount={counts?.Want || gamesByStatus.Want.length}>
            Want to Play
          </TabsTrigger>
          <TabsTrigger value="On-hold" badgeCount={counts?.['On-hold'] || gamesByStatus['On-hold'].length}>
            On Hold
          </TabsTrigger>
          <TabsTrigger value="Dropped" badgeCount={counts?.Dropped || gamesByStatus.Dropped.length}>
            Dropped
          </TabsTrigger>
        </TabsList>
        
        <ViewToggle />
      </div>

      <TabsContent value="All">
        <UserGameCollection games={gamesByStatus.All} />
      </TabsContent>
      <TabsContent value="Playing">
        <UserGameCollection games={gamesByStatus.Playing} />
      </TabsContent>
      <TabsContent value="Finished">
        <UserGameCollection games={gamesByStatus.Finished} />
      </TabsContent>
      <TabsContent value="Want">
        <UserGameCollection games={gamesByStatus.Want} />
      </TabsContent>
      <TabsContent value="On-hold">
        <UserGameCollection games={gamesByStatus['On-hold']} />
      </TabsContent>
      <TabsContent value="Dropped">
        <UserGameCollection games={gamesByStatus.Dropped} />
      </TabsContent>
    </Tabs>
  );
} 