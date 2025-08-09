/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { isDemoMode, createDemoCheckoutSession, showDemoNotification } from '@/lib/demo';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function CheckoutFullPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [wasCanceled, setWasCanceled] = useState(false);

  useEffect(() => {
    // Only access searchParams on client side
    const params = new URLSearchParams(window.location.search);
    setWasCanceled(params.get('canceled') === 'true');
    trackEvent('checkout_page_view', { plan_type: 'FULL' });
    showDemoNotification();
  }, []);

  const createCheckoutSession = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Use demo mode for development
      if (isDemoMode()) {
        const { url } = await createDemoCheckoutSession('FULL');
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
          planType: 'FULL',
          successUrl: `${window.location.origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/checkout-full?canceled=true`,
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
              Checkout was canceled. Ready to try again?
            </p>
          </div>
        )}

        <div className="bg-background-primary border border-borders-card rounded-2xl p-8 text-center shadow-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-4">
              Complete Your Full Setup
            </h1>
            <p className="text-text-secondary text-lg">
              Get your virtual receptionist up and running in 72 hours
            </p>
          </div>

          {/* Plan details */}
          <div className="bg-background-secondary border border-borders-card rounded-xl p-6 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-primary">Setup Fee (One-time)</span>
                <span className="text-2xl font-bold text-cta-primary">$997</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-primary">Monthly Service</span>
                <span className="text-xl font-semibold text-text-primary">$97/mo</span>
              </div>
              <div className="border-t border-borders-card pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-primary font-semibold">Due Today</span>
                  <span className="text-3xl font-bold text-cta-primary">$997</span>
                </div>
                <p className="text-text-secondary text-sm mt-2">
                  Monthly billing starts after setup completion
                </p>
              </div>
            </div>
          </div>

          {/* What's included */}
          <div className="text-left mb-8">
            <h3 className="text-lg font-semibold text-text-primary mb-4 text-center">
              What's Included:
            </h3>
            <ul className="space-y-3">
              {[
                'Custom avatar configuration for your Med Spa',
                'Professional script optimization',
                'Unlimited lead capture (24/7)',
                'Email + SMS instant notifications',
                'Priority setup (72-hour guarantee)',
                'Ongoing support and maintenance',
                'All premium features unlocked',
                'Cancel subscription anytime',
              ].map((item) => (
                <li key={item} className="flex items-center">
                  <div className="w-5 h-5 bg-cta-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-text-primary">{item}</span>
                </li>
              ))}
            </ul>
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
                : 'bg-cta-primary hover:bg-cta-hover shadow-cta hover:shadow-xl transform hover:-translate-y-1'
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
              'Proceed to Secure Checkout'
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
              SSL Encrypted
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-status-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Money Back Guarantee
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