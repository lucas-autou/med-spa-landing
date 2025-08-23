import { create } from 'zustand';
import { trackEvent } from '@/lib/analytics';
import { demoConfig, getDemoStep, getNextStep, type DemoStep } from '@/lib/demoConfig';
import { classifyIntent, type Intent, type IntentResult } from '@/lib/intentMapping';

export type DemoState = 'idle' | 'running' | 'completed' | 'freechat' | 'interactive';
export type VideoState = 'idle' | 'talking_neutral' | 'ack_nod' | 'wave' | 'welcome' | 'pointing';

interface DemoStore {
  // Demo state
  demoState: DemoState;
  currentStepId: string;
  currentStep: DemoStep | null;
  videoState: VideoState;
  isTyping: boolean;
  showCTARail: boolean;
  showBookingCards: boolean;
  
  // Visual feedback for auto-demo
  autoSelectedChip: string | null;
  isAutoSelecting: boolean;
  
  // Interactive mode state
  interactiveMode: boolean;
  currentIntent: Intent | null;
  currentContext: any;
  voiceEnabled: boolean;
  isRecording: boolean;
  safetyFlags: string[];
  
  // Conversation history tracking
  conversationHistory: Array<{ 
    type: 'user' | 'ai'; 
    text: string; 
    timestamp: number;
    stepId?: string;
    intent?: Intent;
    confidence?: number;
  }>;
  
  // Data storage
  demoData: {
    service?: string;
    volume?: string;
    timeframe?: string;
    concerns?: string[];
  };
  
  // Timers
  autoStartTimer: NodeJS.Timeout | null;
  autoSelectTimer: NodeJS.Timeout | null;
  
  // Actions
  startDemo: () => void;
  advanceToStep: (stepId: string) => void;
  selectChip: (chipLabel: string, isUserInitiated?: boolean) => void;
  addConversationMessage: (type: 'user' | 'ai', message: string, stepId?: string, intent?: Intent, confidence?: number) => void;
  replayDemo: () => void;
  enableFreeChat: () => void;
  setVideoState: (state: VideoState) => void;
  setTyping: (typing: boolean) => void;
  clearTimers: () => void;
  reset: () => void;
  
  // Interactive mode actions
  startInteractiveMode: () => void;
  processUserMessage: (message: string, intentResult?: IntentResult) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setRecording: (recording: boolean) => void;
  addSafetyFlag: (flag: string) => void;
  clearSafetyFlags: () => void;
}

