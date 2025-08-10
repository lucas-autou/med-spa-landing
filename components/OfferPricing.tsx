'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import PurchaseSlideOver from './PurchaseSlideOver';

export default function OfferPricing() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const handleCTAClick = () => {
    trackEvent('cta_click_pilot', { location: 'pricing_section' });
    setShowPurchaseModal(true);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background-secondary to-background-primary">
      <div className="max-w-5xl mx-auto px-4">
        {/* Guarantee Banner */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl shadow-xl p-6 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-lg">Try Sarah for 14 days</p>
                <p className="text-sm opacity-90">Keep all the leads, or get 100% back</p>
              </div>
            </div>
            <button
              onClick={handleCTAClick}
              className="px-6 py-3 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Your 14-Day Pilot
            </button>
          </div>
        </div>

        {/* Main Pricing Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-teal to-teal-hover p-6 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Activate Sarah for Your Med Spa</h2>
            <p className="text-white/90">Go live in 48-72h. We handle setup.</p>
          </div>
          
          <div className="p-8 md:p-10">
            {/* Pilot Offer */}
            <div className="bg-teal/5 border-2 border-teal rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-1">14-Day Pilot</h3>
                  <p className="text-sm text-text-secondary">Perfect to see Sarah in action</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-text-primary">$297</p>
                  <p className="text-xs text-text-secondary">one-time</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                {['14-day access', 'Full setup', 'Real leads', 'Money-back'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-teal flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-text-primary">{item}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleCTAClick}
                className="w-full py-3 bg-teal hover:bg-teal-hover text-white font-semibold rounded-xl transition-colors shadow-md"
              >
                Start Pilot — $297
              </button>
              
              <p className="text-xs text-text-tertiary text-center mt-3">
                Full $297 credit if you upgrade
              </p>
            </div>

            {/* Or Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-text-secondary">or</span>
              </div>
            </div>

            {/* Full Setup Option */}
            <div className="text-center">
              <button
                onClick={() => {
                  trackEvent('cta_click_full', { location: 'pricing_section' });
                  setShowPurchaseModal(true);
                }}
                className="text-sm text-teal hover:text-teal-hover font-medium underline"
              >
                Skip pilot — Full setup $997
              </button>
            </div>

            {/* Transparency */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-text-tertiary text-center">
                After pilot or setup, ongoing access is $199/mo. Cancel anytime. HIPAA-ready.
              </p>
            </div>

            {/* Social Proof */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">{i}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-text-secondary">
                Join 200+ med spas using Sarah
              </p>
            </div>
          </div>
        </div>

        {/* Reassurance Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-teal" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Live in 72h
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-teal" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            No system change
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-teal" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            30-day money-back
          </div>
        </div>
      </div>

      {/* Purchase Slide-over Modal */}
      <PurchaseSlideOver 
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        context="regular"
      />
    </section>
  );
}