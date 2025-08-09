'use client';

import React, { useRef, useState, useCallback } from 'react';

interface DragScrollContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function DragScrollContainer({ children, className = '' }: DragScrollContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);
  const animationRef = useRef<number | null>(null);

  const startMomentumScroll = useCallback(() => {
    if (!scrollRef.current) return;
    
    let currentVelocity = velocity;
    const friction = 0.9; // Deceleration factor
    const minVelocity = 0.1; // Minimum velocity to continue animation
    
    const animate = () => {
      if (!scrollRef.current) return;
      
      currentVelocity *= friction;
      
      if (Math.abs(currentVelocity) < minVelocity) {
        animationRef.current = null;
        return;
      }
      
      scrollRef.current.scrollLeft -= currentVelocity * 10;
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, [velocity]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    
    // Cancel any ongoing momentum animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    setVelocity(0);
    setLastMoveTime(Date.now());
    setLastPosition(e.pageX);
    
    // Prevent text selection and image dragging
    e.preventDefault();
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging && Math.abs(velocity) > 0.5) {
      startMomentumScroll();
    }
    setIsDragging(false);
    // Reset hasDragged after a short delay to allow click prevention
    if (hasDragged) {
      setTimeout(() => setHasDragged(false), 100);
    }
  }, [hasDragged, isDragging, velocity, startMomentumScroll]);

  const handleMouseUp = useCallback(() => {
    if (isDragging && Math.abs(velocity) > 0.5) {
      startMomentumScroll();
    }
    setIsDragging(false);
    // Reset hasDragged after a short delay to allow click prevention
    if (hasDragged) {
      setTimeout(() => setHasDragged(false), 100);
    }
  }, [hasDragged, isDragging, velocity, startMomentumScroll]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1; // Reduced sensitivity for smoother control
    
    // Calculate velocity for momentum
    const currentTime = Date.now();
    const timeDelta = currentTime - lastMoveTime;
    const positionDelta = e.pageX - lastPosition;
    
    if (timeDelta > 0) {
      setVelocity(positionDelta / timeDelta);
    }
    
    setLastMoveTime(currentTime);
    setLastPosition(e.pageX);
    
    // If we've moved more than a few pixels, consider it a drag
    if (Math.abs(walk) > 3) {
      setHasDragged(true);
    }
    
    scrollRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft, lastMoveTime, lastPosition]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, [hasDragged]);

  const handleClickCapture = useCallback((e: React.MouseEvent) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, [hasDragged]);

  return (
    <div
      ref={scrollRef}
      className={`${className} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onClickCapture={handleClickCapture}
      style={{ 
        userSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {children}
    </div>
  );
}
