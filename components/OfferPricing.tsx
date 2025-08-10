'use client';

import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

const benefits = [
  'Setup in 48 hours or less',
  'Works with your existing booking system',
  'Unlimited conversations & bookings'
];

export default function OfferPricing() {
  const router = useRouter();

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Pricing Card */}
          <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="p-8 sm:p-12">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-text-primary mb-2">
                  Simple, Transparent Pricing
                </h2>
                <p className="text-lg text-text-secondary">
                  Get Sarah working for your med spa today
                </p>
              </div>

              {/* Price Display */}
              <div className="text-center mb-8">
                <div className="inline-flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-text-primary">$297</span>
                  <span className="text-lg text-text-secondary">setup</span>
                </div>
                <div className="inline-flex items-baseline gap-2">
                  <span className="text-xl text-text-secondary">then</span>
                  <span className="text-3xl font-bold text-text-primary">$199</span>
                  <span className="text-lg text-text-secondary">/month</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-text-primary font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Speed Badge */}
              <div className="bg-green-100 border border-green-200 rounded-xl p-4 mb-8">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-green-600 text-2xl">⚡</span>
                  <p className="text-green-800 font-semibold">
                    Live in 48 hours • Limited weekly spots
                  </p>
                </div>
              </div>

              {/* Risk Reversal */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                  <span className="text-lg">🛡️</span>
                  <span className="text-sm font-medium text-text-primary">
                    Full refund if you&apos;re not happy in 14 days
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <button
                  onClick={() => router.push('/checkout-pilot')}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Start Your 48-Hour Setup
                </button>
                <p className="text-xs text-text-tertiary mt-3">
                  No contracts • Cancel anytime • HIPAA compliant
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}