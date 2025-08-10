'use client';

import { Fragment, useState } from 'react';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

interface PurchaseSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PurchaseSlideOver({ isOpen, onClose }: PurchaseSlideOverProps) {
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
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-lg w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">
              Get Sarah Live for Your Med Spa
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-orange-600 font-medium mt-1">
            🔥 Live in 48 hours • Limited spots weekly
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Mini social proof */}
          <div className="bg-teal-50 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-teal-700 font-medium mb-2">
              Join 200+ med spas already using Sarah
            </p>
            <div className="flex justify-center items-center gap-4 text-xs text-teal-600">
              <span>📈 40% more leads</span>
              <span>💰 $9K+ monthly ROI</span>
              <span>⏰ 24/7 availability</span>
            </div>
          </div>

          {/* Pricing Options */}
          <div className="space-y-4">
            {/* Pilot Option */}
            <div className="border-2 border-teal-500 rounded-2xl p-6 relative bg-gradient-to-br from-teal-50 to-white">
              <div className="absolute -top-3 left-4 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                MOST POPULAR
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-text-primary">14-Day Pilot</h3>
                <p className="text-sm text-text-secondary">Test everything risk-free</p>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-text-primary">$297</span>
                  <span className="text-sm text-text-secondary ml-2">one-time</span>
                </div>
                <div className="bg-green-100 border border-green-200 rounded-lg p-2 mt-2">
                  <p className="text-xs text-green-700 font-medium">
                    💡 Full $297 credit applied if you upgrade
                  </p>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Complete 14-day access
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Full setup & configuration
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Real lead capture & testing
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  30-day money-back guarantee
                </li>
              </ul>
              <button
                onClick={() => handlePurchase('pilot')}
                disabled={isLoading === 'pilot'}
                className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {isLoading === 'pilot' ? 'Loading...' : 'Start Pilot - $297'}
              </button>
            </div>

            {/* Full Setup Option */}
            <div className="border border-gray-200 rounded-2xl p-6 bg-white">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-text-primary">Full Setup</h3>
                <p className="text-sm text-text-secondary">Complete implementation</p>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-text-primary">$297</span>
                  <span className="text-sm text-text-secondary ml-2">setup</span>
                </div>
                <div className="flex items-baseline mt-1">
                  <span className="text-xl font-semibold text-text-primary">$199</span>
                  <span className="text-sm text-text-secondary ml-1">/month</span>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Everything from Pilot
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Priority support & training
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Advanced analytics & insights
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  White-label options available
                </li>
              </ul>
              <button
                onClick={() => handlePurchase('full')}
                disabled={isLoading === 'full'}
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {isLoading === 'full' ? 'Loading...' : 'Get Full Setup'}
              </button>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-center items-center space-x-6 text-xs text-text-secondary">
              <div className="flex items-center">
                <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Secure Payment
              </div>
              <div className="flex items-center">
                <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Money-Back Guarantee
              </div>
              <div className="flex items-center">
                <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Live in 48 Hours
              </div>
            </div>
          </div>

          {/* Final testimonial */}
          <div className="mt-6 bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm italic text-text-primary mb-2">
              &ldquo;ROI was immediate. Sarah paid for herself in the first week.&rdquo;
            </p>
            <p className="text-xs text-text-secondary">— Dr. Martinez, Miami</p>
          </div>
        </div>
      </div>
    </>
  );
}