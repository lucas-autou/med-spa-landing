'use client';

import { useEffect } from 'react';
import CTAButtons from './CTAButtons';
import { trackEvent } from '@/lib/analytics';

export default function PricingTable() {
  useEffect(() => {
    trackEvent('pricing_view');
  }, []);

  return (
    <section className="py-20 px-4" id="pricing">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-text-secondary">
            Start with a pilot or go full setup. Both include everything you need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Pilot Plan - Now shown first and marked as popular */}
          <div className="relative bg-white border-2 border-teal rounded-xl p-8 shadow-lg">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-teal text-white px-6 py-2 rounded-full text-sm font-semibold">
              Most Popular
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-text-primary mb-2">14-Day Pilot</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-teal">$297</span>
                <span className="text-text-secondary"> one-time</span>
              </div>
              <div className="mb-6">
                <span className="text-sm text-status-success font-medium bg-status-success/10 px-3 py-1 rounded-full">
                  Pilot fee credited if you continue
                </span>
              </div>
              <p className="text-text-secondary">
                Full setup to test all features
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'Complete 14-day trial access',
                'All features unlocked',
                'Real lead capture testing',
                'Setup & configuration included',
                'Email support',
                'Performance analytics',
                'No long-term commitment',
                '$297 credit toward full plan',
              ].map((feature) => (
                <li key={feature} className="flex items-center">
                  <div className="w-5 h-5 bg-teal rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-text-primary">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                trackEvent('cta_click_pilot', {
                  location: 'pricing_table',
                  plan_type: 'PILOT',
                  amount: 297
                });
                window.location.href = '/checkout-pilot';
              }}
              className="w-full px-8 py-4 text-lg bg-teal hover:bg-teal-hover text-white font-semibold rounded-lg transition-all duration-200 shadow-cta"
            >
              Start 14-Day Pilot
            </button>
          </div>

          {/* Full Setup Plan */}
          <div className="relative bg-white border border-border-light rounded-xl p-8 shadow-md">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-text-primary mb-2">Full Setup</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-text-primary">$997</span>
                <span className="text-text-secondary"> one-time</span>
              </div>
              <div className="mb-6">
                <span className="text-2xl font-semibold text-text-primary">+ $97</span>
                <span className="text-text-secondary">/month</span>
              </div>
              <p className="text-text-secondary">
                Complete setup with unlimited leads
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'Custom avatar for your brand',
                'Med Spa script optimization', 
                'Unlimited lead capture',
                'Email + SMS notifications',
                'All features included',
                '72-hour setup guarantee',
                'Priority support',
                'Calendar integration (coming soon)',
              ].map((feature) => (
                <li key={feature} className="flex items-center">
                  <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-text-primary">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                trackEvent('cta_click_full', {
                  location: 'pricing_table',
                  plan_type: 'FULL',
                  amount: 997
                });
                window.location.href = '/checkout-full';
              }}
              className="w-full px-8 py-4 text-lg bg-transparent border-2 border-border text-text-primary hover:bg-background-tertiary hover:border-teal font-semibold rounded-lg transition-all duration-200"
            >
              Book Full Setup
            </button>
          </div>
        </div>

        {/* FAQ link */}
        <div className="text-center mt-12">
          <p className="text-text-secondary mb-4">
            Questions about which plan to choose?
          </p>
          <button
            onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-teal hover:text-teal/80 font-medium"
          >
            Check out our FAQ →
          </button>
        </div>

        {/* Trust indicators */}
        <div className="flex justify-center items-center space-x-8 mt-16 text-text-secondary text-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-status-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Cancel anytime
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-status-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Secure payments
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-status-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Setup in 72h
          </div>
        </div>
      </div>
    </section>
  );
}