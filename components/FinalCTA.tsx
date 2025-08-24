'use client';

import CTAButtons from './CTAButtons';

export default function FinalCTA() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-teal/10 via-white to-blush/10">
      <div className="max-w-4xl mx-auto text-center">

        {/* Main headline */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-6">
            Ready to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-blush">
              Fill Your Calendar?
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-4">
            Join Med Spas in Miami, LA, Dallas, and NYC who never miss a booking again.
          </p>
          <p className="text-lg text-blush font-medium italic max-w-2xl mx-auto mb-3">
            &ldquo;Game-changer! Our virtual receptionist captured 40% more leads in the first month.&rdquo;
          </p>
          <p className="text-sm text-text-tertiary mb-2">
            — Sarah Martinez, Beverly Hills Aesthetics
          </p>
          <div className="inline-flex items-center space-x-2 bg-blush/10 text-blush px-4 py-2 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-blush rounded-full animate-pulse"></span>
            <span>Limited spots remaining for January setup</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mb-12">
          <CTAButtons
            variant="large"
            className="flex-col sm:flex-row justify-center"
            primaryText="Hire Now - Full Setup"
            secondaryText="Try 14-Day Pilot"
          />
        </div>

        {/* Trust signals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-teal to-blush rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Setup in 3 Days</h3>
            <p className="text-text-secondary text-sm">Fast implementation with zero technical work required</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-teal to-blush rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Cancel Anytime</h3>
            <p className="text-text-secondary text-sm">No long-term contracts or hidden fees</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-teal to-blush rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Guaranteed Results</h3>
            <p className="text-text-secondary text-sm">More bookings or your money back</p>
          </div>
        </div>

        {/* Final trust line */}
        <div className="border-t border-border-light pt-8">
          <p className="text-text-secondary">
            <span className="inline-flex items-center mr-4">
              <span className="w-2 h-2 bg-status-success rounded-full mr-2 animate-pulse"></span>
              Trusted by 40+ companies worldwide
            </span>
            <span className="inline-flex items-center mr-4">
              <span className="w-2 h-2 bg-status-success rounded-full mr-2 animate-pulse"></span>
              50,000+ Leads Captured
            </span>
            <span className="inline-flex items-center">
              <span className="w-2 h-2 bg-status-success rounded-full mr-2 animate-pulse"></span>
              85% Average Conversion Rate
            </span>
          </p>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blush/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal/3 rounded-full blur-2xl"></div>
        </div>
      </div>
    </section>
  );
}
