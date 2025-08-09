import { useState, useEffect } from 'react';
import { Textarea } from '../ui/textarea';

interface ReviewInputProps {
  initialContent?: string;
  onChange: (content: string) => void;
  disabled?: boolean;
  maxLength?: number;
}

export function ReviewInput({ 
  initialContent = '', 
  onChange, 
  disabled = false,
  maxLength = 500
}: ReviewInputProps) {
  const [content, setContent] = useState(initialContent);
  const [charCount, setCharCount] = useState(initialContent.length);
  
  // Update internal state when initialContent prop changes
  useEffect(() => {
    setContent(initialContent);
    setCharCount(initialContent.length);
  }, [initialContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= maxLength) {
      setContent(newContent);
      setCharCount(newContent.length);
      onChange(newContent);
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={content}
        onChange={handleChange}
        placeholder="Write your review here..."
        disabled={disabled}
        className="w-full min-h-[120px] bg-slate-800 border-slate-700 text-white resize-y"
      />
      
      <div className="flex justify-end">
        <span className={`text-sm ${charCount > maxLength * 0.8 ? 'text-amber-400' : 'text-slate-400'}`}>
          {charCount}/{maxLength}
        </span>
      </div>
    </div>
  );
} 