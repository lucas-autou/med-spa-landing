'use client';

import { useEffect, useState } from 'react';

interface AvatarPlaceholderProps {
  state: 'idle' | 'listening' | 'talking' | 'ack_nod';
  className?: string;
}

export default function AvatarPlaceholder({ state, className = '' }: AvatarPlaceholderProps) {
  const [currentFrame, setCurrentFrame] = useState(0);

  // Simple animation for talking states
  useEffect(() => {
    if (state === 'talking') {
      const interval = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % 3);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [state]);

  const getStateDisplay = () => {
    switch (state) {
      case 'listening':
        return {
          icon: '👂',
          bg: 'from-blue-500/20 to-cyan-500/20',
          ring: 'ring-blue-400/50',
          animation: 'animate-pulse'
        };
      case 'talking':
        return {
          icon: currentFrame === 0 ? '🙂' : currentFrame === 1 ? '😊' : '😄',
          bg: 'from-teal/20 to-teal-light',
          ring: 'ring-teal/50',
          animation: ''
        };
      case 'ack_nod':
        return {
          icon: '😊',
          bg: 'from-teal/10 to-teal-light/50',
          ring: 'ring-teal/30',
          animation: 'animate-pulse'
        };
      default: // idle
        return {
          icon: '😊',
          bg: 'from-teal/20 to-blush/20',
          ring: 'ring-teal/50',
          animation: 'animate-pulse'
        };
    }
  };

  const display = getStateDisplay();

  return (
    <div className={`relative ${className}`}>
      {/* Main Avatar Circle */}
      <div className={`
        w-80 h-80 md:w-96 md:h-96 rounded-full 
        bg-gradient-to-br ${display.bg}
        border-4 ${display.ring} 
        flex items-center justify-center
        ${display.animation}
        relative overflow-hidden
      `}>
        
        {/* Avatar Icon/Emoji */}
        <div className="text-8xl md:text-9xl">
          {display.icon}
        </div>

        {/* State Indicator */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
          {state === 'idle' && '💤 Ready'}
          {state === 'listening' && '👂 Listening'}
          {state.startsWith('talking') && '💬 Speaking'}
        </div>

        {/* Breathing/pulse effect overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Animated ring for active states */}
        {(state === 'listening' || state.startsWith('talking')) && (
          <div className="absolute inset-0 rounded-full animate-ping border-2 border-teal/30" />
        )}
      </div>

      {/* Floating particles for enhanced effect */}
      <div className="absolute -inset-4 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-teal/40 rounded-full animate-bounce delay-1000" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blush/60 rounded-full animate-bounce delay-500" />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-teal/30 rounded-full animate-bounce delay-700" />
      </div>

      {/* Demo label */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white border border-border-light rounded-lg px-4 py-2 shadow-sm">
        <p className="text-text-secondary text-sm text-center">
          Demo Avatar - Video coming soon!
        </p>
      </div>
    </div>
  );
}