'use client';

import { ReactNode } from 'react';
import { ViewModeProvider } from '@/lib/view-mode-context';
import { GameCollection } from './GameCollection';
import type { UserGameEntry } from '@/lib/game-actions';

export function ViewModeClientWrapper({ children }: { children: ReactNode }) {
  return (
    <ViewModeProvider>
      {children}
    </ViewModeProvider>
  );
}

export function GameCollectionClient({ games }: { games: UserGameEntry[] }) {
  return <GameCollection games={games} />;
} 