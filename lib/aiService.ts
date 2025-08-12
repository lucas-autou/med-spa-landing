import OpenAI from 'openai';
import { detectSafetyFlags, generateSafetyResponse } from './safetyDetection';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIResponse {
  response: string;
  spokenResponse?: string;  // Short version for TTS
  chips?: string[];
  requiresConsult?: boolean;
  safetyFlags?: string[];
  confidence?: number;
  followUpAction?: 'booking' | 'pricing' | 'consult' | 'none';
}

// Natural conversation system prompt - Sarah leads naturally
const SYSTEM_PROMPT = `You're Sarah, a virtual receptionist AI. You serve two types of users:

1. MED SPA CLIENTS (DEFAULT): People wanting treatments at Glow Med Spa
2. BUSINESS OWNERS: Med spa owners interested in getting Sarah for their business

USER IDENTIFICATION:
- DEFAULT: Assume they're a spa client wanting treatments unless clear signals otherwise
- Business signals: "for my spa", "for my business", "I own a", "my clients", "my patients", "how does Sarah work", "pricing for Sarah", "setup", "integration", "pilot program"
- Spa client signals: "I want", "book me", "when can I", "do you offer", asking about specific treatments

FOR SPA CLIENTS:
SERVICES: Botox $12-15/unit • Fillers $650-1200 • Laser $150-800 • Facials $150-400
HOURS: Mon-Sat 9am-7pm (Closed Sun)
APPROACH: Guide them naturally toward booking treatments

FOR BUSINESS OWNERS:
OFFER: 14-day pilot for $297 (credited to monthly plan) • $199/month after
SETUP: Live in 48-72 hours • Works with Vagaro, Boulevard, Square, Calendly
VALUE: Never miss bookings, 24/7 availability, HIPAA-ready
APPROACH: Show how Sarah helps their business, mention pilot program when appropriate

CONVERSATION STYLE:
- Be natural and conversational
- Listen first, then guide appropriately
- Don't be pushy about either service
- If unsure, ask a clarifying question: "Are you looking to book a treatment, or are you interested in Sarah for your med spa?"
- Keep responses concise when possible for better voice interaction
- For complex information (prices, lists, schedules), provide complete details but structure them clearly

Remember: Most users are spa clients by default. Only switch to business owner mode with clear signals.`;

// Function to generate contextual chips based on conversation (max 3 chips)
function generateContextualChips(response: string, intent?: string): string[] {
  const lowerResponse = response.toLowerCase();

  // Business owner chips - when discussing Sarah for their business
  if (lowerResponse.includes('pilot') || lowerResponse.includes('your business') || 
      lowerResponse.includes('your med spa') || lowerResponse.includes('setup') ||
      lowerResponse.includes('integration') || lowerResponse.includes('48 hours') ||
      lowerResponse.includes('72 hours')) {
    return ['Start pilot program', 'How does it work?', 'See pricing'];
  }

  // Business owner interested in features
  if (lowerResponse.includes('hipaa') || lowerResponse.includes('vagaro') || 
      lowerResponse.includes('boulevard') || lowerResponse.includes('square') ||
      lowerResponse.includes('calendly')) {
    return ['Try 14-day pilot', 'Setup process', 'Monthly pricing'];
  }

  // Booking-related chips (spa clients)
  if (lowerResponse.includes('book') || lowerResponse.includes('appointment') || 
      lowerResponse.includes('schedule') || lowerResponse.includes('confirmed')) {
    return ['Confirm booking', 'Different time', 'Ask pricing'];
  }

  // Pricing-related chips (spa clients)
  if (lowerResponse.includes('pric') || lowerResponse.includes('cost') || lowerResponse.includes('$')) {
    // Check if it's about Sarah pricing or treatment pricing
    if (lowerResponse.includes('sarah') || lowerResponse.includes('pilot') || lowerResponse.includes('monthly')) {
      return ['Start pilot - $297', 'Monthly plan - $199', 'How it works'];
    }
    return ['Book consultation', 'Compare treatments', 'Payment options'];
  }

  // Treatment-specific chips
  if (lowerResponse.includes('botox')) {
    return ['Book Botox', 'Botox pricing', 'Treatment time'];
  }

  if (lowerResponse.includes('filler')) {
    return ['Book filler', 'Filler pricing', 'Which filler'];
  }

  if (lowerResponse.includes('laser')) {
    return ['Book laser', 'Laser pricing', 'Treatment areas'];
  }

  // Consultation/specialist chips
  if (lowerResponse.includes('specialist') || lowerResponse.includes('consult')) {
    return ['Schedule consult', 'Ask question', 'See services'];
  }

  // Default chips
  return ['Book appointment', 'See pricing', 'Ask question'];
}

