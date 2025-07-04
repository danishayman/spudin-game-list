'use client';

import { useViewModeContext } from '@/lib/view-mode-context';

export function ViewToggle() {
  const { viewMode, setViewMode } = useViewModeContext();
  
  return (
    <div className="flex bg-slate-900 rounded-md p-1">
      <button
        onClick={() => setViewMode('grid')}
        className={`px-3 py-1 rounded-sm text-sm flex items-center ${
          viewMode === 'grid' 
            ? 'bg-slate-700 text-white' 
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Grid
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`px-3 py-1 rounded-sm text-sm flex items-center ${
          viewMode === 'list' 
            ? 'bg-slate-700 text-white' 
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        List
      </button>
    </div>
  );
} 