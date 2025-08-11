'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import PurchaseSlideOver from './PurchaseSlideOver';

export default function FinalClose() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const handleCTAClick = () => {
    trackEvent('cta_click_pilot', { location: 'final_close' });
    setShowPurchaseModal(true);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(20, 184, 166, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.3) 0%, transparent 50%)`,
        }} />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center">
          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full mb-6 animate-pulse">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            <span className="text-red-400 font-semibold text-sm">
              Limited spots remaining for January setup
            </span>
          </div>

          {/* Main Promise */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to let Sarah work while you sleep?
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Every night you&apos;re closed, potential clients are trying to book. 
            Sarah captures them all — starting in just 72 hours.
          </p>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-10 max-w-2xl mx-auto border border-white/20">
            <p className="text-lg italic mb-4">
              &ldquo;Game-changer! Our virtual receptionist captured 40% more leads in the first month. 
              Sarah books appointments while I sleep.&rdquo;
            </p>
            <p className="text-sm text-gray-400">
              — Sarah Martinez, Beverly Hills Aesthetics
            </p>
          </div>

          {/* Final Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-3xl font-bold text-teal-400">21</p>
              <p className="text-xs text-gray-400">New bookings</p>
              <p className="text-xs text-gray-500">First month</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-3xl font-bold text-teal-400">$9.4k</p>
              <p className="text-xs text-gray-400">Extra revenue</p>
              <p className="text-xs text-gray-500">Monthly avg</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-3xl font-bold text-teal-400">3sec</p>
              <p className="text-xs text-gray-400">Response time</p>
              <p className="text-xs text-gray-500">24/7 availability</p>
            </div>
          </div>

          {/* Final CTA */}
          <div className="space-y-4">
            <button
              onClick={handleCTAClick}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-teal to-teal-hover text-white hover:from-teal-hover hover:to-teal transition-all duration-200 shadow-2xl hover:shadow-teal/50 hover:-translate-y-0.5 group"
            >
              Start 14-Day Pilot — $297
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <p className="text-xs text-gray-400 mt-2">
              After pilot/setup, service is $199/mo. Cancel anytime.
            </p>
            
            <div className="text-sm text-gray-400 mt-3">
              <button
                onClick={() => {
                  trackEvent('see_plans_click', { location: 'final_close' });
                  setShowPurchaseModal(true);
                }}
                className="underline hover:text-white transition-colors"
              >
                See plans
              </button>
            </div>
          </div>

          {/* Reassurance Strip */}
          <p className="text-xs text-gray-500 mt-8">
            Go live in 48–72h · We handle everything · Works with your booking system
          </p>
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