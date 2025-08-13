'use client';

import { UserStats } from '@/lib/actions/profileActions';

interface UserStatsDisplayProps {
  stats: UserStats;
  className?: string;
}

export function UserStatsDisplay({ stats, className = '' }: UserStatsDisplayProps) {
  const completionRate = stats.totalGames > 0 
    ? Math.round((stats.gamesFinished / stats.totalGames) * 100)
    : 0;

  const statCards = [
    {
      label: 'Total Games',
      value: stats.totalGames,
      icon: '🎮',
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Completed',
      value: stats.gamesFinished,
      icon: '✅',
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Currently Playing',
      value: stats.gamesPlaying,
      icon: '🕹️',
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Want to Play',
      value: stats.gamesWantToPlay,
      icon: '⭐',
      color: 'from-amber-500 to-amber-600'
    },
    {
      label: 'Average Rating',
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—',
      icon: '⭐',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      label: 'Reviews Written',
      value: stats.totalReviews,
      icon: '📝',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.color}`}></div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-slate-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Completion Rate */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="mr-2">📊</span>
            Completion Rate
          </h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300">Progress</span>
            <span className="text-white font-semibold">{completionRate}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {stats.gamesFinished} of {stats.totalGames} games completed
          </div>
        </div>

        {/* Activity Status */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="mr-2">🕐</span>
            Recent Activity
          </h3>
          <div className="text-slate-300 text-sm">
            {stats.recentActivity}
          </div>
          
          {/* Gaming Status Breakdown */}
          <div className="mt-4 space-y-2">
            {stats.gamesOnHold > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">On Hold:</span>
                <span className="text-amber-400">{stats.gamesOnHold}</span>
              </div>
            )}
            {stats.gamesDropped > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Dropped:</span>
                <span className="text-red-400">{stats.gamesDropped}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
