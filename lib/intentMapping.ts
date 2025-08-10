// Intent mapping system for interactive demo
// Simple keyword-based NLU without external APIs

export type Intent = 
  | 'book_appointment' 
  | 'pricing' 
  | 'reschedule' 
  | 'availability'
  | 'faq_general'
  | 'contraindications'
  | 'services'
  | 'unknown';

export type Service = 'botox' | 'fillers' | 'laser' | 'facials' | 'other';

export interface IntentResult {
  intent: Intent;
  confidence: number;
  entities?: {
    service?: Service;
    timeframe?: string;
    concern?: string;
  };
  response: string;
  chips?: string[];
  requiresClarification?: boolean;
  safetyFlag?: boolean;
  useAI?: boolean;
}

// Contraindication keywords that trigger safety checks
const CONTRAINDICATION_KEYWORDS = [
  'pregnant', 'pregnancy', 'breastfeeding', 'nursing',
  'myasthenia', 'autoimmune', 'muscle disease', 
  'allergic', 'allergy', 'reaction', 'rash',
  'botulism', 'blood thinner', 'warfarin'
];

// Service keywords
const SERVICE_KEYWORDS = {
  botox: ['botox', 'wrinkles', 'lines', 'forehead', 'crows feet', 'frown lines'],
  fillers: ['fillers', 'lips', 'cheeks', 'volume', 'juvederm', 'restylane'],
  laser: ['laser', 'hair removal', 'skin resurfacing', 'pigmentation', 'acne scars'],
  facials: ['facial', 'hydrafacial', 'chemical peel', 'microneedling', 'skincare']
};

// Intent patterns with keywords and phrases
const INTENT_PATTERNS = {
  book_appointment: [
    'book', 'schedule', 'appointment', 'slot', 'available', 'when can i',
    'reserve', 'make appointment', 'book me', 'schedule me'
  ],
  pricing: [
    'price', 'cost', 'how much', 'pricing', 'fees', 'rates', 
    'expensive', 'charge', 'payment', 'money'
  ],
  reschedule: [
    'reschedule', 'change', 'move', 'different time', 'cancel',
    'switch', 'modify', 'update'
  ],
  availability: [
    'available', 'open', 'free', 'slots', 'times', 'when',
    'today', 'tomorrow', 'this week', 'next week'
  ],
  faq_general: [
    'how long', 'how does', 'what is', 'tell me about', 'explain',
    'side effects', 'recovery', 'results', 'duration'
  ]
};

// Response templates
const RESPONSES = {
  book_appointment: {
    default: "Perfect! I'd love to help you book an appointment. What treatment are you interested in?",
    chips: ['Botox', 'Fillers', 'Laser', 'Facials', 'Other']
  },
  pricing: {
    default: "I can definitely help with pricing! What service are you considering?",
    chips: ['Botox pricing', 'Filler pricing', 'Laser pricing', 'Facial pricing']
  },
  reschedule: {
    default: "I can help you reschedule. Do you have an existing appointment with us?",
    chips: ['Yes, reschedule existing', 'No, book new appointment']
  },
  availability: {
    default: "Let me check our availability! What treatment are you looking for?",
    chips: ['Botox', 'Fillers', 'Laser', 'Facials']
  },
  faq_general: {
    default: "I'm happy to answer your questions! What would you like to know more about?",
    chips: ['Treatment info', 'Pricing', 'Book appointment', 'Recovery time']
  },
  contraindications: {
    default: "I'd love to connect you with our specialist for a quick consult. They'll ensure the perfect treatment plan for you.",
    chips: ['Schedule specialist consult', 'Ask a different question'],
    safetyFlag: true
  },
  services: {
    default: "We offer a variety of treatments! Which service interests you?",
    chips: ['Botox', 'Fillers', 'Laser', 'Facials', 'See all services']
  },
  unknown: {
    default: "I want to make sure I understand correctly. Are you interested in:",
    chips: ['Booking an appointment', 'Pricing information', 'Rescheduling', 'General questions']
  }
};

// Extract service from text
function extractService(text: string): Service | undefined {
  const lowerText = text.toLowerCase();
  
  for (const [service, keywords] of Object.entries(SERVICE_KEYWORDS)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return service as Service;
    }
  }
  return undefined;
}

