import Stripe from 'stripe';
import { config } from './config';

// Only initialize Stripe if the secret key exists (for runtime)
export const stripe = config.stripe.secretKey 
  ? new Stripe(config.stripe.secretKey, {
      apiVersion: '2024-06-20',
    })
  : null;

export type CheckoutParams = {
  planType: 'FULL' | 'PILOT';
  customerEmail?: string;
  customerName?: string;
  successUrl: string;
  cancelUrl: string;
  leadData?: any;
};

/**
 * Create a Stripe Checkout session for Med Spa plans
 */
export async function createCheckoutSession({
  planType,
  customerEmail,
  customerName,
  successUrl,
  cancelUrl,
  leadData,
}: CheckoutParams): Promise<Stripe.Checkout.Session> {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  
  const isFullPlan = planType === 'FULL';
  
  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: isFullPlan ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      
      // Customer info
      ...(customerEmail && { customer_email: customerEmail }),
      
      // Metadata for tracking
      metadata: {
        plan_type: planType,
        lead_data: leadData ? JSON.stringify(leadData) : '',
        customer_name: customerName || '',
      },

      // Line items based on plan type
      line_items: isFullPlan ? [
        // Setup fee
        {
          price_data: {
            currency: 'usd',
            unit_amount: config.pricing.full.setupFee * 100, // $997
            product_data: {
              name: 'Med Spa Virtual Receptionist - Setup Fee',
              description: 'One-time setup and configuration of your virtual receptionist',
              images: [], // Add product images if available
            },
          },
          quantity: 1,
        },
        // Monthly subscription
        {
          price: config.stripe.prices.subscription,
          quantity: 1,
        },
      ] : [
        // Pilot one-time payment
        {
          price_data: {
            currency: 'usd',
            unit_amount: config.pricing.pilot.price * 100, // $297
            product_data: {
              name: '14-Day Med Spa Virtual Receptionist Pilot',
              description: 'Full access pilot program with setup and configuration',
            },
          },
          quantity: 1,
        },
      ],
    };

    // Additional subscription-specific settings
    if (isFullPlan) {
      sessionParams.subscription_data = {
        metadata: {
          plan_type: planType,
          setup_completed: 'false',
        },
        trial_period_days: 0, // No trial period
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    
    return session;
    
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

/**
 * Retrieve a checkout session by ID
 */
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
  if (!stripe) return null;
  
  try {
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return null;
  }
}

/**
 * Verify webhook signature for security
 */
export function verifyWebhookSignature(payload: string, signature: string): Stripe.Event {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  
  try {
    return stripe.webhooks.constructEvent(payload, signature, config.stripe.webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw new Error('Invalid webhook signature');
  }
}

/**
 * Create a customer in Stripe
 */
export async function createStripeCustomer(email: string, name?: string, phone?: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  
  try {
    return await stripe.customers.create({
      email,
      name,
      phone,
      metadata: {
        source: 'med_spa_landing',
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
  if (!stripe) return null;
  
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    return null;
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true): Promise<Stripe.Subscription> {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  
  try {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: cancelAtPeriodEnd,
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}