'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { UserGameCollection } from './UserGameCollection';
import type { GamesByStatus } from '@/lib/game-actions';

interface ClientTabsWrapperProps {
  gamesByStatus: GamesByStatus;
  counts: Record<string, number> | null;
}

export default function ClientTabsWrapper({ gamesByStatus, counts }: ClientTabsWrapperProps) {
  return (
    <Tabs defaultValue="All" className="w-full">
      <div className="mb-6">
        <TabsList className="bg-slate-900 p-1 overflow-x-auto flex w-full">
          <TabsTrigger value="All" className="flex-1">
            All Games {counts?.All ? `(${counts.All})` : ''}
          </TabsTrigger>
          <TabsTrigger value="Playing" className="flex-1">
            Playing {counts?.Playing ? `(${counts.Playing})` : ''}
          </TabsTrigger>
          <TabsTrigger value="Finished" className="flex-1">
            Finished {counts?.Finished ? `(${counts.Finished})` : ''}
          </TabsTrigger>
          <TabsTrigger value="Want" className="flex-1">
            Want to Play {counts?.Want ? `(${counts.Want})` : ''}
          </TabsTrigger>
          <TabsTrigger value="On-hold" className="flex-1">
            On Hold {counts?.['On-hold'] ? `(${counts['On-hold']})` : ''}
          </TabsTrigger>
          <TabsTrigger value="Dropped" className="flex-1">
            Dropped {counts?.Dropped ? `(${counts.Dropped})` : ''}
          </TabsTrigger>
        </TabsList>
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