// Generate short spoken response for TTS
function generateSpokenResponse(fullResponse: string, userMessage: string): string | undefined {
  const lowerResponse = fullResponse.toLowerCase();
  const lowerMessage = userMessage.toLowerCase();
  
  // Check if response is already short enough (less than 80 characters)
  if (fullResponse.length < 80) {
    return undefined; // Use the same response for both
  }
  
  // Common patterns for long responses that need short versions - MORE HUMAN AND WARM
  if (lowerMessage.includes('services') || lowerMessage.includes('what do you offer')) {
    return "Oh wonderful! I'd love to tell you about all our amazing services. I'm putting together a complete list for you in the chat right now.";
  }
  
  if (lowerMessage.includes('price') && fullResponse.length > 100) {
    return "Absolutely! Let me get you all our pricing information. I'm writing it out clearly in the chat so you can review everything.";
  }
  
  if (lowerMessage.includes('hours') || lowerMessage.includes('when are you open')) {
    return "Of course! I'm sending you our complete schedule in the chat so you can see all our available hours.";
  }
  
  if (lowerResponse.includes('botox') && lowerResponse.includes('filler') && lowerResponse.includes('laser')) {
    return "Perfect! I've put together all our treatment options for you. Take a look at the chat - I've listed everything there with all the details you need.";
  }
  
  if (lowerMessage.includes('how') && lowerMessage.includes('work')) {
    return "Great question! I'm explaining everything step by step in the chat so you can see exactly how it all works.";
  }
  
  // For booking confirmations
  if (lowerResponse.includes('confirmed') || lowerResponse.includes('all set')) {
    return "Wonderful! Your appointment is all confirmed. I've put all the important details in the chat for you to reference.";
  }
  
  // For lists or multiple items
  if (fullResponse.includes('•') || fullResponse.includes('\n-') || fullResponse.split('\n').length > 3) {
    return "I've prepared all that information for you! Everything is laid out nicely in the chat so you can review it at your own pace.";
  }
  
  // Default for any long response - warmer and more personal
  if (fullResponse.length > 150) {
    return "This is a great question! I've written out a detailed response for you in the chat with all the information you need.";
  }
  
  return undefined;
}

// Determine follow-up action based on response - more sensitive to booking intent
function determineFollowUpAction(response: string): AIResponse['followUpAction'] {
  const lowerResponse = response.toLowerCase();

  // Business owner interested in pilot/setup (treat as booking for modal trigger)
  if (lowerResponse.includes('pilot program') || 
      lowerResponse.includes('get you set up') ||
      lowerResponse.includes('start with') ||
      lowerResponse.includes('14-day') ||
      lowerResponse.includes('your med spa') ||
      lowerResponse.includes('your business')) {
    return 'booking'; // This will trigger the purchase modal
  }

  // Strong booking signals (spa clients)
  if (lowerResponse.includes('check our availability') || 
      lowerResponse.includes('openings this week') || 
      lowerResponse.includes('book you') ||
      lowerResponse.includes('get you in') ||
      lowerResponse.includes('schedule')) {
    return 'booking';
  }

  // Weaker booking signals - still booking but less direct
  if (lowerResponse.includes('book') || lowerResponse.includes('appointment')) {
    return 'booking';
  }

  if (lowerResponse.includes('pric') || lowerResponse.includes('cost') || lowerResponse.includes('$')) {
    return 'pricing';
  }

  if (lowerResponse.includes('specialist') || lowerResponse.includes('consult')) {
    return 'consult';
  }

  return 'none';
}

