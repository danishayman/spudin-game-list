'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ShareProfileButtonProps {
  username: string;
}

export function ShareProfileButton({ username }: ShareProfileButtonProps) {
  const [copied, setCopied] = useState(false);
  
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/profile/${encodeURIComponent(username)}`;
    
    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${username}'s Game Collection`,
          text: `Check out ${username}'s game collection on Spudin Game List!`,
          url: shareUrl
        });
        return;
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
    
    // Fallback to clipboard copy
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={handleShare}
      className="flex items-center gap-2 border-slate-500 text-slate-300 hover:bg-slate-600 hover:text-white"
    >
      {copied ? (
        <>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5"/>
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          Share Profile
        </>
      )}
    </Button>
  );
} 