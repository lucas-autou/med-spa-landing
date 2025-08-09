'use client';

import { useEffect, useState } from 'react';
import { isDemoMode } from '@/lib/demo';

export default function DemoBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setShowBanner(isDemoMode());
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-400 text-gray-900 px-4 py-2 text-center text-sm font-medium z-50 border-b border-amber-500 shadow-md">
      <div className="flex items-center justify-center space-x-2">
        <span>🎭</span>
        <span>DEMO MODE - No real payments will be processed</span>
        <button 
          onClick={() => setShowBanner(false)}
          className="ml-4 text-gray-900 hover:text-gray-700 font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}