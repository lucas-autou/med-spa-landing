import { create } from 'zustand';
import { trackEvent } from '@/lib/analytics';
import { demoConfig, getDemoStep, getNextStep, type DemoStep } from '@/lib/demoConfig';

export type DemoState = 'idle' | 'running' | 'completed' | 'freechat';
export type VideoState = 'idle' | 'listening' | 'talking_neutral' | 'talking_animated' | 'talking_empathetic' | 'ack_nod' | 'wave';

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
  
  // Conversation history tracking
  conversationHistory: Array<{ 
    type: 'user' | 'ai'; 
    text: string; 
    timestamp: number;
    stepId?: string;
  }>;
  
  // Data storage
  demoData: {
    service?: string;
    volume?: string;
  };
  
  // Timers
  autoStartTimer: NodeJS.Timeout | null;
  autoSelectTimer: NodeJS.Timeout | null;
  
  // Actions
  startDemo: () => void;
  advanceToStep: (stepId: string) => void;
  selectChip: (chipLabel: string, isUserInitiated?: boolean) => void;
  addConversationMessage: (type: 'user' | 'ai', message: string, stepId?: string) => void;
  replayDemo: () => void;
  enableFreeChat: () => void;
  setVideoState: (state: VideoState) => void;
  setTyping: (typing: boolean) => void;
  clearTimers: () => void;
  reset: () => void;
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
    
    // Add Sarah's greeting response to conversation history
    if (greetStep) {
      get().addConversationMessage('ai', greetStep.bubble, 'greet');
    }

    trackEvent('demo_start');
    
    // Auto-advance to service step (longer delay to see user message)
    setTimeout(() => {
      get().advanceToStep('service');
    }, 1800);
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

    // Add AI message to conversation history (skip if it's the greet step since it's already added)
    if (stepId !== 'greet') {
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
        
        // Show the preview animation (visual only, no data storage)
        set({ isAutoSelecting: true });
        
        // Clear preview state after animation
        setTimeout(() => {
          set({ 
            autoSelectedChip: null, 
            isAutoSelecting: false 
          });
        }, 1000);
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

  addConversationMessage: (type: 'user' | 'ai', message: string, stepId?: string) => {
    const { conversationHistory } = get();
    set({
      conversationHistory: [...conversationHistory, { 
        type, 
        text: message, 
        timestamp: Date.now(),
        stepId 
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
      conversationHistory: [],
      demoData: {}
    });
  }
}));