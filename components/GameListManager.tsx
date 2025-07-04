import { useState, useEffect } from 'react';
import { RatingInput } from './RatingInput';
import { GameStatusButtons, type GameStatus } from './GameStatusButtons';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/lib/hooks';
import { Button } from './ui/button';

interface GameListManagerProps {
  gameId: number;
  gameName: string;
  gameImage?: string;
}

interface GameListEntry {
  status: GameStatus;
  rating: number;
}

export function GameListManager({ gameId, gameName, gameImage }: GameListManagerProps) {
  const { user, isLoading: userLoading } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [gameListEntry, setGameListEntry] = useState<GameListEntry>({
    status: null,
    rating: 0,
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
        
        // Check if game exists in the games table
        const { data: gameExists } = await supabase
          .from('games')
          .select('id')
          .eq('id', gameId)
          .single();
          
        // If game doesn't exist, add it first
        if (!gameExists) {
          await supabase.from('games').insert({
            id: gameId,
            name: gameName,
            background_image: gameImage,
          });
        }
        
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
  }, [gameId, gameName, gameImage, user]);

  // Handle status change
  const handleStatusChange = (status: GameStatus) => {
    setGameListEntry(prev => ({ ...prev, status }));
    // Clear any previous success/error messages
    setSuccess(null);
    setError(null);
  };

  // Handle rating change
  const handleRatingChange = (rating: number) => {
    setGameListEntry(prev => ({ ...prev, rating }));
    // Clear any previous success/error messages
    setSuccess(null);
    setError(null);
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
      setSuccess(null);
      const supabase = createClient();
      
      if (gameListEntry.status === null && gameListEntry.rating === 0) {
        // If both status and rating are empty/default, delete the entry
        const { error } = await supabase
          .from('game_lists')
          .delete()
          .eq('user_id', user.id)
          .eq('game_id', gameId);
          
        if (error) throw error;
        setSuccess('Game removed from your list');
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
        setSuccess('Game saved to your list');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save your game data');
      console.error('Error saving game list entry:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (userLoading || isLoading) {
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
    <div className="mt-4 p-4 bg-slate-800/50 rounded-md border border-slate-700">
      <h3 className="text-lg font-semibold mb-4">Add to Your List</h3>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-white mb-3">Status</h4>
        <div className="bg-slate-900/50 p-3 rounded-md border border-slate-700">
          <GameStatusButtons 
            initialStatus={gameListEntry.status} 
            onChange={handleStatusChange}
            disabled={isSaving}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-white mb-3">Rating</h4>
        <div className="bg-slate-900/50 p-3 rounded-md border border-slate-700">
          <RatingInput 
            initialRating={gameListEntry.rating} 
            onChange={handleRatingChange}
            disabled={isSaving}
          />
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-900/30 border border-red-800 text-red-300 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-2 bg-green-900/30 border border-green-800 text-green-300 rounded-md text-sm">
          {success}
        </div>
      )}
      
      <Button 
        onClick={handleSave} 
        disabled={isSaving}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        {isSaving ? 'Saving...' : 'Save to Your List'}
      </Button>
    </div>
  );
} 