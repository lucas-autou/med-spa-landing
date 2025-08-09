// Analytics event tracking for Meta Pixel and GA4

declare global {
  interface Window {
    fbq: any;
    gtag: any;
  }
}

export type AnalyticsEvent = 
  | 'view_hero'
  | 'chip_select'
  | 'assistant_speak_start'
  | 'assistant_speak_end'
  | 'cta_click_pilot'
  | 'cta_click_full'
  | 'cta_click_hire_now'
  | 'lead_submitted'
  | 'checkout_started'
  | 'checkout_completed'
  | 'sticky_assistant_opened'
  | 'sticky_assistant_closed'
  | 'sticky_assistant_reopened'
  | 'hero_view'
  | 'assistant_question_shown'
  | 'chip_selected'
  | 'voice_started'
  | 'checkout_success'
  | 'checkout_page_view'
  | 'ai_chat_response'
  | 'form_submitted'
  | 'demo_auto_start'
  | 'avatar_interaction_start'
  | 'assistant_interaction_start'
  | 'pricing_view'
  | 'faq_opened'
  | 'demo_start'
  | 'demo_service'
  | 'demo_volume'
  | 'demo_booking_shown'
  | 'cta_viewed'
  | 'demo_replay'
  | 'pricing_from_demo'
  | 'freechat_opened'
  | 'intent_detected'
  | 'answer_sent'
  | 'greeting_started'
  | 'contact_request'
  | 'text_input_sent'
  | 'lead_captured'
  | 'demo_preview_service'
  | 'demo_preview_volume';

interface EventData {
  [key: string]: string | number | boolean;
}

/**
 * Track custom events to both Meta Pixel and GA4
 */
export function trackEvent(event: AnalyticsEvent, data?: EventData) {
  // Meta Pixel tracking
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      if (event === 'checkout_success') {
        window.fbq('track', 'Purchase', {
          currency: 'USD',
          value: data?.amount || 0,
          content_name: data?.plan_type || 'unknown',
        });
      } else if (event === 'cta_click_hire_now' || event === 'cta_click_pilot') {
        window.fbq('track', 'InitiateCheckout', {
          content_name: event === 'cta_click_hire_now' ? 'Full Setup' : 'Pilot',
          currency: 'USD',
          value: event === 'cta_click_hire_now' ? 997 : 297,
        });
      } else if (event === 'form_submitted') {
        window.fbq('track', 'Lead', {
          content_name: 'Onboarding Form',
        });
      } else {
        window.fbq('trackCustom', event, data);
      }
    } catch (error) {
      console.warn('Meta Pixel tracking error:', error);
    }
  }

  // GA4 tracking
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', event, {
        ...data,
        event_category: 'med_spa_interactions',
        custom_parameter: true,
      });
    } catch (error) {
      console.warn('GA4 tracking error:', error);
    }
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', { event, data });
  }
}

/**
 * Track page views
 */
export function trackPageView(path: string) {
  if (typeof window !== 'undefined') {
    // Meta Pixel
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
    
    // GA4
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: path,
      });
    }
  }
}

/**
 * Track avatar interaction events with detailed context
 */
export function trackAvatarEvent(action: string, context?: any) {
  trackEvent(action as AnalyticsEvent, {
    timestamp: Date.now(),
    user_agent: typeof window !== 'undefined' ? navigator.userAgent : '',
    ...context,
  });
}

/**
 * Track conversion events with revenue data
 */
export function trackConversion(planType: 'FULL' | 'PILOT', amount: number) {
  const eventData = {
    plan_type: planType,
    amount,
    currency: 'USD',
    timestamp: Date.now(),
  };

  trackEvent('checkout_success', eventData);
  
  // Additional conversion tracking for different platforms
  if (typeof window !== 'undefined') {
    // Enhanced ecommerce for GA4
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: `${Date.now()}-${planType}`,
        value: amount,
        currency: 'USD',
        items: [{
          item_id: planType,
          item_name: planType === 'FULL' ? 'Full Setup + Monthly' : '14-Day Pilot',
          category: 'Med Spa Service',
          quantity: 1,
          price: amount,
        }]
      });
    }
  }
}