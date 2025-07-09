'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { type GameStatus } from '@/components/GameStatusButtons';
import { Skeleton } from '@/components/ui/skeleton';

interface Review {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    full_name: string | null;
    username: string;
    avatar_url: string | null;
  };
  game_list?: {
    status: GameStatus | null;
    rating: number | null;
  } | null;
}

interface GameReviewsProps {
  gameId: number;
}

export default function GameReviews({ gameId }: GameReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setIsLoading(true);
        const supabase = createClient();
        
        // First, let's fetch all reviews for this game
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('game_id', gameId)
          .order('created_at', { ascending: false });
          
        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          throw reviewsError;
        }
        
        if (!reviewsData || reviewsData.length === 0) {
          setReviews([]);
          setIsLoading(false);
          return;
        }
        
        // Now fetch user profiles for these reviews
        const userIds = [...new Set(reviewsData.map(review => review.user_id))];
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds);
          
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }
        
        // Create a map of user_id to profile data for easier access
        const profilesMap = (profilesData || []).reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>);
        
        // Now fetch game list entries for these users and this game
        const { data: gameListsData, error: gameListsError } = await supabase
          .from('game_lists')
          .select('*')
          .in('user_id', userIds)
          .eq('game_id', gameId);
          
        if (gameListsError) {
          console.error('Error fetching game lists:', gameListsError);
          throw gameListsError;
        }
        
        // Create a map of user_id to game list data for easier access
        const gameListsMap = (gameListsData || []).reduce((acc, gameList) => {
          acc[gameList.user_id] = gameList;
          return acc;
        }, {} as Record<string, any>);
        
        // Combine all the data into our reviews structure
        const processedReviews: Review[] = reviewsData.map(review => {
          const profile = profilesMap[review.user_id] || {};
          const gameList = gameListsMap[review.user_id];
          
          return {
            id: review.id,
            content: review.content,
            created_at: review.created_at,
            updated_at: review.updated_at,
            user: {
              full_name: profile.full_name || null,
              username: profile.username || 'unknown',
              avatar_url: profile.avatar_url || null
            },
            game_list: gameList ? {
              status: gameList.status,
              rating: gameList.rating
            } : null
          };
        });
        
        setReviews(processedReviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchReviews();
  }, [gameId]);

  // Function to get status color
  const getStatusColor = (status: GameStatus | null) => {
    if (!status) return '';
    
    switch (status) {
      case 'Finished': return 'bg-blue-500 text-white';
      case 'Playing': return 'bg-green-500 text-white';
      case 'Dropped': return 'bg-red-500 text-white';
      case 'Want': return 'bg-purple-500 text-white';
      case 'On-hold': return 'bg-amber-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };
  
  // Format rating display
  const formatRatingDisplay = (rating: number | null) => {
    if (!rating || rating === 0) return "—";
    return rating.toFixed(1);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Game Reviews</h2>
        {[1, 2, 3].map(i => (
          <div key={i} className="mb-6 p-6 bg-slate-800 border border-slate-700 rounded-lg">
            <div className="flex items-start gap-4 mb-4">
              <Skeleton className="w-12 h-12 rounded-full bg-slate-700" />
              <div className="flex-1">
                <Skeleton className="w-40 h-5 mb-2 bg-slate-700" />
                <Skeleton className="w-24 h-4 bg-slate-700" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="w-full h-4 bg-slate-700" />
              <Skeleton className="w-full h-4 bg-slate-700" />
              <Skeleton className="w-3/4 h-4 bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Game Reviews</h2>
        <div className="p-4 bg-red-900/30 border border-red-800 text-red-300 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Game Reviews</h2>
      
      {reviews.length === 0 ? (
        <div className="p-6 bg-slate-800 border border-slate-700 rounded-lg text-center">
          <p className="text-slate-400">No reviews yet for this game. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="p-6 bg-slate-800 border border-slate-700 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                {/* User avatar */}
                <Link href={`/profile/${review.user.username}`}>
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
                    {review.user.avatar_url ? (
                      <Image
                        src={review.user.avatar_url}
                        alt={review.user.username}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-slate-300 text-xl font-bold">
                        {review.user.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </Link>
                
                {/* User info and review meta */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Link href={`/profile/${review.user.username}`}>
                      <h3 className="font-semibold text-white hover:underline">
                        {review.user.full_name || review.user.username}
                      </h3>
                    </Link>
                    
                    {/* User's game status if available */}
                    {review.game_list?.status && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(review.game_list.status)}`}>
                        {review.game_list.status}
                      </span>
                    )}
                    
                    {/* User's rating if available */}
                    {review.game_list?.rating !== null && review.game_list?.rating !== undefined && review.game_list.rating > 0 && (
                      <span className="flex items-center text-sm font-medium text-yellow-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {formatRatingDisplay(review.game_list.rating)}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-slate-400">
                    {formatDate(review.created_at)}
                    {review.updated_at !== review.created_at && ' (edited)'}
                  </div>
                </div>
              </div>
              
              {/* Review content */}
              <div className="text-slate-300 whitespace-pre-line">
                {review.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 