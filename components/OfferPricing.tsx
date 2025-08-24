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
    <section id="pricing-section" className="py-20 bg-gradient-to-b from-background-secondary to-background-primary">
      <div className="max-w-5xl mx-auto px-4">
        {/* Urgency Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Now onboarding med spas for September — limited spots each month to ensure quality setup
          </div>
        </div>

        {/* Main Pricing Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-teal to-teal-hover p-6 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Start 14-Day Pilot, Risk-Free</h2>
            <p className="text-white/90">Go live in 48–72h. We handle setup.</p>
          </div>

          <div className="p-8 md:p-10">
            {/* Pilot Offer */}
            <div className="bg-teal/5 border-2 border-teal rounded-xl p-8 mb-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-1">14-Day Pilot</h3>
                  <p className="text-sm text-text-secondary">Perfect to see Sarah in action</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-text-primary">$97</p>
                  <p className="text-xs text-text-secondary">one-time</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  'Full setup done for you',
                  'Sarah live on IG DMs, SMS & chat',
                  'Real leads delivered to your calendar',
                  'Money-back if < 1 lead in 14 days'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                      <span className="text-teal font-bold text-sm">✅</span>
                    </div>
                    <span className="text-sm text-text-primary leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              {/* Guarantee Badge - moved closer to button */}
              <div className="mb-4">
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span className="font-semibold text-xs">1-Lead Money-Back Guarantee</span>
                </div>
              </div>

              <button
                onClick={handleCTAClick}
                className="w-full py-4 bg-teal hover:bg-teal-hover text-white font-bold text-lg rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                Start 14-Day Pilot — $97
              </button>

              <p className="text-xs text-text-tertiary text-center mt-4 leading-relaxed">
                After 14 days, Sarah continues at $297/mo unless you cancel. Cancel anytime.
              </p>
              <p className="text-xs text-text-tertiary text-center mt-1">
                Full $97 credit applied to your first month if you continue.
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

            {/* Secondary Option */}
            <div className="text-center">
              <button
                onClick={() => {
                  trackEvent('cta_click_pilot', { location: 'pricing_section_demo' });
                  // Add demo booking logic here
                }}
                className="text-sm text-teal hover:text-teal-hover font-medium"
              >
                Prefer a quick call? Book a 15-min demo →
              </button>
            </div>

            {/* Social Proof - Simplified */}
            <div className="mt-6 text-center">
              <p className="text-sm text-text-secondary">
                Trusted by 40+ companies worldwide
              </p>
            </div>
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
