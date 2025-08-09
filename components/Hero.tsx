'use client';

import { useEffect } from 'react';
import AvatarWidget from './AvatarWidget';
import CTAButtons from './CTAButtons';
import { trackEvent } from '@/lib/analytics';

export default function Hero() {
  useEffect(() => {
    // Track hero view on mount
    trackEvent('hero_view');
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column - Copy & CTAs */}
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
              Never Miss a{' '}
              <span className="text-teal">
                Booking
              </span>{' '}
              at Your Med Spa
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary max-w-2xl">
              Your 24/7 virtual receptionist — answering, qualifying, 
              and booking clients even after hours.
            </p>
          </div>

          {/* Primary CTAs */}
          <div className="space-y-4">
            <CTAButtons 
              variant="large"
              className="flex-col sm:flex-row"
              primaryText="Start 14-Day Pilot"
              secondaryText="Book Full Setup"
            />
            
            <p className="text-text-tertiary text-sm font-medium">
              Setup in 72 hours · Cancel anytime · HIPAA-safe lead capture
            </p>
          </div>

          {/* City Badges */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <span className="text-text-secondary text-sm">Trusted in:</span>
            {['Miami', 'LA', 'Dallas', 'NYC'].map((city) => (
              <span
                key={city}
                className="px-3 py-1 bg-background-secondary border border-border-light rounded-full text-sm text-text-tertiary"
              >
                {city}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column - Avatar Widget */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -inset-4 bg-gradient-to-r from-teal/10 to-blush-light rounded-3xl blur-xl opacity-20" />
            <div className="absolute -inset-2 bg-gradient-to-r from-teal/5 to-transparent rounded-3xl blur-lg opacity-30" />
            
            {/* Avatar Widget */}
            <div className="relative">
              <AvatarWidget autoStart={true} />
            </div>

            {/* Floating accent elements */}
            <div className="absolute top-4 -right-4 w-3 h-3 bg-blush rounded-full animate-pulse" />
            <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-teal rounded-full animate-pulse delay-500" />
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-blush-light rounded-full blur-3xl" />
      </div>
    </section>
  );
}