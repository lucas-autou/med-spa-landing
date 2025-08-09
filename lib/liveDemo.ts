// Live demo state machine for deterministic booking simulation
// Handles 4 intents: book_botox, pricing, reschedule, faq

import { 
  Intent, 
  classifyIntent, 
  detectContraindications 
} from './nluShim';
import { 
  getDemoSlots, 
  simulateBooking, 
  getMockExistingBooking,
  getRescheduleOptions,
  isValidName,
  isValidPhone,
  type TimeSlot,
  type BookingData 
} from './mockCalendar';

export type DemoState = 
  | 'idle' 
  | 'greeting' 
  | 'intent_detection'
  | 'botox_allergy_check'
  | 'botox_slot_selection' 
  | 'botox_contact_collection'
  | 'botox_confirmation'
  | 'pricing_response'
  | 'reschedule_options'
  | 'reschedule_confirmation'
  | 'faq_response'
  | 'booking_success'
  | 'contraindication_warning'
  | 'clarification_needed';

export interface DemoMessage {
  id: string;
  type: 'ai' | 'user';
  text: string;
  timestamp: number;
  chips?: string[];
  requiresInput?: 'name' | 'phone';
  cards?: Array<{
    type: 'status' | 'info';
    text: string;
    icon?: string;
  }>;
}

export interface LiveDemoStore {
  state: DemoState;
  intent: Intent | null;
  messages: DemoMessage[];
  selectedSlot: TimeSlot | null;
  bookingData: Partial<BookingData>;
  isVoiceMode: boolean;
  isListening: boolean;
  currentInput: string;
  lastUserMessage: string;
}

// FAQ responses
const FAQ_RESPONSES = {
  prep: "Avoid alcohol 24 hours before; no blood thinners day-of without MD guidance. Come with clean skin.",
  pain: "Mild discomfort; quick pinches. We offer numbing cream on request.",
  downtime: "Minimal downtime; tiny marks fade in 15–30 minutes. Full results in 3–5 days.",
  policy: "$25 no-show fee; 3-hour notice required to avoid it.",
  duration: "Results last 3–4 months on average. Touch-ups available.",
  safety: "Very safe when done professionally. Rare side effects include temporary bruising or headache."
};

// Generate unique message ID
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// Create AI message
function createAIMessage(
  text: string, 
  chips?: string[], 
  cards?: DemoMessage['cards'],
  requiresInput?: 'name' | 'phone'
): DemoMessage {
  return {
    id: generateMessageId(),
    type: 'ai',
    text,
    timestamp: Date.now(),
    chips,
    cards,
    requiresInput
  };
}

// Create user message
function createUserMessage(text: string): DemoMessage {
  return {
    id: generateMessageId(),
    type: 'user',
    text,
    timestamp: Date.now()
  };
}

export class LiveDemoStateMachine {
  private state: DemoState = 'idle';
  private messages: DemoMessage[] = [];
  private intent: Intent | null = null;
  private selectedSlot: TimeSlot | null = null;
  private bookingData: Partial<BookingData> = {};
  private lastUserMessage = '';

  constructor() {
    this.init();
  }

  private init() {
    // Start with greeting
    this.state = 'greeting';
    this.messages = [
      createAIMessage(
        "Hi! I can help you book Botox, check pricing, or reschedule. What do you need?",
        ["Book a Botox slot", "Pricing", "Reschedule", "Ask a question"]
      )
    ];
  }

  // Process user input (text or chip selection)
  processInput(input: string, isChipSelection = false): DemoMessage[] {
    this.lastUserMessage = input;
    
    // Add user message
    this.messages.push(createUserMessage(input));

    // Handle based on current state
    switch (this.state) {
      case 'greeting':
      case 'intent_detection':
        return this.handleIntentDetection(input, isChipSelection);
      
      case 'botox_allergy_check':
        return this.handleAllergyCheck(input);
      
      case 'botox_slot_selection':
        return this.handleSlotSelection(input);
      
      case 'botox_contact_collection':
        return this.handleContactCollection(input);
      
      case 'pricing_response':
        return this.handlePricingFollowup(input);
      
      case 'reschedule_options':
        return this.handleRescheduleSelection(input);
      
      case 'faq_response':
        return this.handleFAQFollowup(input);
      
      case 'clarification_needed':
        return this.handleClarification(input);
      
      default:
        return this.messages;
    }
  }

