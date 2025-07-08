export default function GameLoading() {
  return (
    <div className="container mx-auto py-8" data-skeleton="true">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="aspect-video w-full bg-slate-700 animate-pulse rounded-lg"></div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-video w-full bg-slate-700 animate-pulse rounded"></div>
            ))}
          </div>
          <div className="mt-6">
            <div className="h-10 bg-slate-700 animate-pulse rounded mb-4 w-full"></div>
          </div>
          <div className="mt-6">
            <div className="h-8 bg-slate-700 animate-pulse rounded mb-2"></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-10 bg-slate-700 animate-pulse rounded"></div>
              <div className="h-10 bg-slate-700 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="h-10 bg-slate-700 animate-pulse rounded mb-4"></div>
          <div className="h-6 bg-slate-700 animate-pulse rounded mb-6 w-1/3"></div>
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="h-6 w-16 bg-slate-700 animate-pulse rounded-full"></div>
            <div className="h-6 w-16 bg-slate-700 animate-pulse rounded-full"></div>
            <div className="h-6 w-16 bg-slate-700 animate-pulse rounded-full"></div>
          </div>
          <div className="h-24 bg-slate-700 animate-pulse rounded mb-6"></div>
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
          <div className="mt-6">
            <div className="h-8 bg-slate-700 animate-pulse rounded mb-2"></div>
            <div className="aspect-video w-full bg-slate-700 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 