export const useDemoStore = create<DemoStore>((set, get) => ({
  // Initial state
  demoState: 'idle',
  currentStepId: 'greet',
  currentStep: getDemoStep('greet') || null,
  videoState: 'idle',
  isTyping: false,
  showCTARail: false,
  showBookingCards: false,
  autoSelectedChip: null,
  isAutoSelecting: false,
  
  // Interactive mode initial state
  interactiveMode: false,
  currentIntent: null,
  currentContext: {},
  voiceEnabled: false,
  isRecording: false,
  safetyFlags: [],
  
  conversationHistory: [],
  demoData: {},
  autoStartTimer: null,
  autoSelectTimer: null,

  startDemo: () => {
    const { clearTimers } = get();
    clearTimers();
    
    const greetStep = getDemoStep('greet');
    
    set({
      demoState: 'running',
      currentStepId: 'greet',
      currentStep: greetStep,
      videoState: 'wave'
    });

    // Add the user's initial demo request to conversation history
    get().addConversationMessage('user', 'See it book in 20s', 'greet');
    
    // Add Sarah's greeting response after a delay so user message appears first
    if (greetStep) {
      setTimeout(() => {
        get().addConversationMessage('ai', greetStep.bubble, 'greet');
      }, 800); // Delay Sarah's response to appear after user message
    }

    trackEvent('demo_start');
    
    // Auto-advance to service step (now relative to Sarah's message)
    setTimeout(() => {
      get().advanceToStep('service');
    }, 2600); // Adjusted to account for Sarah's response delay
  },

  advanceToStep: (stepId: string) => {
    const step = getDemoStep(stepId);
    if (!step) return;

    const { clearTimers } = get();
    clearTimers();

    set({
      currentStepId: stepId,
      currentStep: step,
      videoState: 'talking_neutral',
      isTyping: false
    });

    // Add AI message to conversation history 
    // Skip if it's the greet step (already added) or has idle preview (will be added after user selection)
    if (stepId !== 'greet' && !step.idlePreview) {
      get().addConversationMessage('ai', step.bubble, stepId);
    }

    // Handle video transitions
    if (step.video) {
      if (typeof step.video === 'string') {
        const videoTransition = step.video.split('->');
        if (videoTransition.length > 1) {
          setTimeout(() => {
            set({ videoState: videoTransition[1] as VideoState });
          }, 2000);
        }
      } else if (step.video && typeof step.video === 'object' && 'enter' in step.video) {
        // Handle new VideoTransition object
        const videoTransition = step.video;
        set({ videoState: videoTransition.enter as VideoState });
        setTimeout(() => {
          set({ videoState: videoTransition.speak as VideoState });
        }, 500);
        setTimeout(() => {
          set({ videoState: videoTransition.exit as VideoState });
        }, 2000);
      }
    }

    // Track step-specific events
    if (stepId === 'service') trackEvent('demo_service');
    if (stepId === 'volume') trackEvent('demo_volume'); 
    if (stepId === 'booking') trackEvent('demo_booking_shown');

    // Idle preview for guided demo (shows example without selecting)
    if (step.idlePreview) {
      // Show which chip will be previewed
      set({ 
        autoSelectedChip: step.idlePreview.id,
        isAutoSelecting: false 
      });

      const autoSelectTimer = setTimeout(() => {
        // Track preview event
        trackEvent(step.idlePreview!.previewEvent as any);
        
        // Add the user's auto-selected message to conversation
        const selectedChip = step.chips?.find(c => c.id === step.idlePreview!.id);
        if (selectedChip) {
          get().addConversationMessage('user', selectedChip.label, stepId);
        }
        
        // Show the preview animation (visual only, no data storage)
        set({ isAutoSelecting: true });
        
        // Clear preview state after animation
        setTimeout(() => {
          set({ 
            autoSelectedChip: null, 
            isAutoSelecting: false 
          });
        }, 1000);
        
        // Auto-advance to next step after showing user selection
        if (step.next) {
          setTimeout(() => {
            get().advanceToStep(step.next!);
          }, 1200);
        }
      }, step.idlePreview.afterMs);
      
      set({ autoSelectTimer });
    } else {
      // Clear auto-select state if no preview
      set({ 
        autoSelectedChip: null, 
        isAutoSelecting: false 
      });
    }

    // Special handling for booking step
    if (stepId === 'booking') {
      set({ isTyping: true });
      
      setTimeout(() => {
        set({ 
          isTyping: false,
          showBookingCards: true,
          showCTARail: true 
        });
        trackEvent('cta_viewed');
      }, step.typingMs || 500);
    }
  },

  selectChip: (chipLabel: string, isUserInitiated = true) => {
    const { currentStep, demoData, clearTimers } = get();
    if (!currentStep) return;

    clearTimers();

    // Add user message for ALL selections (manual and auto)
    get().addConversationMessage('user', chipLabel, currentStep.id);

    // Store data if specified (only on real user taps, not previews)
    if (currentStep.storeOnTap && isUserInitiated) {
      set({
        demoData: {
          ...demoData,
          [currentStep.storeOnTap]: chipLabel
        }
      });
    }

    set({ videoState: 'ack_nod' });

    // Handle special actions
    if (chipLabel === 'See it book in 20s' || chipLabel === 'See it work (20s)') {
      // Slight delay to show user message before demo starts
      setTimeout(() => {
        get().startDemo();
      }, 400);
      return;
    }

    if (chipLabel === 'Replay 20-sec demo ↺') {
      trackEvent('demo_replay');
      get().replayDemo();
      return;
    }

    if (chipLabel === 'See pricing') {
      trackEvent('pricing_from_demo');
      get().enableFreeChat();
      return;
    }

    // Advance to next step
    if (currentStep.next) {
      setTimeout(() => {
        get().advanceToStep(currentStep.next!);
      }, 800);
    }
  },

  addConversationMessage: (type: 'user' | 'ai', message: string, stepId?: string, intent?: Intent, confidence?: number) => {
    const { conversationHistory } = get();
    set({
      conversationHistory: [...conversationHistory, { 
        type, 
        text: message, 
        timestamp: Date.now(),
        stepId,
        intent,
        confidence
      }]
    });
  },

  replayDemo: () => {
    const { reset } = get();
    reset();
    setTimeout(() => {
      get().startDemo();
    }, 500);
  },

  enableFreeChat: () => {
    set({ demoState: 'freechat' });
    trackEvent('freechat_opened');
  },

  setVideoState: (state: VideoState) => {
    set({ videoState: state });
  },

  setTyping: (typing: boolean) => {
    set({ isTyping: typing });
  },

  clearTimers: () => {
    const { autoStartTimer, autoSelectTimer } = get();
    
    if (autoStartTimer) {
      clearTimeout(autoStartTimer);
      set({ autoStartTimer: null });
    }
    
    if (autoSelectTimer) {
      clearTimeout(autoSelectTimer);
      set({ autoSelectTimer: null });
    }
  },

  reset: () => {
    const { clearTimers } = get();
    clearTimers();
    
    set({
      demoState: 'idle',
      currentStepId: 'greet',
      currentStep: getDemoStep('greet') || null,
      videoState: 'idle',
      isTyping: false,
      showCTARail: false,
      showBookingCards: false,
      autoSelectedChip: null,
      isAutoSelecting: false,
      // Reset interactive state
      interactiveMode: false,
      currentIntent: null,
      currentContext: {},
      voiceEnabled: false,
      isRecording: false,
      safetyFlags: [],
      conversationHistory: [],
      demoData: {}
    });
  },

  // Interactive mode actions
  startInteractiveMode: () => {
    const { clearTimers } = get();
    clearTimers();

    set({
      demoState: 'interactive',
      interactiveMode: true,
      videoState: 'wave',
      currentStepId: 'interactive_greet'
    });

    // Add initial greeting
    get().addConversationMessage(
      'ai', 
      "Hi! I'm Sarah, your virtual receptionist. I'm here to help book your appointment or answer questions. What can I do for you?",
      'interactive_greet'
    );

    trackEvent('demo_start');
  },

  processUserMessage: (message: string, intentResult?: IntentResult) => {
    const { addConversationMessage, setVideoState } = get();
    
    // Add user message to conversation
    addConversationMessage('user', message, undefined, intentResult?.intent, intentResult?.confidence);
    
    // Process intent or classify if not provided
    const result = intentResult || classifyIntent(message);
    
    // Handle safety flags
    if (result.safetyFlag) {
      get().addSafetyFlag('contraindications_detected');
      set({ currentContext: { ...get().currentContext, safetyFlag: true } });
    }
    
    // Update current intent and context
    set({ 
      currentIntent: result.intent,
      currentContext: { 
        ...get().currentContext, 
        lastIntent: result.intent,
        confidence: result.confidence,
        entities: result.entities
      },
      videoState: 'ack_nod'
    });

    // Add AI response
    setTimeout(() => {
      setVideoState('talking_neutral');
      addConversationMessage('ai', result.response);
      
      // Set video back to idle after response
      setTimeout(() => {
        setVideoState('idle');
      }, 2000);
    }, 500);

    // Track intent
    trackEvent('intent_detected', { intent: result.intent });

    // Show CTA if appropriate
    if (result.intent === 'book_appointment' && !result.safetyFlag) {
      setTimeout(() => {
        set({ showCTARail: true });
        trackEvent('cta_viewed');
      }, 3000);
    }
  },

  setVoiceEnabled: (enabled: boolean) => {
    set({ voiceEnabled: enabled });
    // trackEvent(enabled ? 'voice_enabled' : 'voice_disabled');
  },

  setRecording: (recording: boolean) => {
    set({ isRecording: recording });
    if (recording) {
      set({ videoState: 'idle' });
    }
  },

  addSafetyFlag: (flag: string) => {
    const { safetyFlags } = get();
    if (!safetyFlags.includes(flag)) {
      set({ safetyFlags: [...safetyFlags, flag] });
      // trackEvent(`safety_flag_${flag}`);
    }
  },

  clearSafetyFlags: () => {
    set({ safetyFlags: [] });
  }
}));