  private handleIntentDetection(input: string, isChipSelection: boolean): DemoMessage[] {
    let intent: Intent;
    
    if (isChipSelection) {
      // Map chips to intents
      switch (input) {
        case 'Book a Botox slot':
          intent = 'book_botox';
          break;
        case 'Pricing':
          intent = 'pricing';
          break;
        case 'Reschedule':
          intent = 'reschedule';
          break;
        case 'Ask a question':
          intent = 'faq';
          break;
        default:
          intent = 'unknown';
      }
    } else {
      // Use NLU for free text
      const classification = classifyIntent(input);
      intent = classification.intent;
      
      // Check for contraindications
      if (detectContraindications(input)) {
        return this.handleContraindication();
      }
    }

    this.intent = intent;

    switch (intent) {
      case 'book_botox':
        return this.startBotoxBooking();
      case 'pricing':
        return this.showPricing();
      case 'reschedule':
        return this.showRescheduleOptions();
      case 'faq':
        return this.handleFAQ(input);
      default:
        return this.requestClarification();
    }
  }

  private startBotoxBooking(): DemoMessage[] {
    this.state = 'botox_allergy_check';
    this.messages.push(
      createAIMessage(
        "Any allergies to botulinum or neuromodulators?",
        ["No", "Yes"]
      )
    );
    return this.messages;
  }

  private handleAllergyCheck(input: string): DemoMessage[] {
    if (input.toLowerCase().includes('yes')) {
      this.state = 'contraindication_warning';
      this.messages.push(
        createAIMessage(
          "I'll need you to speak with our clinician first. Would you like to schedule a consultation instead?",
          ["Schedule consultation", "Ask a question"]
        )
      );
    } else {
      this.state = 'botox_slot_selection';
      const slots = getDemoSlots();
      this.messages.push(
        createAIMessage(
          `I have ${slots[0].day} ${slots[0].displayTime} or ${slots[1].displayTime}. Which works?`,
          [
            `${slots[0].day} ${slots[0].displayTime}`,
            `${slots[0].day} ${slots[1].displayTime}`
          ]
        )
      );
    }
    return this.messages;
  }

  private handleSlotSelection(input: string): DemoMessage[] {
    const slots = getDemoSlots();
    
    // Find selected slot based on input
    this.selectedSlot = slots.find(slot => 
      input.includes(slot.displayTime)
    ) || slots[0];
    
    this.state = 'botox_contact_collection';
    this.messages.push(
      createAIMessage(
        "Perfect! I'll need your first name and mobile number to confirm.",
        undefined,
        undefined,
        'name'
      )
    );
    
    return this.messages;
  }

  private handleContactCollection(input: string): DemoMessage[] {
    if (!this.bookingData.firstName) {
      // Expecting name
      if (isValidName(input)) {
        this.bookingData.firstName = input.trim();
        this.messages.push(
          createAIMessage(
            `Thanks ${this.bookingData.firstName}! What's your mobile number?`,
            undefined,
            undefined,
            'phone'
          )
        );
      } else {
        this.messages.push(
          createAIMessage(
            "Please enter your first name:",
            undefined,
            undefined,
            'name'
          )
        );
      }
    } else if (!this.bookingData.phone) {
      // Expecting phone
      if (isValidPhone(input)) {
        this.bookingData.phone = input.trim();
        return this.confirmBooking();
      } else {
        this.messages.push(
          createAIMessage(
            "Please enter a valid 10-digit phone number:",
            undefined,
            undefined,
            'phone'
          )
        );
      }
    }
    
    return this.messages;
  }

  private confirmBooking(): DemoMessage[] {
    this.state = 'booking_success';
    
    // Simulate booking (remove async since we don't need real network call)
    if (this.selectedSlot && this.bookingData.firstName && this.bookingData.phone) {
      this.messages.push(
        createAIMessage(
          `You're booked for ${this.selectedSlot.day} ${this.selectedSlot.displayTime}. I texted prep info and our no-show policy.`,
          undefined,
          [
            { type: 'status', text: 'Added to Calendar', icon: '📅' },
            { type: 'status', text: 'SMS sent', icon: '📱' },
            { type: 'status', text: 'Policy confirmed', icon: '✓' }
          ]
        )
      );
      
      this.messages.push(
        createAIMessage(
          "I handle this 24/7 so you never miss a booking. Want to activate this for your spa?",
          ["Start 14-Day Pilot — $297", "Learn more"]
        )
      );
    }
    
    return this.messages;
  }

  private showPricing(): DemoMessage[] {
    this.state = 'pricing_response';
    this.messages.push(
      createAIMessage(
        "Botox starts at $12/unit; average treatment $240–400. New clients get a quick consult first. Want to see this week's openings?",
        ["See openings", "Ask another question"]
      )
    );
    return this.messages;
  }