export async function generateAIResponse(
  userMessage: string,
  conversationHistory: Array<{type: 'user' | 'ai'; text: string}> = [],
  context?: any
): Promise<AIResponse> {
  try {
    // Check for safety flags first
    const safetyFlags = detectSafetyFlags(userMessage);

    if (safetyFlags.length > 0) {
      const safetyResponse = generateSafetyResponse(safetyFlags);
      return {
        response: safetyResponse,
        chips: ['Schedule consult', 'Ask question'],
        requiresConsult: true,
        safetyFlags: safetyFlags.map(f => f.id),
        confidence: 1.0,
        followUpAction: 'consult'
      };
    }

    // Prepare conversation messages for GPT-4o-mini Chat Completions API
    const messages: any[] = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    // Add recent conversation history (last 4 messages for speed)
    const recentHistory = conversationHistory.slice(-4);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage
    });

    // Call OpenAI GPT-4o-mini Chat Completions API
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '150'),
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.3'),
    });

    // Extract response from GPT-4o-mini
    const aiResponse = response.choices[0]?.message?.content?.trim() ||
                      "I'd be happy to help! Could you tell me more about what you're interested in?";

    // Generate contextual chips and determine follow-up action
    const chips = generateContextualChips(aiResponse);
    const followUpAction = determineFollowUpAction(aiResponse);
    const spokenResponse = generateSpokenResponse(aiResponse, userMessage);

    // Calculate confidence based on response quality (simple heuristic)
    const confidence = aiResponse.length > 20 && !aiResponse.includes("I don't know") ? 0.9 : 0.7;

    return {
      response: aiResponse,
      spokenResponse,
      chips,
      requiresConsult: false,
      safetyFlags: [],
      confidence,
      followUpAction
    };

  } catch (error) {
    console.error('OpenAI GPT-4o-mini API Error:', error);

    // Fallback response if API fails
    return {
      response: "I'm having trouble connecting right now, but I'd love to help! Would you like to schedule a consultation or ask about our services?",
      chips: ['Schedule consult', 'See pricing', 'Try again'],
      requiresConsult: false,
      safetyFlags: [],
      confidence: 0.5,
      followUpAction: 'none'
    };
  }
}

// Specialized function for treatment-specific questions
export async function generateTreatmentResponse(
  treatment: string,
  question: string,
  conversationHistory: Array<{type: 'user' | 'ai'; text: string}> = []
): Promise<AIResponse> {
  return generateAIResponse(
    `About ${treatment}: ${question}`,
    conversationHistory,
    { treatment, specializedQuery: true }
  );
}

// Function to generate booking-focused responses
export async function generateBookingResponse(
  userMessage: string,
  bookingContext: any,
  conversationHistory: Array<{type: 'user' | 'ai'; text: string}> = []
): Promise<AIResponse> {
  const contextPrompt = `User is in booking mode. ${bookingContext.service ? `They're interested in ${bookingContext.service}.` : ''} ${bookingContext.timeframe ? `They prefer ${bookingContext.timeframe}.` : ''} Guide them through the booking process.`;

  return generateAIResponse(
    `${contextPrompt} User says: ${userMessage}`,
    conversationHistory,
    { ...bookingContext, bookingMode: true }
  );
}

// Health check function to verify GPT-4o-mini Chat Completions API is working
export async function testAIConnection(): Promise<boolean> {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 5,
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.3'),
    });

    return !!response.choices[0]?.message?.content;
  } catch (error) {
    console.error('GPT-4o-mini connection test failed:', error);
    return false;
  }
}
