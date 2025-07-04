'use client';

import { ReactNode } from 'react';
import { ViewModeProvider } from '@/lib/view-mode-context';
import { ViewToggle } from './ViewToggle';
import { GameCollection } from './GameCollection';

export function ViewModeClientWrapper({ children }: { children: ReactNode }) {
  return (
    <ViewModeProvider>
      {children}
    </ViewModeProvider>
  );
}

export function GameCollectionClient({ games }: { games: any[] }) {
  return <GameCollection games={games} />;
} 