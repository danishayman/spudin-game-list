'use client';

interface UserProfileStatsProps {
  stats: {
    counts: Record<string, number> & {
      Playing?: number;
      Finished?: number;
      Want?: number;
      'On-hold'?: number;
      Dropped?: number;
      Total?: number;
    };
    averageRating: number;
    totalRated: number;
  };
}

export function UserProfileStats({ stats }: UserProfileStatsProps) {
  // Format rating to show one decimal point
  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-lg border border-slate-600/50 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Gaming Statistics</h2>
        </div>
        
        {/* Stats Grid - Uniform sizing */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg p-4 border border-slate-500/30 hover:border-slate-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 min-h-[100px] flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full"></div>
            <div className="relative text-center">
              <div className="text-2xl font-bold text-white mb-1">{stats.counts.Total || 0}</div>
              <div className="text-slate-300 text-sm font-medium">Total Games</div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg p-4 border border-slate-500/30 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 min-h-[100px] flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full"></div>
            <div className="relative text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{stats.counts.Playing || 0}</div>
              <div className="text-slate-300 text-sm font-medium">Playing</div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg p-4 border border-slate-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 min-h-[100px] flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full"></div>
            <div className="relative text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{stats.counts.Finished || 0}</div>
              <div className="text-slate-300 text-sm font-medium">Completed</div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg p-4 border border-slate-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 min-h-[100px] flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full"></div>
            <div className="relative text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">{stats.counts.Want || 0}</div>
              <div className="text-slate-300 text-sm font-medium">Want to Play</div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg p-4 border border-slate-500/30 hover:border-amber-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 min-h-[100px] flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full"></div>
            <div className="relative text-center">
              <div className="text-2xl font-bold text-amber-400 mb-1">{stats.counts['On-hold'] || 0}</div>
              <div className="text-slate-300 text-sm font-medium">On Hold</div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg p-4 border border-slate-500/30 hover:border-red-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 min-h-[100px] flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-red-500/20 to-transparent rounded-bl-full"></div>
            <div className="relative text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">{stats.counts.Dropped || 0}</div>
              <div className="text-slate-300 text-sm font-medium">Dropped</div>
            </div>
          </div>
        </div>
        
        {/* Average Rating Card */}
        {stats.totalRated > 0 && (
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-lg p-6 border border-amber-500/30">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-bl-full"></div>
            <div className="relative text-center">
              <div className="text-sm text-amber-200 mb-2 font-medium">Average Rating</div>
              <div className="flex items-center justify-center mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{formatRating(stats.averageRating)}</span>
                <span className="text-slate-300 ml-1 text-lg">/ 10</span>
              </div>
              <div className="text-xs text-amber-200/80 mt-2">
                Based on {stats.totalRated} rated {stats.totalRated === 1 ? 'game' : 'games'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 