// Check for contraindications
function checkContraindications(text: string): boolean {
  const lowerText = text.toLowerCase();
  return CONTRAINDICATION_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

// Calculate intent confidence based on keyword matches
function calculateConfidence(text: string, patterns: string[]): number {
  const lowerText = text.toLowerCase();
  const matches = patterns.filter(pattern => lowerText.includes(pattern));
  return Math.min(matches.length / patterns.length + 0.3, 1.0);
}

// Enhanced classification that supports AI fallback
export function classifyIntent(userInput: string): IntentResult {
  const text = userInput.toLowerCase().trim();
  
  // Check for contraindications first (safety priority)
  if (checkContraindications(text)) {
    return {
      intent: 'contraindications',
      confidence: 1.0,
      response: RESPONSES.contraindications.default,
      chips: RESPONSES.contraindications.chips,
      safetyFlag: true
    };
  }

  // Extract entities
  const service = extractService(text);
  
  // Calculate confidence for each intent
  let bestIntent: Intent = 'unknown';
  let bestConfidence = 0;
  
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    const confidence = calculateConfidence(text, patterns);
    if (confidence > bestConfidence && confidence > 0.3) {
      bestIntent = intent as Intent;
      bestConfidence = confidence;
    }
  }

  // If confidence is very low, suggest AI fallback
  if (bestConfidence < 0.4) {
    return {
      intent: 'unknown',
      confidence: bestConfidence,
      entities: { service },
      response: "Let me connect you with our AI assistant for a more detailed response!",
      chips: ['Ask AI assistant', 'Book appointment', 'See pricing', 'General questions'],
      requiresClarification: true,
      safetyFlag: false,
      useAI: true // Flag to indicate AI should be used
    };
  }

  // Get response template
  const responseTemplate = RESPONSES[bestIntent] || RESPONSES.unknown;
  
  // Customize response based on detected service
  let response = responseTemplate.default;
  let chips = responseTemplate.chips || [];
  
  if (service && bestIntent === 'book_appointment') {
    response = `Great! I see you're interested in ${service}. When would work best for you?`;
    chips = ['This week', 'Next week', 'I&apos;m flexible', 'Ask about timing'];
  }
  
  if (service && bestIntent === 'pricing') {
    response = `For ${service}, our pricing varies based on the specific treatment area. I'd be happy to give you exact pricing!`;
    chips = ['Get exact pricing', 'Book consultation', 'See all services'];
  }

  return {
    intent: bestIntent,
    confidence: bestConfidence,
    entities: { service },
    response,
    chips,
    requiresClarification: bestConfidence < 0.6,
    safetyFlag: false
  };
}

// Predefined responses for common service-specific questions
export const SERVICE_RESPONSES = {
  botox: {
    pricing: "Botox typically ranges from $10-15 per unit. Most treatments use 20-50 units. Would you like to book a consultation for exact pricing?",
    duration: "Botox results last 3-4 months on average. The treatment itself takes about 10-15 minutes.",
    recovery: "Minimal downtime! You can return to normal activities immediately, just avoid laying down for 4 hours."
  },
  fillers: {
    pricing: "Dermal fillers range from $600-1200 per syringe depending on the product and area. Consultations include exact pricing.",
    duration: "Filler results last 6-18 months depending on the type and placement. Treatment takes 15-30 minutes.",
    recovery: "Some swelling and bruising is normal for 1-3 days. Most return to work the same day."
  },
  laser: {
    pricing: "Laser treatments vary widely ($100-800+ per session) based on the area and type. Let's discuss your specific needs!",
    duration: "Results build over 2-6 treatments. Individual sessions are 15-60 minutes depending on the area.",
    recovery: "Recovery varies by treatment intensity, from no downtime to 1-2 weeks for deeper treatments."
  }
};

// Handle follow-up questions within a conversation context
export function handleFollowUp(previousIntent: Intent, userInput: string, context?: any): IntentResult {
  // This can be enhanced to maintain conversation context
  // For now, we'll use the main classification with context hints
  
  const result = classifyIntent(userInput);
  
  // If we're in a booking flow and user gives a time preference
  if (previousIntent === 'book_appointment' && context?.step === 'time_selection') {
    if (userInput.toLowerCase().includes('this week')) {
      return {
        intent: 'availability',
        confidence: 0.9,
        response: "Perfect! I have Thursday 2:30 or Friday 5:10 available this week. Any allergies to neuromodulators?",
        chips: ['Thursday 2:30', 'Friday 5:10', 'No allergies', 'Yes, I have allergies']
      };
    }
  }
  
  return result;
}

// Quick responses for common chip interactions
export const QUICK_RESPONSES = {
  'Book a slot': {
    response: "Perfect! What treatment are you interested in?",
    chips: ['Botox', 'Fillers', 'Laser', 'Facials', 'Other']
  },
  'Pricing': {
    response: "I'd be happy to help with pricing! What service are you considering?",
    chips: ['Botox pricing', 'Filler pricing', 'Laser pricing', 'General pricing']
  },
  'Reschedule': {
    response: "I can help you reschedule. Do you have an existing appointment?",
    chips: ['Yes, existing appointment', 'No, new appointment', 'Check availability']
  },
  'Ask a question': {
    response: "What would you like to know? I'm here to help!",
    chips: ['Treatment info', 'Recovery time', 'Side effects', 'Preparation']
  }
};