"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Dialog, 
  DialogContent,
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose,
  DialogFooter
} from './ui/dialog';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { GameStatusButtons, type GameStatus } from './GameStatusButtons';
import { ReviewInput } from './ReviewInput';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { X, Trash2 } from 'lucide-react';

interface GameRatingDialogProps {
  gameId: number;
  gameName: string;
  gameImage?: string;
  triggerComponent?: React.ReactNode;
  gameReleased?: string;
  gameRating?: number;
  gameGenres?: { id: number; name: string }[];
  onUpdate?: () => void;
}

interface GameListEntry {
  status: GameStatus | null;
  rating: number;
  isInList: boolean;
  review: string | null;
}

export function GameRatingDialog({ 
  gameId, 
  gameName, 
  gameImage,
  gameReleased,
  gameRating,
  gameGenres,
  triggerComponent,
  onUpdate
}: GameRatingDialogProps) {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [gameListEntry, setGameListEntry] = useState<GameListEntry>({
    status: null,
    rating: 0,
    isInList: false,
    review: null
  });
  const [reviewContent, setReviewContent] = useState<string>('');

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
        const { data: gameListData, error: gameListError } = await supabase
          .from('game_lists')
          .select('status, rating')
          .eq('user_id', user.id)
          .eq('game_id', gameId)
          .single();
          
        if (gameListError && gameListError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          throw gameListError;
        }

        // Get user's review if exists
        const { data: reviewData, error: reviewError } = await supabase
          .from('reviews')
          .select('content')
          .eq('user_id', user.id)
          .eq('game_id', gameId)
          .single();

        if (reviewError && reviewError.code !== 'PGRST116') {
          throw reviewError;
        }
        
        if (gameListData || reviewData) {
          setGameListEntry({
            status: gameListData?.status as GameStatus || null,
            rating: gameListData?.rating || 0,
            isInList: !!gameListData,
            review: reviewData?.content || null
          });
          setReviewContent(reviewData?.content || '');
        } else {
          setGameListEntry({
            status: null,
            rating: 0,
            isInList: false,
            review: null
          });
          setReviewContent('');
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

  // Handle review content change
  const handleReviewChange = (content: string) => {
    setReviewContent(content);
    // Clear any previous error messages
    setError(null);
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

  // Delete game from list
  const handleDelete = async () => {
    if (!user) {
      setError('You must be logged in to remove games from your list');
      return;
    }
    
    try {
      setIsDeleting(true);
      setError(null);
      const supabase = createClient();
      
      // Delete from game_lists
      const { error: gameListError } = await supabase
        .from('game_lists')
        .delete()
        .eq('user_id', user.id)
        .eq('game_id', gameId);
        
      if (gameListError) throw gameListError;
      
      // Delete review if exists
      const { error: reviewError } = await supabase
        .from('reviews')
        .delete()
        .eq('user_id', user.id)
        .eq('game_id', gameId);
        
      if (reviewError) throw reviewError;
      
      setGameListEntry({
        status: null,
        rating: 0,
        isInList: false,
        review: null
      });
      setReviewContent('');
      
      setShowDeleteConfirm(false);
      setOpen(false); // Close dialog after removing
      
      // Call onUpdate callback if provided
      if (onUpdate) {
        onUpdate();
      } else {
        // Refresh the page data
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove game from your list');
      console.error('Error deleting game list entry:', err);
    } finally {
      setIsDeleting(false);
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
          rating: gameRating || null,
          genres: gameGenres || null
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
      
      // Determine what to save
      const hasGameEntry = gameListEntry.status !== null || gameListEntry.rating > 0;
      const hasReview = reviewContent.trim() !== '';
      
      // Process game list entry if needed
      if (hasGameEntry) {
        // Upsert the game list entry
        const { error: gameListError } = await supabase
          .from('game_lists')
          .upsert({
            user_id: user.id,
            game_id: gameId,
            status: gameListEntry.status,
            rating: gameListEntry.rating,
            updated_at: new Date().toISOString(),
          });
          
        if (gameListError) throw gameListError;
      } else {
        // If both status and rating are empty/default, delete the entry
        const { error: deleteError } = await supabase
          .from('game_lists')
          .delete()
          .eq('user_id', user.id)
          .eq('game_id', gameId);
          
        if (deleteError && deleteError.code !== 'PGRST116') throw deleteError;
      }
      
      // Process review if needed
      if (hasReview) {
        // Upsert the review
        const { error: reviewError } = await supabase
          .from('reviews')
          .upsert({
            user_id: user.id,
            game_id: gameId,
            content: reviewContent,
            updated_at: new Date().toISOString(),
          });
          
        if (reviewError) throw reviewError;
      } else if (gameListEntry.review !== null) {
        // If review content is empty but there was a review before, delete it
        const { error: deleteReviewError } = await supabase
          .from('reviews')
          .delete()
          .eq('user_id', user.id)
          .eq('game_id', gameId);
          
        if (deleteReviewError && deleteReviewError.code !== 'PGRST116') throw deleteReviewError;
      }
      
      // Update local state
      setGameListEntry(prev => ({
        ...prev,
        isInList: hasGameEntry,
        review: hasReview ? reviewContent : null
      }));
      
      setOpen(false); // Close dialog after saving
      
      // Call onUpdate callback if provided
      if (onUpdate) {
        onUpdate();
      } else {
        // Refresh the page data
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save your game data');
      console.error('Error saving game list entry:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete confirmation dialog
  const DeleteConfirmationDialog = () => (
    <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white p-6 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Remove Game</DialogTitle>
        </DialogHeader>
        <p className="py-4">Are you sure you want to remove this game from your list?</p>
        <DialogFooter className="flex sm:justify-between gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => setShowDeleteConfirm(false)}
            className="border-slate-700 hover:bg-slate-300 text-black"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2 justify-center">
                <div className="w-4 h-4 border-2 border-t-white/20 border-white rounded-full animate-spin"></div>
                <span>Removing...</span>
              </div>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {triggerComponent || (
            <Button 
              variant="outline" 
              className="w-full bg-purple-700 border-purple-600 hover:bg-purple-800 hover:text-white text-white"
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
                    <div className="w-full h-48 bg-slate-800"></div>
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
              
              <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
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
                    disabled={isSaving || isDeleting}
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
                      disabled={isSaving || isDeleting}
                      className="py-2"
                    />
                  </div>
                </div>
                
                {/* Review Section */}
                <div className="px-5 space-y-4">
                  <h4 className="text-xl font-bold">Review</h4>
                  <div className="py-2">
                    <ReviewInput
                      gameId={gameId}
                      userId={user.id}
                      initialContent={gameListEntry.review || ''}
                      onChange={handleReviewChange}
                      disabled={isSaving || isDeleting}
                    />
                  </div>
                </div>
              </div>
              
              {/* Footer with action buttons */}
              <div className="bg-black/30 p-4 flex items-center justify-between border-t border-slate-800">
                {gameListEntry.isInList || gameListEntry.review ? (
                  <>
                    <Button
                      onClick={() => setShowDeleteConfirm(true)}
                      variant="ghost"
                      className="text-slate-300 hover:text-white hover:bg-transparent"
                      disabled={isSaving}
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Delete
                    </Button>
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="bg-slate-200 hover:bg-white text-slate-900 font-medium px-8 py-2 rounded-full"
                    >
                      {isSaving ? (
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-4 h-4 border-2 border-t-slate-400 border-slate-900 rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </div>
                      ) : (
                        'Update'
                      )}
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="bg-slate-200 hover:bg-white text-slate-900 font-medium px-8 py-2 rounded-full ml-auto"
                  >
                    {isSaving ? (
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-4 h-4 border-2 border-t-slate-400 border-slate-900 rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      'Save to List'
                    )}
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Separate delete confirmation dialog */}
      <DeleteConfirmationDialog />
    </>
  );
} 