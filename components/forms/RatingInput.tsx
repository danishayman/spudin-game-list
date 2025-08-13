import { useState, useEffect } from 'react';
import { Input } from '../ui/input';

interface RatingInputProps {
  initialRating?: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

export function RatingInput({ initialRating = 0, onChange, disabled = false }: RatingInputProps) {
  const [rating, setRating] = useState<number>(initialRating);

  // Update internal state when initialRating prop changes
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  // Handle rating change
  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    // Ensure rating is between 0 and 10 with one decimal place
    const newRating = Math.min(Math.max(0, value), 10);
    setRating(newRating);
    onChange(newRating);
  };

  // Get color based on rating value
  const getRatingColor = () => {
    if (rating >= 8) return 'text-green-500';
    if (rating >= 6) return 'text-lime-500';
    if (rating >= 4) return 'text-yellow-500';
    if (rating >= 2) return 'text-orange-500';
    return 'text-red-500';
  };

  // Get background color for the rating display
  const getRatingBgColor = () => {
    if (rating >= 8) return 'bg-green-500/20';
    if (rating >= 6) return 'bg-lime-500/20';
    if (rating >= 4) return 'bg-yellow-500/20';
    if (rating >= 2) return 'bg-orange-500/20';
    return 'bg-red-500/20';
  };

  return (
    <div className="flex items-center gap-3">
      <Input
        id="rating"
        type="number"
        min="0"
        max="10"
        step="0.1"
        value={rating}
        onChange={handleRatingChange}
        className="w-20 bg-slate-800 border-slate-700 text-white"
        disabled={disabled}
      />
      <div className={`font-bold text-lg ${getRatingColor()} px-3 py-1 rounded ${getRatingBgColor()}`}>
        {rating.toFixed(1)} / 10
      </div>
    </div>
  );
} 