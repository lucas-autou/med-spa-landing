'use client';

import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

export default function ConversionSection() {
  const router = useRouter();

  const handlePilotClick = () => {
    trackEvent('cta_click_pilot', { location: 'conversion_section' });
    router.push('/checkout-pilot');
  };

  const handleDemoClick = () => {
    // trackEvent('cta_click_demo', { location: 'conversion_section' });
    // Could open calendar widget or modal
    router.push('/schedule-demo');
  };

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Main Conversion Block */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-2">
            Loved what you saw? Sarah can be live for you in 72h.
          </h2>
          <p className="text-sm text-orange-600 font-medium mb-6">
            Only 4 pilot spots available this month
          </p>
          
          {/* Feature Bullets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mt-8 mb-10">
            <div className="flex items-start gap-3 text-left">
              <svg className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-text-secondary">HIPAA-safe lead capture</span>
            </div>
            <div className="flex items-start gap-3 text-left">
              <svg className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-text-secondary">24/7 availability — never miss a booking</span>
            </div>
            <div className="flex items-start gap-3 text-left">
              <svg className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-text-secondary">Custom scripts tailored to your business</span>
            </div>
            <div className="flex items-start gap-3 text-left">
              <svg className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-text-secondary">Works with your booking tools (Boulevard, Square, Calendly, etc.)</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePilotClick}
              className="px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Start 14-Day Pilot →
            </button>
            <button
              onClick={handleDemoClick}
              className="px-8 py-4 bg-white border-2 border-teal-500 text-teal-600 hover:bg-teal-50 rounded-xl font-semibold text-lg transition-all duration-200"
            >
              Schedule a Demo
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-16"></div>

        {/* Social Proof */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-6">
            Trusted by top med spas
          </p>
          
          {/* Logo Row - Placeholder for now */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12 opacity-60">
            <div className="text-gray-400 font-semibold">Beverly Hills Aesthetics</div>
            <div className="text-gray-400 font-semibold">Miami Skin Clinic</div>
            <div className="text-gray-400 font-semibold">NYC MedSpa</div>
            <div className="text-gray-400 font-semibold">Dallas Beauty</div>
          </div>

          {/* Testimonial - Enhanced */}
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-teal-50 to-pink-50 rounded-2xl p-8 lg:p-10">
            <svg className="w-10 h-10 text-teal-400 mb-4 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-lg lg:text-xl text-text-primary mb-6 italic">
              &ldquo;Sarah books an average of 18 extra appointments per month for our clinic — worth <span className="font-bold text-3xl text-emerald-600 px-2 py-1 bg-emerald-100 rounded-lg">$9,000+</span> in additional revenue.&rdquo;
            </p>
            <div className="flex items-center justify-center gap-4">
              {/* Real headshot placeholder */}
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-amber-100 to-pink-200">
                <img 
                  src="/api/placeholder/56/56" 
                  alt="Dr. Ana Martinez"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold" style={{display: 'none'}}>
                  DA
                </div>
              </div>
              <div className="text-left">
                <p className="font-semibold text-text-primary">Dr. Ana Martinez</p>
                <p className="text-sm text-text-secondary">Skin Renewal Med Spa, Miami</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works - Condensed */}
        <div className="mb-12">
          <h3 className="text-2xl lg:text-3xl font-bold text-center text-text-primary mb-8">
            How It Works
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-teal-600">1</span>
              </div>
              <h4 className="font-semibold text-base text-text-primary mb-2">Setup</h4>
              <p className="text-sm text-text-secondary mb-1">
                We plug Sarah into your booking tools
              </p>
              <p className="text-xs text-teal-600 font-medium">
                — no tech headaches
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-teal-600">2</span>
              </div>
              <h4 className="font-semibold text-base text-text-primary mb-2">Go Live</h4>
              <p className="text-sm text-text-secondary mb-1">
                Sarah starts booking appointments 24/7
              </p>
              <p className="text-xs text-teal-600 font-medium">
                — even while you sleep
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-teal-600">3</span>
              </div>
              <h4 className="font-semibold text-base text-text-primary mb-2">Grow</h4>
              <p className="text-sm text-text-secondary mb-1">
                Watch your revenue increase instantly
              </p>
              <p className="text-xs text-teal-600 font-medium">
                — never miss a booking again
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Teaser */}
        <div className="bg-gradient-to-r from-teal-50 to-pink-50 rounded-2xl p-8 lg:p-10 text-center mb-16">
          <h3 className="text-2xl font-bold text-text-primary mb-3">
            Try Sarah for 14 days, risk-free.
          </h3>
          <p className="text-lg text-text-secondary">
            Setup in 72h. Cancel anytime.
          </p>
        </div>

        {/* Final CTA Banner */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6">
            Limited spots for January onboarding — secure yours now.
          </h3>
          <button
            onClick={handlePilotClick}
            className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Get Sarah Now →
          </button>
        </div>
      </div>
    </section>
  );
}