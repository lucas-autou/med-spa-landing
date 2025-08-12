import { create } from 'zustand';
import { trackEvent } from '@/lib/analytics';

export type AvatarState = 'idle' | 'listening' | 'talking' | 'ack_nod' | 'welcome' | 'pointing';

export type LeadData = {
  service?: string;
  leadVolume?: string;
  mainGoal?: string;
  name?: string;
  email?: string;
  phone?: string;
};

export type Message = {
  id: string;
  type: 'assistant' | 'user';
  text: string;
  chips?: string[];
  timestamp: number;
};

interface AssistantStore {
  // Avatar state
  avatarState: AvatarState;
  setAvatarState: (state: AvatarState) => void;
  
  // Conversation state
  currentTurn: number;
  isConversationActive: boolean;
  messages: Message[];
  isTyping: boolean;
  showCTAs: boolean;
  showLeadCapture: boolean;
  
  // Lead capture
  leadData: LeadData;
  updateLeadData: (data: Partial<LeadData>) => void;
  
  // Input state
  isListening: boolean;
  isSpeaking: boolean;
  inputText: string;
  setInputText: (text: string) => void;
  
  // Actions
  startConversation: () => void;
  sendMessage: (text: string, isChip?: boolean) => void;
  processResponse: () => void;
  resetConversation: () => void;
  setListening: (listening: boolean) => void;
  setSpeaking: (speaking: boolean) => void;
  showLeadForm: () => void;
  submitLead: () => void;
}

const CONVERSATION_FLOW = [
  {
    question: "Pick a service to demo.",
    chips: ['Botox (example)', 'Fillers', 'Laser', 'Facials'],
    key: 'service'
  },
  {
    question: "How many leads per month?",
    chips: ['<20', '20-50', '50-100', '100+'],
    key: 'leadVolume'
  },
  {
    question: "I answer fast, filter tire-kickers, and book—24/7. Want me live this week?",
    chips: [],
    key: 'offer'
  }
];

export const useAssistantStore = create<AssistantStore>((set, get) => ({
  // Initial state
  avatarState: 'idle',
  currentTurn: 0,
  isConversationActive: false,
  messages: [],
  isTyping: false,
  showCTAs: false,
  showLeadCapture: false,
  leadData: {},
  isListening: false,
  isSpeaking: false,
  inputText: '',

  // Actions
  setAvatarState: (state) => set({ avatarState: state }),
  setInputText: (text) => set({ inputText: text }),
  
  updateLeadData: (data) => 
    set((state) => ({ 
      leadData: { ...state.leadData, ...data } 
    })),

  startConversation: () => {
    const firstMessage: Message = {
      id: '1',
      type: 'assistant',
      text: CONVERSATION_FLOW[0].question,
      chips: CONVERSATION_FLOW[0].chips,
      timestamp: Date.now()
    };
    
    set({ 
      isConversationActive: true,
      currentTurn: 1,
      messages: [firstMessage],
      avatarState: 'talking'
    });
    
    // Track assistant speak start
    trackEvent('assistant_speak_start', { tone: 'neutral' });
    
    // Simulate talking animation
    setTimeout(() => {
      set({ avatarState: 'idle' });
      trackEvent('assistant_speak_end', { tone: 'neutral' });
    }, 2000);
  },

  sendMessage: (text, isChip = false) => {
    const state = get();
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text,
      timestamp: Date.now()
    };
    
    // Add user message
    set((state) => ({
      messages: [...state.messages, userMessage],
      inputText: '',
      avatarState: 'ack_nod'
    }));
    
    // Quick acknowledgment
    setTimeout(() => {
      set({ avatarState: 'idle', isTyping: true });
    }, 300);
    
    // Process and respond
    setTimeout(() => {
      get().processResponse();
    }, 800);
  },

  processResponse: () => {
    const state = get();
    const turn = state.currentTurn;
    
    // Store answer
    const flowItem = CONVERSATION_FLOW[turn - 1];
    if (flowItem && flowItem.key !== 'offer') {
      const lastUserMessage = [...state.messages].reverse().find(m => m.type === 'user');
      if (lastUserMessage) {
        state.updateLeadData({ [flowItem.key]: lastUserMessage.text });
      }
    }
    
    // Generate next message or show CTAs
    if (turn < 2) {
      const nextFlow = CONVERSATION_FLOW[turn];
      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        text: nextFlow.question,
        chips: nextFlow.chips,
        timestamp: Date.now()
      };
      
      set((state) => ({
        messages: [...state.messages, assistantMessage],
        currentTurn: turn + 1,
        isTyping: false,
        avatarState: 'talking',
        showCTAs: false
      }));
      
      // Track assistant speak
      trackEvent('assistant_speak_start', { tone: 'neutral' });
      
      setTimeout(() => {
        set({ avatarState: 'idle' });
        trackEvent('assistant_speak_end', { tone: 'neutral' });
      }, 2000);
      
    } else if (turn === 2) {
      // Final offer message - step 3
      const finalMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        text: "I answer fast, filter tire-kickers, and book—24/7. Want me live this week?",
        timestamp: Date.now()
      };
      
      set((state) => ({
        messages: [...state.messages, finalMessage],
        currentTurn: 3,
        isTyping: false,
        avatarState: 'talking',
        showCTAs: true // Show CTAs at step 3
      }));
      
      // Track assistant speak with animated tone for offer
      trackEvent('assistant_speak_start', { tone: 'animated' });
      
      setTimeout(() => {
        set({ avatarState: 'idle' });
        trackEvent('assistant_speak_end', { tone: 'animated' });
      }, 2500);
    }
  },

  resetConversation: () => 
    set({
      avatarState: 'idle',
      currentTurn: 0,
      isConversationActive: false,
      messages: [],
      isTyping: false,
      showCTAs: false,
      showLeadCapture: false,
      leadData: {},
      isListening: false,
      isSpeaking: false,
      inputText: ''
    }),

  setListening: (listening) => 
    set({ 
      isListening: listening,
      avatarState: listening ? 'listening' : 'idle'
    }),

  setSpeaking: (speaking) => 
    set({ 
      isSpeaking: speaking,
      avatarState: speaking ? 'talking' : 'idle'
    }),
    
  showLeadForm: () =>
    set({ showLeadCapture: true }),
    
  submitLead: async () => {
    const { leadData } = get();
    // Send to API endpoint
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
    } catch (error) {
      console.error('Lead submission failed:', error);
    }
  }
}));