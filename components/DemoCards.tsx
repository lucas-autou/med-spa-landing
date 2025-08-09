'use client';

import { useEffect, useState } from 'react';
import { useDemoStore } from '@/store/useDemoStore';

interface DemoCard {
  type: 'dm' | 'badge';
  text: string;
}

export default function DemoCards() {
  const { currentStep, showBookingCards, demoState } = useDemoStore();
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  // Reset when demo changes or step changes
  useEffect(() => {
    setVisibleCards([]);
  }, [currentStep?.id, demoState]);

  // Animate cards in when booking step is active and showBookingCards is true
  useEffect(() => {
    if (!showBookingCards || !currentStep?.cards || currentStep.id !== 'booking') {
      setVisibleCards([]);
      return;
    }

    // Animate cards in one by one
    currentStep.cards.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, index]);
      }, index * 600); // 600ms delay between each card
    });
  }, [showBookingCards, currentStep]);

  if (!showBookingCards || !currentStep?.cards || currentStep.id !== 'booking') {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      {currentStep.cards.map((card, index) => (
        <div
          key={index}
          className={`
            transition-all duration-500 ease-out
            ${visibleCards.includes(index) 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-4 scale-95'
            }
          `}
        >
          {card.type === 'dm' ? (
            <div className="bg-teal/5 border border-teal/20 rounded-lg p-4 ml-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-teal rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-medium">S</span>
                </div>
                <div className="text-text-primary">{card.text}</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {card.text}
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Recap Text */}
      {currentStep.recap && visibleCards.length === currentStep.cards.length && (
        <div className="mt-6 p-4 bg-background-muted border border-border-light rounded-lg">
          <p className="text-text-primary text-center font-medium">
            {currentStep.recap}
          </p>
        </div>
      )}
    </div>
  );
}