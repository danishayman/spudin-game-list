"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger,
  DialogClose
} from './ui/dialog';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { GameStatusButtons, type GameStatus } from './GameStatusButtons';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/lib/hooks';

interface GameRatingDialogProps {
  gameId: number;
  gameName: string;
  gameImage?: string;
  triggerComponent?: React.ReactNode;
  gameReleased?: string;
  gameRating?: number;
}

interface GameListEntry {
  status: GameStatus;
  rating: number;
  isInList: boolean;
}

export function GameRatingDialog({ 
  gameId, 
  gameName, 
  gameImage,
  gameReleased,
  gameRating,
  triggerComponent 
}: GameRatingDialogProps) {
  const { user, isLoading: userLoading } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [gameListEntry, setGameListEntry] = useState<GameListEntry>({
    status: null,
    rating: 0,
    isInList: false,
  });

  // Fetch existing game list entry if user is logged in
  useEffect(() => {
    async function fetchGameListEntry() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const supabase = createClient();
        
        // Get user's game list entry
        const { data, error } = await supabase
          .from('game_lists')
          .select('status, rating')
          .eq('user_id', user.id)
          .eq('game_id', gameId)
          .single();
          
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          throw error;
        }
        
        if (data) {
          setGameListEntry({
            status: data.status as GameStatus,
            rating: data.rating || 0,
            isInList: true,
          });
        } else {
          setGameListEntry({
            status: null,
            rating: 0,
            isInList: false,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load your game data');
        console.error('Error fetching game list entry:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchGameListEntry();
    
    // Re-fetch when dialog opens
    if (open) {
      fetchGameListEntry();
    }
  }, [gameId, user, open]);

  // Handle status change
  const handleStatusChange = (status: GameStatus) => {
    setGameListEntry(prev => ({ ...prev, status }));
    // Clear any previous error messages
    setError(null);
  };

  // Handle rating change
  const handleRatingChange = (values: number[]) => {
    if (values.length > 0) {
      setGameListEntry(prev => ({ ...prev, rating: values[0] }));
      // Clear any previous error messages
      setError(null);
    }
  };

  // Get color based on rating value
  const getRatingColor = () => {
    const rating = gameListEntry.rating;
    if (rating >= 8) return 'text-green-500';
    if (rating >= 6) return 'text-lime-500';
    if (rating >= 4) return 'text-yellow-500';
    if (rating >= 2) return 'text-orange-500';
    return 'text-red-500';
  };

  // Get background color for the rating display
  const getRatingBgColor = () => {
    const rating = gameListEntry.rating;
    if (rating >= 8) return 'bg-green-500/20';
    if (rating >= 6) return 'bg-lime-500/20';
    if (rating >= 4) return 'bg-yellow-500/20';
    if (rating >= 2) return 'bg-orange-500/20';
    return 'bg-red-500/20';
  };

  // Get status color and icon
  const getStatusInfo = (status: GameStatus) => {
    switch (status) {
      case 'Finished':
        return { icon: '✓', color: 'text-blue-500', bgColor: 'bg-blue-500/20' };
      case 'Playing':
        return { icon: '◉', color: 'text-green-500', bgColor: 'bg-green-500/20' };
      case 'Dropped':
        return { icon: '✗', color: 'text-red-500', bgColor: 'bg-red-500/20' };
      case 'Want':
        return { icon: '✧', color: 'text-purple-500', bgColor: 'bg-purple-500/20' };
      case 'On-hold':
        return { icon: '❚❚', color: 'text-amber-500', bgColor: 'bg-amber-500/20' };
      default:
        return { icon: '?', color: 'text-slate-500', bgColor: 'bg-slate-500/20' };
    }
  };

  // Save changes to database
  const handleSave = async () => {
    if (!user) {
      setError('You must be logged in to save games to your list');
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
      const supabase = createClient();
      
      // Check if game exists in the games table
      const { data: gameExists, error: gameExistsError } = await supabase
        .from('games')
        .select('id, name, background_image, released, rating')
        .eq('id', gameId)
        .single();
      
      if (gameExistsError && gameExistsError.code !== 'PGRST116') {
        console.error('Error checking if game exists:', gameExistsError);
      }
        
      // If game doesn't exist, add it first with all required fields
      if (!gameExists) {
        console.log('Game does not exist in database, adding it now:', gameId, gameName);
        
        const { data: insertData, error: insertError } = await supabase.from('games').insert({
          id: gameId,
          name: gameName,
          background_image: gameImage || null,
          released: gameReleased || null,
          rating: gameRating || null
        }).select();
        
        if (insertError) {
          console.error('Error inserting game into games table:', insertError);
          throw new Error(`Failed to add game to database: ${insertError.message}`);
        } else {
          console.log('Successfully added game to database:', insertData);
        }
      } else {
        console.log('Game already exists in database:', gameExists);
      }
      
      if (gameListEntry.status === null && gameListEntry.rating === 0) {
        // If both status and rating are empty/default, delete the entry
        const { error } = await supabase
          .from('game_lists')
          .delete()
          .eq('user_id', user.id)
          .eq('game_id', gameId);
          
        if (error) throw error;
        setGameListEntry(prev => ({ ...prev, isInList: false }));
        setOpen(false); // Close dialog after removing
      } else {
        // Otherwise upsert the entry
        const { error } = await supabase
          .from('game_lists')
          .upsert({
            user_id: user.id,
            game_id: gameId,
            status: gameListEntry.status,
            rating: gameListEntry.rating,
            updated_at: new Date().toISOString(),
          });
          
        if (error) throw error;
        setGameListEntry(prev => ({ ...prev, isInList: true }));
        setOpen(false); // Close dialog after saving
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save your game data');
      console.error('Error saving game list entry:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Default trigger if none provided - shows different UI based on if game is in list
  const defaultTrigger = gameListEntry.isInList ? (
    <Button 
      className="w-full bg-slate-800 border border-slate-700 hover:bg-slate-700 py-4 text-lg"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          {gameListEntry.status && (
            <span className={`${getStatusInfo(gameListEntry.status).color} mr-2`}>
              {getStatusInfo(gameListEntry.status).icon}
            </span>
          )}
          <span>{gameListEntry.status || "In List"}</span>
        </div>
        {gameListEntry.rating > 0 && (
          <div className={`${getRatingColor()} font-bold`}>
            {gameListEntry.rating.toFixed(1)}
          </div>
        )}
      </div>
    </Button>
  ) : (
    <Button 
      className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg"
    >
      Add to Your List
    </Button>
  );

  // Custom trigger component with status/rating info if game is in list
  const customTrigger = gameListEntry.isInList ? (
    <div onClick={(e) => e.stopPropagation()} className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
      {gameListEntry.status && (
        <div className={`px-2 py-1 rounded text-xs font-bold ${getStatusInfo(gameListEntry.status).bgColor} ${getStatusInfo(gameListEntry.status).color}`}>
          {getStatusInfo(gameListEntry.status).icon} {gameListEntry.status}
        </div>
      )}
      {gameListEntry.rating > 0 && (
        <div className={`px-2 py-1 rounded text-xs font-bold ${getRatingBgColor()} ${getRatingColor()}`}>
          ★ {gameListEntry.rating.toFixed(1)}
        </div>
      )}
    </div>
  ) : triggerComponent;

  if (userLoading) {
    return (
      <div className="mt-4 p-4 bg-slate-800 rounded-md animate-pulse">
        <div className="h-8 bg-slate-700 rounded mb-4"></div>
        <div className="h-10 bg-slate-700 rounded"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-4 p-4 bg-slate-800/50 rounded-md border border-slate-700">
        <p className="text-slate-300 mb-2">Sign in to add this game to your list</p>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerComponent ? customTrigger : defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {gameImage && (
              <div className="w-12 h-12 relative overflow-hidden rounded">
                <Image 
                  src={gameImage} 
                  alt={gameName} 
                  fill 
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 truncate">{gameName}</div>
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="p-4 animate-pulse space-y-4">
            <div className="h-8 bg-slate-700 rounded"></div>
            <div className="h-10 bg-slate-700 rounded"></div>
          </div>
        ) : (
          <>
            <div className="space-y-6 py-2">
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Status</h4>
                <div className="bg-slate-900/50 p-3 rounded-md border border-slate-700">
                  <GameStatusButtons 
                    initialStatus={gameListEntry.status} 
                    onChange={handleStatusChange}
                    disabled={isSaving}
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Rating</h4>
                <div className="bg-slate-900/50 p-4 rounded-md border border-slate-700 space-y-4">
                  <Slider
                    defaultValue={[gameListEntry.rating]}
                    value={[gameListEntry.rating]}
                    max={10}
                    step={0.1}
                    onValueChange={handleRatingChange}
                    disabled={isSaving}
                  />
                  <div className="flex justify-center">
                    <div className={`font-bold text-2xl ${getRatingColor()} px-4 py-2 rounded ${getRatingBgColor()}`}>
                      {gameListEntry.rating.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="p-2 bg-red-900/30 border border-red-800 text-red-300 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <DialogFooter className="flex gap-2 pt-2">
              <DialogClose asChild>
                <Button 
                  variant="outline"
                  className="flex-1"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isSaving ? 'Saving...' : gameListEntry.isInList ? 'Update' : 'Save to List'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 