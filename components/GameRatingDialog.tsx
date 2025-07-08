"use client"

import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface GameRatingDialogProps {
  gameId: number;
  gameName: string;
  gameImage?: string;
  triggerComponent?: React.ReactNode;
  gameReleased?: string;
  gameRating?: number;
  hideStatusIndicator?: boolean;
  onUpdate?: () => void;
}

interface GameListEntry {
  status: GameStatus | null;
  rating: number;
  isInList: boolean;
}

export function GameRatingDialog({ 
  gameId, 
  gameName, 
  gameImage,
  gameReleased,
  gameRating,
  triggerComponent,
  hideStatusIndicator = false,
  onUpdate
}: GameRatingDialogProps) {
  const router = useRouter();
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
        
        // Call onUpdate callback if provided
        if (onUpdate) {
          onUpdate();
        } else {
          // Refresh the page data
          router.refresh();
        }
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
        
        // Call onUpdate callback if provided
        if (onUpdate) {
          onUpdate();
        } else {
          // Refresh the page data
          router.refresh();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save your game data');
      console.error('Error saving game list entry:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Format rating display
  const formatRatingDisplay = () => {
    if (gameListEntry.rating === 0) return "—";
    return gameListEntry.rating.toFixed(1);
  };

  // Get rating label
  const getRatingLabel = () => {
    const rating = gameListEntry.rating;
    if (rating === 0) return "";
    if (rating >= 9) return "Masterpiece";
    if (rating >= 8) return "Great";
    if (rating >= 6) return "Good";
    if (rating >= 4) return "Average";
    if (rating >= 2) return "Poor";
    return "Terrible";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerComponent || (
          <Button 
            variant="outline" 
            className="w-full bg-slate-800 border-slate-700 hover:bg-slate-700 text-white"
          >
            {gameListEntry.isInList ? 'Update in List' : 'Add to List'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent hideCloseButton className="bg-slate-900 border-slate-700 text-white max-w-lg w-full p-0 overflow-hidden rounded-lg">
        {isLoading || userLoading ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <DialogTitle className="sr-only">Loading Game Information</DialogTitle>
            <div className="w-8 h-8 border-4 border-t-purple-600 border-slate-700 rounded-full animate-spin"></div>
            <p className="text-slate-300">Loading...</p>
          </div>
        ) : !user ? (
          <div className="p-6 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">Sign In Required</DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4">
              <p className="text-slate-300">You need to be signed in to add games to your list.</p>
              <Button 
                onClick={() => {
                  setOpen(false);
                  router.push('/login');
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Sign In
              </Button>
            </div>
          </div>
        ) : (
          <>
                          <div className="relative">
              {/* Game image header with gradient overlay */}
              <div className="relative h-48 w-full overflow-hidden">
                <DialogTitle className="sr-only">{gameName} - Add to List</DialogTitle>
                {gameImage ? (
                  <Image 
                    src={gameImage} 
                    alt={gameName} 
                    className="object-cover w-full"
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
              </div>
              
              {/* Close button */}
              <DialogClose className="absolute right-2 top-2 rounded-full p-1 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DialogClose>
              
              {/* Game title */}
              <div className="absolute bottom-2 left-4 right-4">
                <h3 className="text-xl font-bold text-white truncate">{gameName}</h3>
              </div>
            </div>
            
            <div className="p-5 space-y-6">
              <DialogHeader className="p-0 space-y-2">
                <DialogTitle className="text-xl font-bold">Status</DialogTitle>
              </DialogHeader>
              
              {error && (
                <div className="bg-red-900/30 border border-red-800 text-red-200 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="px-5 flex justify-center">
                <GameStatusButtons 
                  initialStatus={gameListEntry.status} 
                  onChange={handleStatusChange}
                  disabled={isSaving}
                  className="flex-nowrap w-full justify-center"
                />
              </div>
              
                              <div className="px-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-bold">Rating</h4>
                  <div className="bg-green-900/30 text-green-400 font-bold text-xl px-4 py-2 rounded-md">
                    <span className="mr-2">{formatRatingDisplay()}</span>
                    <span className="text-sm text-green-300">{getRatingLabel()}</span>
                  </div>
                </div>
                <div className="py-6 px-2">
                  <Slider
                    defaultValue={[gameListEntry.rating]}
                    max={10}
                    step={0.5}
                    value={[gameListEntry.rating]}
                    onValueChange={handleRatingChange}
                    disabled={isSaving}
                    className="py-2"
                  />
                </div>
              </div>
              
              <div className="px-5 pb-5">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-6"
                >
                  {isSaving ? 
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-4 h-4 border-2 border-t-white/20 border-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div> 
                    : 'Save to List'
                  }
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 