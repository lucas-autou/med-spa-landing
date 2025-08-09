'use client';

import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { isDemoMode, getDemoSession } from '@/lib/demo';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function ThankYouPage() {
  const [sessionData, setSessionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Only access searchParams on client side
    const params = new URLSearchParams(window.location.search);
    const id = params.get('session_id');
    const isDemo = params.get('demo') === 'true';
    setSessionId(id);
    
    if (id) {
      // Handle demo mode
      if (isDemoMode() && isDemo) {
        const demoSession = getDemoSession(id);
        if (demoSession) {
          setSessionData(demoSession);
          
          // Track successful conversion
          const planType = demoSession.metadata?.plan_type || 'UNKNOWN';
          const amount = planType === 'FULL' ? 997 : 297;
          
          trackEvent('checkout_success', {
            plan_type: planType,
            amount,
            session_id: id,
            demo_mode: true,
          });
          
          setIsLoading(false);
          return;
        }
      }

      // Real Stripe session
      fetch('/api/checkout-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: id }),
      })
        .then(res => res.json())
        .then(data => {
          setSessionData(data.session);
          
          // Track successful conversion
          if (data.session) {
            const planType = data.session.metadata?.plan_type || 'UNKNOWN';
            const amount = planType === 'FULL' ? 997 : 297;
            
            trackEvent('checkout_success', {
              plan_type: planType,
              amount,
              session_id: id,
            });
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-primary to-background-secondary flex items-center justify-center">
        <div className="animate-pulse text-text-primary text-xl">Loading...</div>
      </div>
    );
  }

  const isFullPlan = sessionData?.metadata?.plan_type === 'FULL';
  const isPilot = sessionData?.metadata?.plan_type === 'PILOT';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary to-background-secondary flex items-center justify-center px-4">
      <div className="max-w-3xl mx-auto text-center">
        
        {/* Success Animation */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-status-success rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-background-primary border border-borders-card rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            🎉 Welcome to the Future of Med Spa Bookings!
          </h1>
          
          <p className="text-xl text-text-secondary mb-8">
            {isFullPlan && "Setup starts now — check your email in 2 minutes"}
            {isPilot && "Your 14-day pilot begins now — check your email for next steps"}
          </p>

          {/* What happens next */}
          <div className="bg-background-secondary border border-borders-card rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              What Happens Next:
            </h2>
            <div className="space-y-4 text-left">
              {isFullPlan && (
                <>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-cta-primary rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="text-text-primary font-medium">Onboarding Email (2 minutes)</h3>
                      <p className="text-text-secondary text-sm">You&apos;ll receive a detailed onboarding form to configure your virtual receptionist</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-cta-primary rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="text-text-primary font-medium">Custom Setup (24-72 hours)</h3>
                      <p className="text-text-secondary text-sm">Our team configures your avatar, scripts, and Med Spa presets</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-status-success rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="text-text-primary font-medium">Go Live! (72 hours)</h3>
                      <p className="text-text-secondary text-sm">You receive embed code and your virtual receptionist starts capturing leads</p>
                    </div>
                  </div>
                </>
              )}
              
              {isPilot && (
                <>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-accent-beauty rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="text-text-primary font-medium">Pilot Onboarding (5 minutes)</h3>
                      <p className="text-text-secondary text-sm">Quick setup form to get your pilot program configured</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-accent-beauty rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="text-text-primary font-medium">Fast Setup (24 hours)</h3>
                      <p className="text-text-secondary text-sm">Accelerated setup to maximize your 14-day testing period</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-accent-beauty rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="text-text-primary font-medium">Test Everything (14 days)</h3>
                      <p className="text-text-secondary text-sm">Full access to test lead capture, analytics, and performance</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <div className="mb-8">
            <a
              href="/onboarding"
              className="inline-block px-8 py-4 bg-cta-primary hover:bg-cta-hover text-white font-semibold text-lg rounded-lg shadow-cta transition-all duration-300 transform hover:-translate-y-1"
            >
              {isFullPlan && "Start Onboarding Now →"}
              {isPilot && "Complete Pilot Setup →"}
              {!isFullPlan && !isPilot && "Get Started →"}
            </a>
          </div>

          {/* Support Info */}
          <div className="border-t border-borders-card pt-6">
            <p className="text-text-secondary mb-4">
              Questions? Need help? Our team is here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@medspareceptionist.com"
                className="px-6 py-2 border border-cta-primary text-cta-primary hover:bg-cta-primary hover:text-white rounded-lg transition-colors"
              >
                📧 Email Support
              </a>
              <a
                href="#"
                className="px-6 py-2 border border-cta-primary text-cta-primary hover:bg-cta-primary hover:text-white rounded-lg transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Live chat coming soon! Please use email for now.');
                }}
              >
                💬 Live Chat
              </a>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-8 p-4 bg-gradient-to-r from-cta-primary/10 to-accent-beauty/10 rounded-lg">
            <p className="text-text-primary font-medium mb-2">
              🚀 You&apos;re joining 200+ Med Spas already using our virtual receptionist
            </p>
            <p className="text-text-secondary text-sm">
              Average increase: 3x more bookings, 85% conversion rate
            </p>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-cta-primary rounded-full animate-bounce delay-1000 opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-accent-beauty rounded-full animate-bounce delay-500 opacity-20"></div>
      </div>
    </div>
  );
}