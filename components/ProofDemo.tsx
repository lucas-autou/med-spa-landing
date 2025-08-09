'use client';

import { useState } from 'react';

export default function ProofDemo() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20 px-4 bg-background-card/30" id="demo">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Watch how our virtual receptionist books a Botox consultation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Video Demo */}
          <div className="relative">
            <div className="relative bg-white rounded-xl overflow-hidden border border-border-light shadow-lg">
              {/* Placeholder for demo video */}
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-background-muted to-white">
                {!isPlaying ? (
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="flex items-center justify-center w-20 h-20 bg-teal hover:bg-teal/90 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
                  >
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="animate-pulse">
                      <div className="w-32 h-32 bg-gradient-to-br from-teal to-blush rounded-full mx-auto mb-4"></div>
                      <p className="text-text-primary">Demo playing...</p>
                      <p className="text-text-secondary text-sm">Client books Botox consultation in under 60 seconds</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Video controls overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-status-success rounded-full animate-pulse"></div>
                  <span className="text-white text-sm">Live Demo</span>
                </div>
                <div className="text-white text-sm">0:45 / 1:30</div>
              </div>
            </div>

            {/* Floating stats */}
            <div className="absolute -top-4 -right-4 bg-status-success text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              95% Conversion Rate
            </div>
            <div className="absolute -bottom-4 -left-4 bg-accent-beauty text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              Sub 60s Booking
            </div>
          </div>

          {/* Testimonial */}
          <div className="space-y-8">
            <div className="bg-white border border-border-light rounded-xl p-8 shadow-md">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-teal to-blush rounded-full flex items-center justify-center text-white font-bold">
                  SC
                </div>
                <div className="ml-4">
                  <h4 className="text-text-primary font-semibold">Sarah Chen</h4>
                  <p className="text-text-secondary text-sm">Miami Aesthetics</p>
                </div>
              </div>
              
              <blockquote className="text-text-primary text-lg leading-relaxed mb-4">
                &ldquo;This changed everything for us. We&apos;re capturing leads at 3am now, and our booking rate went from 40% to 85%. The setup was painless.&rdquo;
              </blockquote>
              
              <div className="flex items-center text-text-secondary text-sm">
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
                <span className="ml-2">Verified Customer</span>
              </div>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-white border border-border-light rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-teal mb-1">+40%</div>
                <div className="text-text-secondary text-sm">Lead Increase</div>
              </div>
              <div className="text-center p-4 bg-white border border-border-light rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blush mb-1">85%</div>
                <div className="text-text-secondary text-sm">Conversion Rate</div>
              </div>
            </div>

            {/* Social proof badges */}
            <div className="space-y-3">
              <p className="text-text-secondary text-sm font-medium">Trusted by Med Spas in:</p>
              <div className="flex flex-wrap gap-2">
                {['Miami, FL', 'Beverly Hills, CA', 'Dallas, TX', 'Manhattan, NY'].map((location) => (
                  <span
                    key={location}
                    className="px-3 py-1 bg-background-muted border border-border-light rounded-full text-xs text-text-secondary"
                  >
                    {location}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}