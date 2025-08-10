'use client';

import { Fragment, useState } from 'react';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

interface PurchaseSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  context?: 'scripted' | 'regular' | null;
  onKeepChatting?: () => void;
}

export default function PurchaseSlideOver({ isOpen, onClose, context, onKeepChatting }: PurchaseSlideOverProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<'pilot' | 'full' | null>(null);

  const handlePurchase = (type: 'pilot' | 'full') => {
    setIsLoading(type);
    if (type === 'pilot') {
      trackEvent('cta_click_pilot', { location: 'purchase_slideover' });
      router.push('/checkout-pilot');
    } else {
      trackEvent('cta_click_full', { location: 'purchase_slideover' });
      router.push('/checkout-full');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background overlay - lighter to keep chat visible */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-lg w-full bg-gray-50 shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">
                Sarah&apos;s Ready to Work for You
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Let me handle your bookings, questions, and leads 24/7 — starting today.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-4 flex-shrink-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {/* Context-aware micro-proof for scripted demo */}
          {context === 'scripted' && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-teal-700 font-medium">
                ✨ She just booked you an appointment in the demo — now imagine that for your real clients
              </p>
            </div>
          )}

          {/* Pricing Options */}
          <div className="space-y-6">
            {/* Pilot Option - Main Focus */}
            <div className="bg-white rounded-2xl p-8 shadow-lg relative">
              <div className="absolute -top-3 left-6 bg-teal-500 text-white px-4 py-1.5 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              
              <h3 className="text-2xl font-bold text-text-primary mb-2">Get Sarah Working Today</h3>
              <p className="text-base text-text-secondary mb-6">14-day pilot program</p>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-text-primary">$297</span>
                <span className="text-lg text-text-secondary ml-2">one-time</span>
                <div className="mt-3 space-y-1">
                  <p className="text-sm text-green-600 font-semibold">
                    ✓ Full credit if you upgrade
                  </p>
                  <p className="text-sm text-text-secondary">
                    ✓ We do all setup for you
                  </p>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-base">
                  <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">14-day access</span>
                </li>
                <li className="flex items-center text-base">
                  <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Full setup</span>
                </li>
                <li className="flex items-center text-base">
                  <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Real leads</span>
                </li>
                <li className="flex items-center text-base">
                  <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Money-back</span>
                </li>
              </ul>
              
              <button
                onClick={() => handlePurchase('pilot')}
                disabled={isLoading === 'pilot'}
                className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white text-lg font-bold rounded-xl transition-all hover:shadow-lg disabled:opacity-50"
              >
                {isLoading === 'pilot' ? 'Loading...' : 'Activate Sarah for My Business'}
              </button>
              
              {/* Social proof right under CTA */}
              <p className="text-center text-sm text-text-secondary mt-4 font-medium">
                Join 200+ med spas using Sarah
              </p>
            </div>

            {/* Skip to Full Setup Link */}
            <div className="text-center">
              <p className="text-sm text-text-secondary mb-2">Ready to go all-in?</p>
              <button
                onClick={() => handlePurchase('full')}
                disabled={isLoading === 'full'}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium underline transition-colors"
              >
                Get full setup for $997 + $97/mo
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex justify-center items-center gap-6 text-sm text-text-secondary">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Live in 48h
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Cancel anytime
            </span>
          </div>

          {/* Keep chatting button for scripted context */}
          {context === 'scripted' && onKeepChatting && (
            <div className="mt-6">
              <button
                onClick={() => {
                  onClose();
                  onKeepChatting();
                }}
                className="w-full py-3 bg-white border-2 border-gray-200 hover:border-teal-500 text-text-primary hover:text-teal-600 font-medium rounded-xl transition-all"
              >
                Keep Chatting with Sarah
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}