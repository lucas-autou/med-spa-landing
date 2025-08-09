'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function StickyAssistant() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        setIsVisible(scrollPosition > heroBottom);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    // Scroll back to hero consultation screen
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
      trackEvent('sticky_assistant_reopened', { action: 'scroll_to_hero' });
      setHasNotification(false);
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-teal hover:bg-teal-hover text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center group"
      aria-label="Return to virtual assistant chat"
    >
      <div className="relative">
        {/* Pulse animation */}
        <div className="absolute inset-0 w-16 h-16 bg-teal rounded-full animate-ping opacity-25" />
        
        {/* Chat icon */}
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        
        {/* Notification dot */}
        {hasNotification && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </div>
      
      {/* Tooltip on hover */}
      <span className="absolute bottom-20 right-0 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Continue conversation with Sarah
      </span>
    </button>
  );
}