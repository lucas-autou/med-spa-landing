/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { isDemoMode, createDemoCheckoutSession, showDemoNotification } from '@/lib/demo';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function CheckoutPilotPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [wasCanceled, setWasCanceled] = useState(false);

  useEffect(() => {
    // Only access searchParams on client side
    const params = new URLSearchParams(window.location.search);
    setWasCanceled(params.get('canceled') === 'true');
    trackEvent('checkout_page_view', { plan_type: 'PILOT' });
    showDemoNotification();
  }, []);

  const createCheckoutSession = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Use demo mode for development
      if (isDemoMode()) {
        const { url } = await createDemoCheckoutSession('PILOT');
        window.location.href = url;
        return;
      }

      // Real Stripe checkout for production
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: 'PILOT',
          successUrl: `${window.location.origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/checkout-pilot?canceled=true`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const { loadStripe } = await import('@stripe/stripe-js');
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          throw new Error(error.message);
        }
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // wasCanceled state is now managed above

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary to-background-secondary flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto">
        
        {wasCanceled && (
          <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-center">
              Checkout was canceled. Ready to try the pilot?
            </p>
          </div>
        )}

        <div className="bg-background-primary border border-borders-card rounded-2xl p-8 text-center shadow-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-4">
              Start Your 14-Day Pilot
            </h1>
            <p className="text-text-secondary text-lg">
              Test everything risk-free with full setup included
            </p>
          </div>

          {/* Plan details */}
          <div className="bg-background-secondary border border-borders-card rounded-xl p-6 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-primary">14-Day Pilot Program</span>
                <span className="text-3xl font-bold text-accent-beauty">$297</span>
              </div>
              <div className="bg-status-success/10 border border-status-success/20 rounded-lg p-3">
                <p className="text-status-success text-sm">
                  💡 Full $297 credit applied if you upgrade to the complete plan
                </p>
              </div>
              <div className="border-t border-borders-card pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-primary font-semibold">Due Today</span>
                  <span className="text-3xl font-bold text-accent-beauty">$297</span>
                </div>
                <p className="text-text-secondary text-sm mt-2">
                  One-time payment • No recurring charges
                </p>
              </div>
            </div>
          </div>

          {/* What's included */
          <div className="text-left mb-8">
            <h3 className="text-lg font-semibold text-text-primary mb-4 text-center">
              What's Included in Your Pilot:
            </h3>
            <ul className="space-y-3">
              {[
                'Complete 14-day access to all features',
                'Full setup and avatar configuration',
                'Real lead capture and testing',
                'Email and SMS notifications',
                'Performance analytics and reporting',
                'Email support throughout pilot',
                'No long-term commitment required',
                '$297 credit toward full plan if you upgrade',
              ].map((item) => (
                <li key={item} className="flex items-center">
                  <div className="w-5 h-5 bg-accent-beauty rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-text-primary">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risk-free guarantee */}
          <div className="bg-gradient-to-r from-accent-beauty/10 to-cta-primary/10 border border-accent-beauty/20 rounded-lg p-4 mb-6">
            <p className="text-text-primary font-medium">
              🛡️ Risk-Free Pilot Program
            </p>
            <p className="text-text-secondary text-sm mt-1">
              Test our virtual receptionist with your real traffic. See actual results before committing long-term.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-status-error/10 border border-status-error/20 rounded-lg">
              <p className="text-status-error">{error}</p>
            </div>
          )}

          {/* Checkout button */}
          <button
            onClick={createCheckoutSession}
            disabled={isLoading}
            className={`
              w-full py-4 px-8 text-xl font-semibold rounded-lg transition-all duration-300
              ${isLoading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-accent-beauty hover:bg-accent-beauty/90 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              }
              text-white
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Start 14-Day Pilot - $297'
            )}
          </button>

          {/* Trust indicators */}
          <div className="mt-6 flex justify-center items-center space-x-6 text-text-secondary text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-status-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secure Payment
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-status-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No Auto-Renewal
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-status-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Full Credit if Upgrade
            </div>
          </div>

          {/* Back link */}
          <div className="mt-8">
            <a 
              href="/#pricing"
              className="text-cta-primary hover:text-cta-hover font-medium"
            >
              ← Back to pricing
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}