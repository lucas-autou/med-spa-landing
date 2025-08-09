/**
 * Demo mode utilities for local development
 */

export const isDemoMode = () => {
  return process.env.NODE_ENV === 'development' || 
         process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
};

/**
 * Simulate a successful checkout in demo mode
 */
export const createDemoCheckoutSession = async (planType: 'FULL' | 'PILOT') => {
  if (!isDemoMode()) {
    throw new Error('Demo mode not enabled');
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Create mock session
  const sessionId = `cs_demo_${Date.now()}_${planType.toLowerCase()}`;
  
  // Store demo session data in localStorage for thank you page
  const demoSession = {
    id: sessionId,
    payment_status: 'paid',
    customer_details: {
      email: 'demo@example.com',
      name: 'Demo Customer'
    },
    metadata: {
      plan_type: planType
    },
    amount_total: planType === 'FULL' ? 99700 : 29700, // in cents
    created: Math.floor(Date.now() / 1000)
  };
  
  localStorage.setItem(`demo_session_${sessionId}`, JSON.stringify(demoSession));
  
  return {
    sessionId,
    url: `/thank-you?session_id=${sessionId}&demo=true`
  };
};

/**
 * Get demo session data
 */
export const getDemoSession = (sessionId: string) => {
  if (!isDemoMode() || typeof window === 'undefined') {
    return null;
  }
  
  const stored = localStorage.getItem(`demo_session_${sessionId}`);
  return stored ? JSON.parse(stored) : null;
};

/**
 * Demo notification system
 */
export const showDemoNotification = () => {
  if (!isDemoMode()) return;
  
  console.log('🎭 Demo Mode Active');
  console.log('💡 This is a demo - no real payments will be processed');
  console.log('🔧 Set NEXT_PUBLIC_DEMO_MODE=false to disable demo mode');
};