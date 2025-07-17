import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar Skeleton */}
            <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-700" />
            
            {/* User Info Skeleton */}
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-64 bg-slate-700" />
              <Skeleton className="h-6 w-32 bg-slate-700" />
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-4 w-20 bg-slate-700" />
                <Skeleton className="h-4 w-24 bg-slate-700" />
                <Skeleton className="h-4 w-28 bg-slate-700" />
              </div>
            </div>
            
            {/* Share Button Skeleton */}
            <div className="w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2 sm:flex">
              <Skeleton className="h-9 w-full sm:w-32 bg-slate-700" />
              <Skeleton className="h-9 w-full sm:w-24 bg-slate-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section Skeleton */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Skeleton className="h-8 w-48 bg-slate-700" />
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="w-6 h-6 rounded bg-slate-600" />
                  <Skeleton className="w-3 h-3 rounded-full bg-slate-600" />
                </div>
                <Skeleton className="h-8 w-12 mb-1 bg-slate-600" />
                <Skeleton className="h-4 w-20 bg-slate-600" />
              </div>
            ))}
          </div>
          
          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <Skeleton className="h-6 w-32 mb-3 bg-slate-600" />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20 bg-slate-600" />
                    <Skeleton className="h-4 w-16 bg-slate-600" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full bg-slate-600" />
                  <Skeleton className="h-3 w-40 bg-slate-600" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Games Section Skeleton */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-40 bg-slate-700" />
            <Skeleton className="h-4 w-60 bg-slate-700" />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                <Skeleton className="h-32 sm:h-40 w-full bg-slate-700" />
                <div className="p-3">
                  <Skeleton className="h-4 w-full mb-1 bg-slate-600" />
                  <Skeleton className="h-3 w-12 bg-slate-600" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gaming Journey Section Skeleton */}
        <section>
          <Skeleton className="h-8 w-48 mb-6 bg-slate-700" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <Skeleton className="h-6 w-32 mb-4 bg-slate-600" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="flex justify-between">
                      <Skeleton className="h-4 w-24 bg-slate-600" />
                      <Skeleton className="h-4 w-16 bg-slate-600" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
