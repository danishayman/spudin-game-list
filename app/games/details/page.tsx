'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';

function GameDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  
  useEffect(() => {
    if (id) {
      const gameId = parseInt(id, 10);
      if (!isNaN(gameId)) {
        // Redirect to the dynamic route
        router.replace(`/games/${gameId}`);
      } else {
        notFound();
      }
    } else {
      notFound();
    }
  }, [id, router]);
  
  // Show loading while redirecting
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="aspect-[3/4] w-full bg-slate-700 animate-pulse rounded-lg"></div>
        </div>
        <div className="md:col-span-2">
          <div className="h-10 bg-slate-700 animate-pulse rounded mb-4"></div>
          <div className="h-6 bg-slate-700 animate-pulse rounded mb-6 w-1/3"></div>
          <div className="h-8 bg-slate-700 animate-pulse rounded mb-2"></div>
          <div className="flex gap-2 mb-6">
            <div className="h-6 bg-slate-700 animate-pulse rounded w-16"></div>
            <div className="h-6 bg-slate-700 animate-pulse rounded w-16"></div>
            <div className="h-6 bg-slate-700 animate-pulse rounded w-16"></div>
          </div>
          <div className="h-8 bg-slate-700 animate-pulse rounded mb-2"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-slate-700 animate-pulse rounded w-24"></div>
            <div className="h-6 bg-slate-700 animate-pulse rounded w-24"></div>
            <div className="h-6 bg-slate-700 animate-pulse rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GameDetailsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="aspect-[3/4] w-full bg-slate-700 animate-pulse rounded-lg"></div>
          </div>
          <div className="md:col-span-2">
            <div className="h-10 bg-slate-700 animate-pulse rounded mb-4"></div>
            <div className="h-6 bg-slate-700 animate-pulse rounded mb-6 w-1/3"></div>
            <div className="h-8 bg-slate-700 animate-pulse rounded mb-2"></div>
            <div className="flex gap-2 mb-6">
              <div className="h-6 bg-slate-700 animate-pulse rounded w-16"></div>
              <div className="h-6 bg-slate-700 animate-pulse rounded w-16"></div>
              <div className="h-6 bg-slate-700 animate-pulse rounded w-16"></div>
            </div>
            <div className="h-8 bg-slate-700 animate-pulse rounded mb-2"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-slate-700 animate-pulse rounded w-24"></div>
              <div className="h-6 bg-slate-700 animate-pulse rounded w-24"></div>
              <div className="h-6 bg-slate-700 animate-pulse rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <GameDetailsContent />
    </Suspense>
  );
} 