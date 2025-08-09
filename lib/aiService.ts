import OpenAI from 'openai';
import { detectSafetyFlags, generateSafetyResponse } from './safetyDetection';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIResponse {
  response: string;
  chips?: string[];
  requiresConsult?: boolean;
  safetyFlags?: string[];
  confidence?: number;
  followUpAction?: 'booking' | 'pricing' | 'consult' | 'none';
}

// Natural conversation system prompt - Sarah leads naturally
const SYSTEM_PROMPT = `You're Sarah, a med spa virtual receptionist. Lead conversations naturally and personally.

SERVICES: Botox $12-15/unit • Fillers $650-1200 • Laser $150-800 • Facials $150-400
HOURS: Mon-Sat 9am-7pm (Closed Sun)

YOUR ROLE: Guide patients naturally toward booking when appropriate. Don't be pushy.

CONVERSATION FLOW:
1. Listen and understand what they need
2. Provide helpful information 
3. When they show booking interest, offer specific times
4. Only suggest booking when it feels natural

BOOKING DETECTION:
- "I want to..." → Show interest in booking
- "When can I..." → Ready to schedule
- "How much..." followed by interest → Potential booking

NATURAL BOOKING APPROACH:
- After answering treatment questions: "Would you like me to check our availability?"
- After pricing: "I have some openings this week if you'd like to book."
- When they ask timing: "I can get you in Tuesday at 2pm or Thursday at 4pm."

Be conversational, helpful, and let booking happen naturally through dialogue.`;

// Function to generate contextual chips based on conversation (max 3 chips)
function generateContextualChips(response: string, intent?: string): string[] {
  const lowerResponse = response.toLowerCase();

  // Booking-related chips
  if (lowerResponse.includes('book') || lowerResponse.includes('appointment') || lowerResponse.includes('schedule') || lowerResponse.includes('confirmed')) {
    return ['Confirm booking', 'Different time', 'Ask pricing'];
  }

  // Pricing-related chips
  if (lowerResponse.includes('pric') || lowerResponse.includes('cost') || lowerResponse.includes('$')) {
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

// Determine follow-up action based on response - more sensitive to booking intent
function determineFollowUpAction(response: string): AIResponse['followUpAction'] {
  const lowerResponse = response.toLowerCase();

  // Strong booking signals
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

    // Calculate confidence based on response quality (simple heuristic)
    const confidence = aiResponse.length > 20 && !aiResponse.includes("I don't know") ? 0.9 : 0.7;

    return {
      response: aiResponse,
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
