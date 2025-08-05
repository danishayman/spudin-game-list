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
    <div className="bg-slate-700 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Stats</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-slate-600 rounded-lg">
          <div className="text-2xl font-bold text-white">{stats.counts.Total || 0}</div>
          <div className="text-slate-400">Total Games</div>
        </div>
        
        <div className="text-center p-3 bg-slate-600 rounded-lg">
          <div className="text-2xl font-bold text-green-400">{stats.counts.Playing || 0}</div>
          <div className="text-slate-400">Playing</div>
        </div>
        
        <div className="text-center p-3 bg-slate-600 rounded-lg">
          <div className="text-2xl font-bold text-blue-400">{stats.counts.Finished || 0}</div>
          <div className="text-slate-400">Completed</div>
        </div>
        
        <div className="text-center p-3 bg-slate-600 rounded-lg">
          <div className="text-2xl font-bold text-purple-400">{stats.counts.Want || 0}</div>
          <div className="text-slate-400">Want to Play</div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-slate-600 rounded-lg">
          <div className="text-2xl font-bold text-amber-400">{stats.counts['On-hold'] || 0}</div>
          <div className="text-slate-400">On Hold</div>
        </div>
        
        <div className="text-center p-3 bg-slate-600 rounded-lg">
          <div className="text-2xl font-bold text-red-400">{stats.counts.Dropped || 0}</div>
          <div className="text-slate-400">Dropped</div>
        </div>
      </div>
      
      {stats.totalRated > 0 && (
        <div className="mt-6 p-4 bg-slate-600 rounded-lg text-center">
          <div className="text-sm text-slate-400 mb-1">Average Rating</div>
          <div className="flex items-center justify-center">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="text-2xl font-bold text-white">{formatRating(stats.averageRating)}</span>
            <span className="text-slate-400 ml-1 text-sm">/ 10</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Based on {stats.totalRated} rated {stats.totalRated === 1 ? 'game' : 'games'}
          </div>
        </div>
      )}
    </div>
  );
} 