import { Skeleton } from "@/components/ui/skeleton";

export function GameCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-64 h-80">
      <div className="bg-slate-700 rounded-lg overflow-hidden w-full h-full flex flex-col">
        {/* Image skeleton */}
        <div className="relative h-72">
          <Skeleton className="w-full h-full bg-slate-600" />
          {/* Metacritic score skeleton */}
          <div className="absolute top-2 right-2">
            <Skeleton className="w-8 h-6 bg-slate-500" />
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="p-3 flex flex-col flex-grow">
          {/* Title skeleton */}
          <Skeleton className="h-4 w-3/4 mb-2 bg-slate-600" />
          
          {/* Genres skeleton */}
          <Skeleton className="h-3 w-1/2 mb-2 bg-slate-600" />
          
          {/* Bottom section with year and rating */}
          <div className="mt-auto flex items-center justify-between">
            <Skeleton className="h-3 w-12 bg-slate-600" />
            <Skeleton className="h-3 w-8 bg-slate-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function GameCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <GameCardSkeleton key={`skeleton-${index}`} />
      ))}
    </>
  );
}
