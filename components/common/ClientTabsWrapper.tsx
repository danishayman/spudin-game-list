'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { UserGameCollection } from '../user/UserGameCollection';
import type { GamesByStatus } from '@/lib/actions/gameActions';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface ClientTabsWrapperProps {
  gamesByStatus: GamesByStatus;
  counts: Record<string, number> | null;
}

type SortOption = 'name_asc' | 'name_desc' | 'rating_desc' | 'rating_asc' | 'date_desc' | 'date_asc' | '';

/**
 * Displays a tabbed interface for browsing and managing a user's game collection by status, with search, sorting, and a roadmap view for upcoming and released games in the "Want" category.
 *
 * Provides filtering by search query, sorting by name, rating, or date, and a toggleable roadmap view that splits "Want" games into released and upcoming sections based on release dates. Each tab shows the filtered and sorted games for its status, and the "Want" tab allows switching between standard and roadmap views.
 *
 * @param gamesByStatus - An object containing arrays of games grouped by their status.
 * @param counts - Optional object with counts of games per status.
 * @returns A React component rendering the tabbed game collection interface.
 */
export default function ClientTabsWrapper({ gamesByStatus, counts }: ClientTabsWrapperProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);

  // Helper function to validate and parse dates safely
  const parseReleaseDate = (dateString: string | null | undefined): Date | null => {
    if (!dateString) return null;
    
    // Try to parse the date
    const parsedDate = new Date(dateString);
    
    // Check if the date is valid (not Invalid Date)
    if (isNaN(parsedDate.getTime())) {
      return null;
    }
    
    return parsedDate;
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSortBy('');
  };

  // Filter and sort games based on the current tab, search query, and sort option
  const processedGames = useMemo(() => {
    const result: GamesByStatus = {
      All: [...gamesByStatus.All],
      Playing: [...gamesByStatus.Playing],
      Finished: [...gamesByStatus.Finished],
      Want: [...gamesByStatus.Want],
      'On-hold': [...gamesByStatus['On-hold']],
      Dropped: [...gamesByStatus.Dropped]
    };

    // Apply search filter to all tabs
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      
      // Filter each status group
      Object.keys(result).forEach(key => {
        result[key as keyof GamesByStatus] = result[key as keyof GamesByStatus].filter(
          game => game.games?.name?.toLowerCase().includes(query)
        );
      });
    }

    // Apply sorting to all tabs
    if (sortBy) {
      Object.keys(result).forEach(key => {
        result[key as keyof GamesByStatus] = result[key as keyof GamesByStatus].sort((a, b) => {
          if (sortBy === 'name_asc') {
            return (a.games?.name || '').localeCompare(b.games?.name || '');
          } else if (sortBy === 'name_desc') {
            return (b.games?.name || '').localeCompare(a.games?.name || '');
          } else if (sortBy === 'rating_desc') {
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            return ratingB - ratingA; // Sort by rating desc
          } else if (sortBy === 'rating_asc') {
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            return ratingA - ratingB; // Sort by rating asc
          } else if (sortBy === 'date_desc') {
            const dateA = new Date(a.updated_at).getTime();
            const dateB = new Date(b.updated_at).getTime();
            return dateB - dateA; // Sort by date added desc
          } else if (sortBy === 'date_asc') {
            const dateA = new Date(a.updated_at).getTime();
            const dateB = new Date(b.updated_at).getTime();
            return dateA - dateB; // Sort by date added asc
          }
          return 0;
        });
      });
    }

    return result;
  }, [gamesByStatus, searchQuery, sortBy]);

  // Process Want games for roadmap view
  const roadmapGames = useMemo(() => {
    if (!showRoadmap) return { released: [], upcoming: [] };

    const today = new Date();
    const wantGames = [...processedGames.Want];
    
    // Sort all games by release date
    wantGames.sort((a, b) => {
      const dateA = parseReleaseDate(a.games?.released);
      const dateB = parseReleaseDate(b.games?.released);
      
      // If both dates are invalid or null, maintain original order
      if (!dateA && !dateB) return 0;
      
      // If only dateA is invalid, treat it as unreleased (future)
      if (!dateA) return 1;
      
      // If only dateB is invalid, treat it as unreleased (future)
      if (!dateB) return -1;
      
      // Both dates are valid, compare them
      return dateA.getTime() - dateB.getTime(); // Sort by release date ascending
    });

    // Split into released and upcoming
    const released = wantGames.filter(game => {
      const releaseDate = parseReleaseDate(game.games?.released);
      // Only include in released if there's a valid date and it's in the past or today
      return releaseDate && releaseDate <= today;
    });
    
    const upcoming = wantGames.filter(game => {
      const releaseDate = parseReleaseDate(game.games?.released);
      // Include in upcoming if there's no date or invalid date, or if it's in the future
      return !releaseDate || releaseDate > today;
    });

    return { released, upcoming };
  }, [processedGames.Want, showRoadmap]);

  const hasActiveFilters = searchQuery.trim() !== '' || sortBy !== '';

  // Get sort button label
  const getSortLabel = () => {
    if (!sortBy) return 'Sort';
    
    if (sortBy.startsWith('rating')) return 'Rating';
    if (sortBy.startsWith('name')) return 'Name';
    if (sortBy.startsWith('date')) return 'Date';
    
    return 'Sort';
  };

  return (
    <Tabs defaultValue="All" className="w-full">
      <div className="mb-4 sm:mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        <TabsList className="bg-slate-900 p-1 flex w-full min-w-max">
          <TabsTrigger value="All" className="flex-1 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
            All{counts?.All ? ` (${processedGames.All.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="Playing" className="flex-1 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
            Playing{counts?.Playing ? ` (${processedGames.Playing.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="Finished" className="flex-1 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
            Finished{counts?.Finished ? ` (${processedGames.Finished.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="Want" className="flex-1 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
            Want{counts?.Want ? ` (${processedGames.Want.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="On-hold" className="flex-1 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
            On Hold{counts?.['On-hold'] ? ` (${processedGames['On-hold'].length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="Dropped" className="flex-1 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
            Dropped{counts?.Dropped ? ` (${processedGames.Dropped.length})` : ''}
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex flex-col gap-4 mb-4 sm:mb-6">
        <div className="relative w-full">
          <Input
            type="search"
            placeholder="Search games..."
            className="bg-slate-700 border-slate-600 text-white focus:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <div className="flex gap-2 w-full">
          <div className="relative flex-1">
            <Button 
              variant="outline"
              className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600 flex justify-between items-center"
              onClick={() => setShowSortMenu(!showSortMenu)}
            >
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mr-2"
                >
                  <path d="M4 14h16M4 18h10M4 6h16M4 10h10"/>
                </svg>
                <span>{getSortLabel()}</span>
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </Button>
          
          {showSortMenu && (
            <div className="absolute z-50 mt-1 w-full bg-slate-800 border border-slate-700 rounded-md shadow-lg">
              <div className="p-2">
                <div className="text-sm font-medium text-slate-300 mb-2 px-2">Rating</div>
                <div className="flex gap-2">
                  <button 
                    className={`flex-1 text-center py-2 rounded-md flex items-center justify-center ${sortBy === 'rating_desc' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                    onClick={() => {
                      setSortBy('rating_desc');
                      setShowSortMenu(false);
                    }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="m18 9-6-6-6 6"/>
                      <path d="M12 3v18"/>
                    </svg>
                  </button>
                  <button 
                    className={`flex-1 text-center py-2 rounded-md flex items-center justify-center ${sortBy === 'rating_asc' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                    onClick={() => {
                      setSortBy('rating_asc');
                      setShowSortMenu(false);
                    }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="m18 15-6 6-6-6"/>
                      <path d="M12 3v18"/>
                    </svg>
                  </button>
                </div>
                
                <div className="text-sm font-medium text-slate-300 mt-3 mb-2 px-2">Name</div>
                <div className="flex gap-2">
                  <button 
                    className={`flex-1 text-center py-2 rounded-md flex items-center justify-center ${sortBy === 'name_asc' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                    onClick={() => {
                      setSortBy('name_asc');
                      setShowSortMenu(false);
                    }}
                  >
                    <span className="text-sm font-medium">A-Z</span>
                  </button>
                  <button 
                    className={`flex-1 text-center py-2 rounded-md flex items-center justify-center ${sortBy === 'name_desc' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                    onClick={() => {
                      setSortBy('name_desc');
                      setShowSortMenu(false);
                    }}
                  >
                    <span className="text-sm font-medium">Z-A</span>
                  </button>
                </div>
                
                <div className="text-sm font-medium text-slate-300 mt-3 mb-2 px-2">Date</div>
                <div className="flex gap-2">
                  <button 
                    className={`flex-1 text-center py-2 rounded-md flex items-center justify-center ${sortBy === 'date_desc' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                    onClick={() => {
                      setSortBy('date_desc');
                      setShowSortMenu(false);
                    }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                      <line x1="16" x2="16" y1="2" y2="6"/>
                      <line x1="8" x2="8" y1="2" y2="6"/>
                      <line x1="3" x2="21" y1="10" y2="10"/>
                      <path d="m9 16 2 2 4-4"/>
                    </svg>
                  </button>
                  <button 
                    className={`flex-1 text-center py-2 rounded-md flex items-center justify-center ${sortBy === 'date_asc' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                    onClick={() => {
                      setSortBy('date_asc');
                      setShowSortMenu(false);
                    }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                      <line x1="16" x2="16" y1="2" y2="6"/>
                      <line x1="8" x2="8" y1="2" y2="6"/>
                      <line x1="3" x2="21" y1="10" y2="10"/>
                      <path d="M8 14h.01"/>
                      <path d="M12 14h.01"/>
                      <path d="M16 14h.01"/>
                      <path d="M8 18h.01"/>
                      <path d="M12 18h.01"/>
                      <path d="M16 18h.01"/>
                    </svg>
                  </button>
                </div>
                
                {sortBy && (
                  <>
                    <div className="border-t border-slate-700 my-2"></div>
                  </>
                )}
              </div>
            </div>
          )}
          </div>
          
          {hasActiveFilters && (
            <Button 
              variant="outline"
              size="sm"
              className="bg-red-700 border-red-600 text-white hover:bg-red-600"
              onClick={resetFilters}
              title="Clear filters"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
            </Button>
          )}
        </div>
      </div>

      <TabsContent value="All">
        <UserGameCollection games={processedGames.All} isOwnProfile={true} />
      </TabsContent>
      <TabsContent value="Playing">
        <UserGameCollection games={processedGames.Playing} isOwnProfile={true} />
      </TabsContent>
      <TabsContent value="Finished">
        <UserGameCollection games={processedGames.Finished} isOwnProfile={true} />
      </TabsContent>
      <TabsContent value="Want">
        <div className="mb-4 flex justify-between items-center">
          <Button
            variant="outline"
            className={`${showRoadmap ? 'bg-purple-700 border-purple-600' : 'bg-slate-700 border-slate-600'} text-white hover:bg-purple-600`}
            onClick={() => setShowRoadmap(!showRoadmap)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-2"
            >
              <path d="M3 3v18h18"/>
              <path d="m9 9 3-3 3 3"/>
              <path d="M9 9v9"/>
              <path d="m15 9-3-3-3 3"/>
              <path d="M15 9v9"/>
            </svg>
            {showRoadmap ? "Standard View" : "Roadmap View"}
          </Button>
        </div>
        
        {showRoadmap ? (
          <div className="space-y-8">
            {roadmapGames.released.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-4">Released Games</h3>
                <UserGameCollection games={roadmapGames.released} isOwnProfile={true} />
              </div>
            )}
            
            <div className="relative py-4">
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white px-4 py-1 rounded-full z-10">
                <div className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="mr-1"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                  You are here
                </div>
              </div>
              <div className="border-t-2 border-dashed border-purple-500"></div>
            </div>
            
            {roadmapGames.upcoming.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-4">Upcoming Games</h3>
                <UserGameCollection games={roadmapGames.upcoming} isOwnProfile={true} />
              </div>
            )}
            
            {roadmapGames.released.length === 0 && roadmapGames.upcoming.length === 0 && (
              <div className="p-6 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-center">
                <p className="text-lg font-medium">No games in your Want list</p>
                <p className="text-sm text-slate-400 mt-1">Add games to your Want list to see them in the roadmap</p>
              </div>
            )}
          </div>
        ) : (
          <UserGameCollection games={processedGames.Want} isOwnProfile={true} />
        )}
      </TabsContent>
      <TabsContent value="On-hold">
        <UserGameCollection games={processedGames['On-hold']} isOwnProfile={true} />
      </TabsContent>
      <TabsContent value="Dropped">
        <UserGameCollection games={processedGames.Dropped} isOwnProfile={true} />
      </TabsContent>
    </Tabs>
  );
} 