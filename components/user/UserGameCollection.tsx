'use client';

import { UserGameEntry } from '@/lib/actions/gameActions';
import { UserGameList } from './UserGameList';

interface UserGameCollectionProps {
  title?: string;
  description?: string;
  games: UserGameEntry[];
  isLoading?: boolean;
  error?: string | null;
  isOwnProfile?: boolean;
}

export function UserGameCollection({ 
  title, 
  description, 
  games, 
  isLoading = false, 
  error = null,
  isOwnProfile = false
}: UserGameCollectionProps) {
  return (
    <div className="w-full">
      {title && (
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
          {description && (
            <p className="text-slate-300 text-sm mt-1">{description}</p>
          )}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {error && (
        <div className="p-6 bg-red-900/30 border border-red-800 text-red-300 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd"></path>
          </svg>
          {error}
        </div>
      )}

      {!isLoading && !error && games.length === 0 && (
        <div className="p-6 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-lg font-medium">No games found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {!isLoading && !error && games.length > 0 && (
        <UserGameList games={games} isOwnProfile={isOwnProfile} />
      )}
    </div>
  );
} 
