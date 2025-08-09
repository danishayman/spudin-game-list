import { useState, useEffect } from 'react';
import { Button } from '../ui/button';

export type GameStatus = 'Finished' | 'Playing' | 'Dropped' | 'Want' | 'On-hold' | null;

interface GameStatusButtonsProps {
  initialStatus?: GameStatus;
  onChange: (status: GameStatus) => void;
  disabled?: boolean;
  className?: string;
}

export function GameStatusButtons({ 
  initialStatus = null, 
  onChange, 
  disabled = false,
  className = ''
}: GameStatusButtonsProps) {
  const [selectedStatus, setSelectedStatus] = useState<GameStatus>(initialStatus);

  // Update internal state when initialStatus prop changes
  useEffect(() => {
    setSelectedStatus(initialStatus);
  }, [initialStatus]);

  // Handle status change
  const handleStatusChange = (status: GameStatus) => {
    // Toggle off if already selected
    const newStatus = status === selectedStatus ? null : status;
    setSelectedStatus(newStatus);
    onChange(newStatus);
  };

  // Status button configurations with icons and colors
  const statusButtons = [
    { 
      status: 'Finished' as GameStatus, 
      icon: '✓', 
      label: 'Finished', 
      activeClass: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25',
      inactiveClass: 'bg-slate-800/50 text-slate-300 border-slate-600 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-400'
    },
    { 
      status: 'Playing' as GameStatus, 
      icon: '●', 
      label: 'Playing', 
      activeClass: 'bg-green-500 hover:bg-green-600 text-white border-green-500 shadow-lg shadow-green-500/25',
      inactiveClass: 'bg-slate-800/50 text-slate-300 border-slate-600 hover:bg-green-500/10 hover:border-green-500/50 hover:text-green-400'
    },
    { 
      status: 'Dropped' as GameStatus, 
      icon: '✕', 
      label: 'Dropped', 
      activeClass: 'bg-red-500 hover:bg-red-600 text-white border-red-500 shadow-lg shadow-red-500/25',
      inactiveClass: 'bg-slate-800/50 text-slate-300 border-slate-600 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400'
    },
    { 
      status: 'Want' as GameStatus, 
      icon: '♦', 
      label: 'Want', 
      activeClass: 'bg-purple-500 hover:bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/25',
      inactiveClass: 'bg-slate-800/50 text-slate-300 border-slate-600 hover:bg-purple-500/10 hover:border-purple-500/50 hover:text-purple-400'
    },
    { 
      status: 'On-hold' as GameStatus, 
      icon: '❚❚', 
      label: 'On-hold', 
      activeClass: 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500 shadow-lg shadow-orange-500/25',
      inactiveClass: 'bg-slate-800/50 text-slate-300 border-slate-600 hover:bg-orange-500/10 hover:border-orange-500/50 hover:text-orange-400'
    },
  ];

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-5 w-full gap-2 sm:gap-3 ${className}`}>
      {statusButtons.map(({ status, icon, label, activeClass, inactiveClass }) => {
        const isSelected = selectedStatus === status;
        return (
          <Button
            key={status}
            variant="outline"
            onClick={() => handleStatusChange(status)}
            disabled={disabled}
            className={`
              flex flex-col items-center justify-center gap-1 p-3 sm:p-4 h-16 sm:h-18 
              text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 
              ${isSelected ? activeClass : inactiveClass}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className="text-lg sm:text-xl">{icon}</span>
            <span className="leading-tight">{label}</span>
          </Button>
        );
      })}
    </div>
  );
} 