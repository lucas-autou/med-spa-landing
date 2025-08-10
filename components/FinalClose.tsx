'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function FinalClose() {
  const router = useRouter();

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-teal-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Promise */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            Get more clients, never miss a lead — all without lifting a finger
          </h2>
          
          <p className="text-lg sm:text-xl text-text-secondary mb-8">
            Sarah works 24/7 so you don&apos;t have to. She&apos;s already booking appointments for 200+ med spas.
          </p>

          {/* Urgency Line */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 border border-orange-200 rounded-full mb-8">
            <span className="text-orange-600 font-bold animate-pulse">🔥</span>
            <span className="text-orange-800 font-semibold text-sm sm:text-base">
              New client setups limited weekly — secure your spot
            </span>
          </div>

          {/* Final Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <p className="text-2xl font-bold text-teal-600">40%</p>
              <p className="text-xs text-text-secondary">More bookings</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <p className="text-2xl font-bold text-teal-600">24/7</p>
              <p className="text-xs text-text-secondary">Always on</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <p className="text-2xl font-bold text-teal-600">48h</p>
              <p className="text-xs text-text-secondary">Setup time</p>
            </div>
          </div>

          {/* Final CTA Button */}
          <button
            onClick={() => router.push('/checkout-pilot')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 group"
          >
            Start My 48-Hour Setup
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Trust Line */}
          <p className="text-sm text-text-tertiary mt-6">
            Join med spas in Miami, LA, Dallas & NYC • Cancel anytime • 14-day money back guarantee
          </p>
        </div>
      </div>
    </section>
  );
}