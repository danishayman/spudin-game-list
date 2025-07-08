import { useState, useEffect } from 'react';
import { Button } from './ui/button';

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
      activeClass: 'bg-blue-600 hover:bg-blue-700 text-white',
      inactiveClass: 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200'
    },
    { 
      status: 'Playing' as GameStatus, 
      icon: '◉', 
      label: 'Playing', 
      activeClass: 'bg-green-600 hover:bg-green-700 text-white',
      inactiveClass: 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
    },
    { 
      status: 'Dropped' as GameStatus, 
      icon: '✗', 
      label: 'Dropped', 
      activeClass: 'bg-red-600 hover:bg-red-700 text-white',
      inactiveClass: 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'
    },
    { 
      status: 'Want' as GameStatus, 
      icon: '✧', 
      label: 'Want', 
      activeClass: 'bg-purple-600 hover:bg-purple-700 text-white',
      inactiveClass: 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200'
    },
    { 
      status: 'On-hold' as GameStatus, 
      icon: '❚❚', 
      label: 'On-hold', 
      activeClass: 'bg-amber-600 hover:bg-amber-700 text-white',
      inactiveClass: 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200'
    },
  ];

  return (
    <div className={`grid grid-cols-5 w-full gap-2 ${className}`}>
      {statusButtons.map(({ status, icon, label, activeClass, inactiveClass }) => {
        const isSelected = selectedStatus === status;
        return (
          <Button
            key={status}
            variant="outline"
            onClick={() => handleStatusChange(status)}
            disabled={disabled}
            className={`flex items-center justify-center gap-1 ${isSelected ? activeClass : inactiveClass}`}
          >
            <span className="mr-1">{icon}</span>
            <span>{label}</span>
          </Button>
        );
      })}
    </div>
  );
} 