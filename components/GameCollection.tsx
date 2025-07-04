'use client';

import { useState } from 'react';
import { UserGameCard } from './UserGameCard';
import { GameListHeader } from './GameListHeader';
import { useViewModeContext } from '@/lib/view-mode-context';
import type { UserGameEntry } from '@/lib/game-actions';

interface GameCollectionProps {
  games: UserGameEntry[];
}

export function GameCollection({ games }: GameCollectionProps) {
  const { viewMode } = useViewModeContext();
  
  if (!games.length) {
    return (
      <div className="p-8 text-center bg-slate-900/50 rounded-lg border border-slate-700">
        <p className="text-slate-400">No games in this category yet.</p>
      </div>
    );
  }
  
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {games.map((game) => (
          <GameListHeader key={game.game_id} game={game} />
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {games.map((game) => (
        <UserGameCard key={game.game_id} game={game} />
      ))}
    </div>
  );
} 