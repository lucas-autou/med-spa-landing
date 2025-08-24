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
    <>
      {/* Micro-Testimonial Block */}
      <section className="pt-12 pb-6 bg-background-secondary">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 text-center">
            <p className="text-lg text-text-primary italic mb-4 leading-relaxed">
              “Our AI already answered more than 2,000 messages since we implemented it.”
            </p>
            <p className="text-sm text-text-secondary font-medium">
              — Barbara R., Custommer Success Specialist
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Strip */}
      <section className="pt-6 pb-16 bg-gradient-to-br from-teal via-teal to-teal-hover relative overflow-hidden">
        {/* Premium background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Never Miss a Client Again
          </h2>
          <p className="text-xl text-white/95 mb-10 font-medium max-w-2xl mx-auto">
            Go live in 48h. <span className="bg-white/20 px-3 py-1 rounded-full font-bold">Risk-free: book at least 1 lead in 14 days</span> or your money back.
          </p>

          <div className="relative group inline-block mb-8">
            <div className="absolute -inset-2 bg-white/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition duration-500"></div>
            <button
              onClick={handleCTAClick}
              className="relative inline-flex items-center gap-4 bg-white text-teal hover:bg-gray-50 px-16 py-7 rounded-3xl font-bold text-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 border border-white/20"
            >
              Start Your 14-Day Pilot — $97
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          <p className="text-sm text-white/90 leading-relaxed max-w-2xl mx-auto mb-4">
            After 14 days, Sarah continues at $297/mo unless you cancel. Full $97 credit applied to your first month if you continue.
          </p>

          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full">
            <svg className="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-sm">Trusted by 40+ companies worldwide</span>
          </div>
        </div>
      </section>

      {/* Official Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              © 2025 Sarah AI, Inc. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              21 SE 1st Avenue, 10th Floor, Miami, FL 33131, United States
            </p>
            <p className="text-sm text-gray-500 mb-6">
              support@sarah.ai
            </p>

            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
              <button className="hover:text-teal transition-colors">
                Privacy Policy
              </button>
              <span className="text-gray-300">|</span>
              <button className="hover:text-teal transition-colors">
                Terms of Service
              </button>
              <span className="text-gray-300">|</span>
              <button className="hover:text-teal transition-colors">
                Refund Policy
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Purchase Slide-over Modal */}
      <PurchaseSlideOver
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        context="regular"
      />
    </>
  );
}