  private handlePricingFollowup(input: string): DemoMessage[] {
    if (input.includes('See openings')) {
      this.intent = 'book_botox';
      return this.startBotoxBooking();
    } else {
      this.state = 'intent_detection';
      this.messages.push(
        createAIMessage(
          "What else can I help with?",
          ["Book a Botox slot", "Reschedule", "Ask a question"]
        )
      );
    }
    return this.messages;
  }

  private showRescheduleOptions(): DemoMessage[] {
    this.state = 'reschedule_options';
    const existingBooking = getMockExistingBooking();
    const newOptions = getRescheduleOptions(existingBooking.slot.id);
    
    this.messages.push(
      createAIMessage(
        `Found your visit for ${existingBooking.slot.day} ${existingBooking.slot.displayTime}. New time?`,
        newOptions.map(slot => `${slot.day} ${slot.displayTime}`)
      )
    );
    
    return this.messages;
  }

  private handleRescheduleSelection(input: string): DemoMessage[] {
    this.state = 'booking_success';
    this.messages.push(
      createAIMessage(
        "Perfect! Your appointment has been moved. Confirmation sent to your phone.",
        undefined,
        [
          { type: 'status', text: 'Calendar updated', icon: '📅' },
          { type: 'status', text: 'SMS sent', icon: '📱' },
          { type: 'status', text: 'Confirmed', icon: '✓' }
        ]
      )
    );
    
    this.messages.push(
      createAIMessage(
        "I'm here 24/7 for any changes. Want this for your spa?",
        ["Start 14-Day Pilot — $297", "Learn more"]
      )
    );
    
    return this.messages;
  }

  private handleFAQ(input: string): DemoMessage[] {
    this.state = 'faq_response';
    
    // Simple keyword matching for demo
    let response = FAQ_RESPONSES.safety; // default
    
    if (input.includes('prep') || input.includes('before')) {
      response = FAQ_RESPONSES.prep;
    } else if (input.includes('pain') || input.includes('hurt')) {
      response = FAQ_RESPONSES.pain;
    } else if (input.includes('downtime') || input.includes('after')) {
      response = FAQ_RESPONSES.downtime;
    } else if (input.includes('policy') || input.includes('cancel')) {
      response = FAQ_RESPONSES.policy;
    } else if (input.includes('long') || input.includes('duration')) {
      response = FAQ_RESPONSES.duration;
    }
    
    this.messages.push(
      createAIMessage(
        response,
        ["Book a slot", "Ask another question", "Pricing"]
      )
    );
    
    return this.messages;
  }

  private handleFAQFollowup(input: string): DemoMessage[] {
    if (input.includes('Book a slot')) {
      this.intent = 'book_botox';
      return this.startBotoxBooking();
    } else if (input.includes('Pricing')) {
      this.intent = 'pricing';
      return this.showPricing();
    } else {
      this.state = 'intent_detection';
      this.messages.push(
        createAIMessage(
          "What else can I help with?",
          ["Book a Botox slot", "Pricing", "Reschedule"]
        )
      );
    }
    return this.messages;
  }

  private handleContraindication(): DemoMessage[] {
    this.state = 'contraindication_warning';
    this.messages.push(
      createAIMessage(
        "I recommend speaking with our clinician first about your specific situation. Would you like to schedule a consultation?",
        ["Schedule consultation", "Ask about safety", "Talk to human"]
      )
    );
    return this.messages;
  }

  private requestClarification(): DemoMessage[] {
    this.state = 'clarification_needed';
    this.messages.push(
      createAIMessage(
        "I can help you book Botox, check pricing, reschedule, or answer questions. Which interests you?",
        ["Book a Botox slot", "Pricing", "Reschedule", "Ask a question"]
      )
    );
    return this.messages;
  }

  private handleClarification(input: string): DemoMessage[] {
    this.state = 'intent_detection';
    return this.handleIntentDetection(input, false);
  }

  // Getters
  getState(): DemoState {
    return this.state;
  }

  getMessages(): DemoMessage[] {
    return this.messages;
  }

  getCurrentIntent(): Intent | null {
    return this.intent;
  }

  isBookingComplete(): boolean {
    return this.state === 'booking_success';
  }

  // Reset demo
  reset(): void {
    this.state = 'idle';
    this.messages = [];
    this.intent = null;
    this.selectedSlot = null;
    this.bookingData = {};
    this.lastUserMessage = '';
    this.init();
  }
}

// Singleton instance for the demo
export const liveDemoInstance = new LiveDemoStateMachine();