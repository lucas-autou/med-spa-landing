'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useRouter } from 'next/navigation';
import { classifyIntent, type IntentResult } from '@/lib/intentMapping';
import PurchaseSlideOver from './PurchaseSlideOver';
import { speak, stopSpeaking } from '@/lib/ttsService';

// Voice interface types
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: any) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Message interface for AI chat
interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system' | 'booking' | 'offer';
  text: string;
  subtext?: string;
  timestamp: number;
  intent?: string;
  confidence?: number;
  isCtaMessage?: boolean;
  isTyping?: boolean;
}

export default function InteractiveHero() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const preloadedVideosRef = useRef<Set<string>>(new Set());
  
  // Calculate talking duration based on text length
  const calculateTalkingDuration = (text: string): number => {
    // Average reading speed: ~120 words per minute (slower for more natural feel)
    // Average word length: ~5 characters
    const words = text.length / 5;
    const readingTimeMs = (words / 120) * 60 * 1000;
    // Minimum 2 seconds, maximum 5 seconds for natural feel
    // Add extra 500ms for better flow
    return Math.min(Math.max(readingTimeMs + 500, 2000), 5000);
  };
  
  // Video and UI state
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoState, setVideoState] = useState<'idle' | 'listening' | 'talking'>('idle');
  const [isMuted, setIsMuted] = useState(true); // Start muted by default
  
  // Refs for real-time state access (avoid stale closures)
  const isMutedRef = useRef(true);
  const hasUserInteractedRef = useRef(false);
  
  // AI Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentChips, setCurrentChips] = useState<string[]>(['Book appointment', 'Get pricing', 'Ask question']);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // Purchase slide-over state
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [scriptedContext, setScriptedContext] = useState<'scripted' | 'regular' | null>(null);
  const [offerClicked, setOfferClicked] = useState(false);
  const [followUpTimer, setFollowUpTimer] = useState<NodeJS.Timeout | null>(null);
  const [interactionCount, setInteractionCount] = useState(0);
  const [modalWasDismissed, setModalWasDismissed] = useState(false);
  const [demoContext, setDemoContext] = useState<'scripted' | 'regular' | null>(null);
  
  // Voice interface
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  // Input state
  const [textInput, setTextInput] = useState('');
  
  // Scripted demo state
  const [isScriptedDemo, setIsScriptedDemo] = useState(false);
  const [scriptStep, setScriptStep] = useState(0);
  const [showDemoButton, setShowDemoButton] = useState(true);
  const [isAIMode, setIsAIMode] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showAudioActivated, setShowAudioActivated] = useState(false);

  // Sync refs with state to avoid stale closures
  useEffect(() => {
    isMutedRef.current = isMuted;
    console.log('📌 isMuted ref updated:', isMuted);
  }, [isMuted]);

  useEffect(() => {
    hasUserInteractedRef.current = hasUserInteracted;
    console.log('📌 hasUserInteracted ref updated:', hasUserInteracted);
  }, [hasUserInteracted]);

  // Define transitionToVideo ref for early usage
  const transitionToVideoRef = useRef<(newState: 'idle' | 'listening' | 'talking') => void>();
  
  // Add initial greeting message with auto-start
  useEffect(() => {
    const initialMessage: ChatMessage = {
      id: '1',
      type: 'ai',
      text: "Hi! I'm Sarah, your virtual receptionist. I'm here 24/7 to help book appointments and answer questions for your med spa.",
      timestamp: Date.now()
    };
    setMessages([initialMessage]);
    // Start with talking animation for greeting
    if (transitionToVideoRef.current) {
      transitionToVideoRef.current('talking');
    } else {
      setVideoState('talking');
    }
    trackEvent('hero_view');
    
    // Don't speak initial greeting automatically (respect muted state on load)
    // TTS will only start after user interaction
    
    // Return to idle after greeting animation
    setTimeout(() => {
      if (transitionToVideoRef.current) {
        transitionToVideoRef.current('idle');
      } else {
        setVideoState('idle');
      }
    }, 3000); // Greeting animation duration
    
    // Debug video element
    setTimeout(() => {
      if (videoRef.current) {
        console.log('Video element found:', {
          src: videoRef.current.src,
          readyState: videoRef.current.readyState
        });
      } else {
        console.error('Video element not found!');
      }
    }, 1000);
  }, []);

  // AI Chat function
  const handleAIMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString() + '_user',
      type: 'user',
      text: message,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    transitionToVideo('listening');

    try {
      // Prepare conversation history for AI
      const history = messages.slice(-6).map(msg => ({
        type: msg.type,
        text: msg.text
      }));

      // Call AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory: history,
          context: {
            mode: 'general'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const aiResult = await response.json();
      
      // Debug logging
      console.log('🤖 AI Response:', {
        followUpAction: aiResult.followUpAction,
        interactionCount,
        chips: aiResult.chips,
        shouldShowModal: (aiResult.followUpAction === 'booking' || aiResult.followUpAction === 'consult') && interactionCount >= 2
      });
      
      setTimeout(async () => {
        const aiMessage: ChatMessage = {
          id: Date.now().toString() + '_ai',
          type: 'ai',
          text: aiResult.response,
          timestamp: Date.now(),
          confidence: aiResult.confidence
        };

        setIsTyping(false);
        
        // All AI responses now use 'talking' state
        // Don't set video state here - wait for audio to start
        setMessages(prev => [...prev, aiMessage]);
        
        // CRITICAL: Use refs for real-time state values (avoid stale closure)
        const canSpeak = !isMutedRef.current && hasUserInteractedRef.current;
        
        console.log('🔍 TTS Debug DETAILED:', {
          canSpeak,
          isMuted_state: isMuted,
          isMuted_ref: isMutedRef.current,
          hasUserInteracted_state: hasUserInteracted,
          hasUserInteracted_ref: hasUserInteractedRef.current,
          hasSpokenResponse: !!aiResult.spokenResponse,
          timestamp: Date.now()
        });
        
        // SYNC FIX: Wait for audio to actually end before returning to idle
        // This ensures perfect synchronization between audio and video
        
        // Speak the response if audio is enabled and user has interacted
        if (canSpeak) {
          const textToSpeak = aiResult.spokenResponse || aiResult.response;
          console.log('🔊 TTS attempting to speak:', { 
            textLength: textToSpeak.length,
            text: textToSpeak.substring(0, 50) + '...'
          });
          try {
            // speak() now resolves only when audio actually ends
            await speak(textToSpeak, {
              onStart: () => {
                // Change video to talking only when audio actually starts
                transitionToVideo('talking');
                console.log('🎬 Video synchronized with audio start');
              }
            });
            console.log('✅ TTS completed - Audio has finished playing');
            // Return to idle immediately after audio ends
            transitionToVideo('idle');
          } catch (error) {
            console.error('❌ TTS error:', error);
            // Fallback: use calculated duration if TTS fails
            const fallbackDuration = calculateTalkingDuration(aiResult.spokenResponse || aiResult.response);
            console.log('⚠️ Using fallback duration:', fallbackDuration, 'ms');
            setTimeout(() => {
              transitionToVideo('idle');
            }, fallbackDuration);
          }
        } else {
          console.log('🔇 TTS skipped - reasons:', { 
            isMuted_ref: isMutedRef.current,
            hasUserInteracted_ref: hasUserInteractedRef.current,
            reason: isMutedRef.current ? 'audio is muted' : 'no user interaction yet'
          });
          // No audio playing, show video animation without sound
          transitionToVideo('talking');
          const silentDuration = calculateTalkingDuration(aiResult.spokenResponse || aiResult.response);
          console.log('🔇 Silent mode - Using calculated duration:', silentDuration, 'ms');
          setTimeout(() => {
            transitionToVideo('idle');
          }, silentDuration);
        }
        
        // Update chips with AI response
        if (aiResult.chips && aiResult.chips.length > 0) {
          setCurrentChips(aiResult.chips.slice(0, 3)); // Max 3 chips
        }
        
        // Show purchase slide-over if appropriate
        if ((aiResult.followUpAction === 'booking' || aiResult.followUpAction === 'consult') && interactionCount >= 2) {
          console.log('🎯 Triggering slide-over modal!');
          // Just show the modal without adding extra message
          setTimeout(() => {
            setShowPurchaseModal(true);
            // trackEvent('purchase_modal_shown', { trigger: 'ai_detected_intent' });
          }, 3500);
        }
      }, 800);

    } catch (error) {
      console.error('AI chat error:', error);
      
      setTimeout(async () => {
        const fallbackMessage: ChatMessage = {
          id: Date.now().toString() + '_ai_fallback',
          type: 'ai',
          text: "I'm having trouble connecting right now, but I'd love to help! Would you like to schedule a consultation or ask about our services?",
          timestamp: Date.now()
        };

        setIsTyping(false);
        // Don't set video state here - wait for audio to start
        setMessages(prev => [...prev, fallbackMessage]);
        setCurrentChips(['Schedule consult', 'See pricing', 'Try again']);
        
        // SYNC FIX: Wait for audio to actually end in fallback scenario
        
        // Speak fallback message if audio is enabled
        const fallbackCanSpeak = !isMutedRef.current && hasUserInteractedRef.current;
        console.log('🚨 Fallback TTS check:', { 
          fallbackCanSpeak,
          isMuted_ref: isMutedRef.current,
          hasUserInteracted_ref: hasUserInteractedRef.current
        });
        
        if (fallbackCanSpeak) {
          const shortFallback = "I'm having a connection issue, but I can still help you!";
          try {
            // speak() now resolves only when audio actually ends
            await speak(shortFallback, {
              onStart: () => {
                transitionToVideo('talking');
                console.log('🎬 Fallback video synchronized with audio start');
              }
            });
            console.log('✅ Fallback TTS completed - Audio has finished');
            // Return to idle immediately after audio ends
            transitionToVideo('idle');
          } catch (error) {
            console.error('❌ Fallback TTS error:', error);
            // Double fallback: use calculated duration if even fallback TTS fails
            const doubleFallbackDuration = calculateTalkingDuration(fallbackMessage.text);
            console.log('⚠️ Using calculated duration:', doubleFallbackDuration, 'ms');
            setTimeout(() => {
              transitionToVideo('idle');
            }, doubleFallbackDuration);
          }
        } else {
          // No audio playing, show video animation without sound
          transitionToVideo('talking');
          const silentFallbackDuration = calculateTalkingDuration(fallbackMessage.text);
          console.log('🔇 Silent fallback - Using calculated duration:', silentFallbackDuration, 'ms');
          setTimeout(() => {
            transitionToVideo('idle');
          }, silentFallbackDuration);
        }
      }, 500);
    }
  }, [messages, isMuted, hasUserInteracted, interactionCount]);

  // Process user input (text or chip)
  const processUserInput = useCallback((input: string, isChipSelection: boolean = false) => {
    console.log('🎯 processUserInput called with:', input.substring(0, 30));
    
    // Mark that user has interacted and auto-unmute for TTS
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
      hasUserInteractedRef.current = true; // Update ref immediately
      console.log('👤 First user interaction detected - ref updated immediately');
      
      // Auto-enable TTS on first interaction for better UX (video stays muted)
      if (isMuted) {
        setIsMuted(false);
        isMutedRef.current = false; // Update ref immediately
        console.log('🔊 Auto-enabled TTS on first user interaction - video remains muted');
        
        // Show brief notification
        setShowAudioActivated(true);
        setTimeout(() => setShowAudioActivated(false), 3000);
      }
    }
    
    // Stop any ongoing speech when user interacts
    stopSpeaking();
    
    // Clear selected chip after short delay
    if (isChipSelection) {
      setSelectedChip(input);
      setTimeout(() => setSelectedChip(null), 300);
    }
    
    // Increment interaction count
    setInteractionCount(prev => {
      const newCount = prev + 1;
      console.log('📊 Interaction count:', newCount);
      return newCount;
    });
    
    // Always use AI for processing messages
    handleAIMessage(input);
  }, [handleAIMessage, hasUserInteracted, isMuted]);

  // Handle voice input
  const handleVoiceInput = useCallback((transcript: string) => {
    if (transcript.trim()) {
      processUserInput(transcript.trim(), false);
      trackEvent('voice_started', { value: transcript.substring(0, 50) });
    }
  }, [processUserInput]);

  // Check for voice support with SSR protection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(!!SpeechRecognition);
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      
      if (recognition) {
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let transcript = '';
          for (let i = event.results.length - 1; i >= 0; i--) {
            if (event.results[i]) {
              transcript = event.results[i][0].transcript;
              break;
            }
          }
          setCurrentTranscript(transcript);
          
          // Process final result
          const lastResult = event.results[event.results.length - 1];
          if (lastResult && lastResult.isFinal) {
            handleVoiceInput(transcript);
          }
        };
        
        recognition.onend = () => {
          setIsListening(false);
          setCurrentTranscript('');
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setCurrentTranscript('');
        };
      }
    }
  }, [handleVoiceInput]);

  // Scroll to latest content
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Simplified video state mapping - only 3 states
  const getVideoSrc = useCallback((state: 'idle' | 'listening' | 'talking' = 'idle') => {
    const videoMap = {
      'idle': '/videos/idle.mp4',
      'listening': '/videos/listening.mp4',
      'talking': '/videos/talking_neutral.mp4'
    };
    const src = videoMap[state];
    console.log('Video state:', state, 'Source:', src);
    return src;
  }, []);

  // Preload video function with SSR protection
  const preloadVideo = useCallback((src: string) => {
    if (typeof window === 'undefined') return;
    if (preloadedVideosRef.current.has(src)) return;
    
    const video = document.createElement('video');
    video.src = src;
    video.load();
    preloadedVideosRef.current.add(src);
    console.log('Preloaded video:', src);
  }, []);

  // Simplified video transition - single video element
  const transitionToVideo = useCallback((newState: 'idle' | 'listening' | 'talking') => {
    // SSR protection
    if (typeof window === 'undefined') return;
    
    // Check if video ref exists
    if (!videoRef.current) {
      console.warn('Video ref not ready');
      return;
    }

    const newSrc = getVideoSrc(newState);
    const currentSrc = videoRef.current.src;
    
    // Set loop based on state
    videoRef.current.loop = (newState === 'idle' || newState === 'listening');
    
    // Only change source if different
    if (!currentSrc || !currentSrc.includes(newSrc.replace('/videos/', ''))) {
      videoRef.current.src = newSrc;
      videoRef.current.load();
    }
    
    // Play video and handle errors
    videoRef.current.play()
      .then(() => {
        console.log('Video playing:', newState);
      })
      .catch(error => {
        console.warn('Video play interrupted:', error);
      });

    setVideoState(newState);
  }, [getVideoSrc]);
  
  // Store transitionToVideo in ref for use in initial effect
  useEffect(() => {
    transitionToVideoRef.current = transitionToVideo;
  }, [transitionToVideo]);

  // Handle video 'ended' event to return to idle after talking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleVideoEnded = () => {
      // Only return to idle if we're in talking state
      if (videoState === 'talking' && videoRef.current) {
        console.log('Video ended, returning to idle');
        transitionToVideo('idle');
      }
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('ended', handleVideoEnded);
    }

    // Cleanup
    return () => {
      if (video) {
        video.removeEventListener('ended', handleVideoEnded);
      }
    };
  }, [videoState, transitionToVideo]);

  // Preload videos on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Preload only the 3 video states we use
    preloadVideo('/videos/idle.mp4');
    preloadVideo('/videos/listening.mp4');
    preloadVideo('/videos/talking_neutral.mp4');
  }, [preloadVideo]);

  // Initialize video element
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (videoRef.current) {
      videoRef.current.src = getVideoSrc('idle');
      videoRef.current.loop = true;
      videoRef.current.load();
      videoRef.current.play().catch(e => {
        console.log('Initial video play failed:', e);
      });
    }
  }, [getVideoSrc]);

  // Handle chip selection
  const handleChipClick = (chipLabel: string) => {
    trackEvent('chip_select', { value: chipLabel });
    
    // Special handling for pricing chips - show slide-over directly
    if (chipLabel.toLowerCase().includes('pricing') || chipLabel.toLowerCase().includes('get pricing')) {
      setShowPurchaseModal(true);
      // trackEvent('purchase_modal_shown', { trigger: 'pricing_chip_click' });
      return;
    }
    
    processUserInput(chipLabel, true);
  };

  // Handle text input submission
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      const input = textInput.trim();
      trackEvent('text_input_sent', { value: input.substring(0, 50) });
      processUserInput(input, false);
      setTextInput('');
    }
  };
  
  
  // Start/stop listening with SSR protection
  const toggleListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        trackEvent('voice_started');
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
  }, [isListening]);

  // Handle CTA clicks
  const handleCTAClick = useCallback((type: 'pilot' | 'full') => {
    if (type === 'pilot') {
      trackEvent('cta_click_pilot', { location: 'hero' });
      router.push('/checkout-pilot');
    } else {
      trackEvent('cta_click_full', { location: 'hero' });
      router.push('/checkout-full');
    }
  }, [router]);
  
  // Toggle TTS audio mute/unmute (video always stays muted)
  const toggleAudio = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    isMutedRef.current = newMutedState; // Update ref immediately
    console.log('🔄 TTS audio toggled:', { newMutedState, videoAlwaysMuted: true });
    trackEvent('audio_toggle', { muted: newMutedState });
  }, [isMuted]);
  
  // Unlock audio context for Safari/iOS
  const unlockAudioContext = async () => {
    try {
      // Detect Safari/iOS
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      
      console.log('🔍 Browser detection:', { isSafari, isIOS, userAgent: navigator.userAgent });
      
      // 1. Create and unlock Web Audio Context
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioContext = new AudioContext();
        
        // Create silent sound to unlock
        const buffer = audioContext.createBuffer(1, 1, 22050);
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(0);
        
        console.log('✅ Web Audio Context unlocked');
      }
      
      // 2. Unlock Speech Synthesis as well
      if (window.speechSynthesis) {
        // Speak something silent to activate
        const utterance = new SpeechSynthesisUtterance(' ');
        utterance.volume = 0.01; // Almost silent
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
        
        // Wait a moment to ensure activation
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('✅ Speech Synthesis unlocked');
      }
      
      console.log('✅ Audio fully unlocked for Safari/iOS');
    } catch (error) {
      console.warn('Error unlocking audio:', error);
    }
  };
  
  // Scripted demo flow - REFACTORED for perfect sync
  const startScriptedDemo = async () => {
    // FIRST: Unlock audio context for Safari/iOS
    await unlockAudioContext();
    trackEvent('demo_start' as any);
    setShowDemoButton(false);
    setIsScriptedDemo(true);
    setHasUserInteracted(true);
    hasUserInteractedRef.current = true; // Update ref immediately
    setMessages([]);
    
    // Enable TTS for demo (video remains muted)
    setIsMuted(false);
    isMutedRef.current = false; // Update ref immediately
    console.log('🔊 Demo started - TTS enabled - Video remains muted');
    
    // Scripted conversation steps with natural delays between turns
    const scriptedSteps = [
      { pauseBefore: 100, type: 'ai', text: "Hi! Welcome to Glow Med Spa. I'm Sarah, your virtual receptionist. How can I help you today?" },
      { pauseBefore: 1500, type: 'user', text: "I'd like to book a Botox appointment" },
      { pauseBefore: 800, type: 'ai', text: "Perfect! I can help you book your Botox appointment. When works best for you?" },
      { pauseBefore: 1500, type: 'user', text: "Do you have anything available this week?" },
      { pauseBefore: 800, type: 'ai', text: "Let me check our availability... I have Thursday at 2pm or Friday at 10am. Which would you prefer?" },
      { pauseBefore: 1500, type: 'user', text: "Thursday at 2pm works great" },
      { pauseBefore: 800, type: 'ai', text: "Excellent! You're all set for Thursday at 2pm for your Botox appointment. You'll receive a confirmation text shortly with all the details." },
      { pauseBefore: 500, type: 'booking', text: "✅ Appointment Confirmed" },
      { pauseBefore: 300, type: 'system', text: "📱 SMS confirmation sent" },
      { pauseBefore: 300, type: 'system', text: "📅 Added to calendar" },
      { pauseBefore: 1000, type: 'ai', text: "All set for Thursday at 2pm! You'll get a confirmation text shortly.\n\nBy the way, I can handle bookings like this for your real clients — 24/7. Most med spas start with my 14-day pilot to try me risk-free." },
      { pauseBefore: 500, type: 'offer', text: "See How the Pilot Works", subtext: "Full setup in 72h — works with your booking system" }
    ];
    
    // Process steps sequentially for perfect synchronization
    for (let index = 0; index < scriptedSteps.length; index++) {
      const step = scriptedSteps[index];
      
      // Wait before each step for natural pacing
      await new Promise(resolve => setTimeout(resolve, step.pauseBefore));
      
      if (step.type === 'ai') {
        // Show typing indicator
        // Use talking animation for all AI messages
        const isFirstMessage = index === 0;
        if (isFirstMessage) {
          transitionToVideo('talking');
        }
        setIsTyping(true);
        
        // Small delay for typing effect
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Add message to chat
        const aiMessage: ChatMessage = {
          id: `scripted_${index}`,
          type: 'ai',
          text: step.text,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        
        // Speak and wait for audio to finish
        const demoCanSpeak = !isMutedRef.current;
        console.log('🎭 Demo step:', index, 'Speaking:', demoCanSpeak);
        
        if (demoCanSpeak) {
          // For scripted demo, create appropriate short versions
          let textToSpeak = step.text;
          const isLastAIMessage = step.text.includes('14-day pilot');
          
          if (step.text.length > 100) {
            if (isLastAIMessage) {
              textToSpeak = "I can handle bookings like this for your med spa 24/7. Want to try the pilot?";
            } else if (step.text.includes('Thursday') && step.text.includes('Friday')) {
              textToSpeak = "I have Thursday at 2pm or Friday at 10am. Which works better?";
            } else if (step.text.includes('Thursday') && step.text.includes('confirmation text')) {
              textToSpeak = "Excellent! You're all set for Thursday at 2pm. You'll receive a confirmation text with all details.";
            } else {
              textToSpeak = step.text.substring(0, 80) + "...";
            }
          }
          
          console.log('🎯 Demo AI message:', { index, isFirstMessage, isLastAIMessage, textLength: textToSpeak.length });
          
          // Fallback: transition to talking immediately for demo
          transitionToVideo('talking');
          
          try {
            // speak() now resolves only when audio actually ends
            await speak(textToSpeak, {
              onStart: () => {
                // Always use talking animation when audio starts
                transitionToVideo('talking');
                console.log('🎬 Demo video synchronized with audio start');
              }
            });
            console.log('✅ Demo step', index, 'audio completed - returning to idle');
            // Return to idle immediately after audio ends
            transitionToVideo('idle');
          } catch (error) {
            console.error('❌ TTS error in demo step', index, error);
            // Fallback: use calculated duration if TTS fails
            transitionToVideo('talking');
            const demoDuration = calculateTalkingDuration(step.text);
            await new Promise(resolve => setTimeout(resolve, demoDuration));
            transitionToVideo('idle');
          }
        } else {
          // No audio, show video animation without sound
          if (!isFirstMessage) {
            transitionToVideo('talking');
          }
          const silentDuration = calculateTalkingDuration(step.text);
          await new Promise(resolve => setTimeout(resolve, silentDuration));
          transitionToVideo('idle');
        }
        
      } else if (step.type === 'user') {
        // Simulate user typing
        transitionToVideo('listening');
        const userMessage: ChatMessage = {
          id: `scripted_${index}`,
          type: 'user',
          text: step.text,
          timestamp: Date.now()
        };
        
        // Type out the message character by character with async/await
        let typedText = '';
        const chars = step.text.split('');
        
        for (let charIndex = 0; charIndex < chars.length; charIndex++) {
          typedText += chars[charIndex];
          setTextInput(typedText);
          // Wait 50ms between each character for typing effect
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Small delay before clearing and adding to messages
        await new Promise(resolve => setTimeout(resolve, 200));
        setMessages(prev => [...prev, userMessage]);
        setTextInput('');
        
      } else if (step.type === 'booking' || step.type === 'system') {
        // Show confirmation cards
        const systemMessage: ChatMessage = {
          id: `scripted_${index}`,
          type: step.type as 'booking' | 'system',
          text: step.text,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, systemMessage]);
        
      } else if (step.type === 'offer') {
        // Show offer CTA button
        const offerMessage: ChatMessage = {
          id: `scripted_${index}`,
          type: 'offer',
          text: step.text,
          subtext: step.subtext,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, offerMessage]);
      }
    }
    
    console.log('🎬 Demo completed - All steps executed in perfect sync');
    
    // Force transition to idle after demo completes
    setTimeout(() => {
      console.log('🔄 Final transition to idle after demo completion');
      transitionToVideo('idle');
    }, 1000);
  };

  // Handle modal close with dismissal tracking
  const handleModalClose = () => {
    setShowPurchaseModal(false);
    setModalWasDismissed(true);
    // trackEvent('purchase_modal_dismissed', { interactions: interactionCount });
  };
  
  // Handle keep chatting - switch to AI mode
  const handleKeepChatting = async () => {
    setIsAIMode(true);
    setShowFloatingCTA(true);
    // Don't set video state here - wait for audio to start
    trackEvent('keep_chatting_selected' as any);
    
    // Add a message to continue the conversation
    const continueMessage: ChatMessage = {
      id: Date.now().toString() + '_continue',
      type: 'ai',
      text: "Great! I'm here to answer any questions you have about our services or how I can help your med spa. What would you like to know?",
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, continueMessage]);
    
    // SYNC FIX: Wait for audio to actually end when continuing chat
    
    // Speak the continue message if audio is enabled
    const continueCanSpeak = !isMutedRef.current && hasUserInteractedRef.current;
    console.log('💬 Continue chat TTS check:', { 
      continueCanSpeak,
      isMuted_ref: isMutedRef.current,
      hasUserInteracted_ref: hasUserInteractedRef.current
    });
    
    if (continueCanSpeak) {
      const shortContinue = "Great! I'm here to answer any questions. What would you like to know?";
      try {
        // speak() now resolves only when audio actually ends
        await speak(shortContinue, {
          onStart: () => {
            transitionToVideo('talking');
            console.log('🎬 Continue video synchronized with audio start');
          }
        });
        console.log('✅ Continue TTS completed - Audio has finished');
        // Return to idle immediately after audio ends
        transitionToVideo('idle');
      } catch (error) {
        console.error('❌ Continue TTS error:', error);
        // Fallback: use calculated duration if TTS fails
        const continueFallbackDuration = calculateTalkingDuration(continueMessage.text);
        console.log('⚠️ Continue using fallback duration:', continueFallbackDuration, 'ms');
        setTimeout(() => {
          transitionToVideo('idle');
        }, continueFallbackDuration);
      }
    } else {
      // No audio playing, show video animation without sound
      transitionToVideo('talking');
      const silentContinueDuration = calculateTalkingDuration(continueMessage.text);
      console.log('🔇 Silent continue - Using calculated duration:', silentContinueDuration, 'ms');
      setTimeout(() => {
        transitionToVideo('idle');
      }, silentContinueDuration);
    }
    
    // Update chips for AI mode
    setCurrentChips(['How does Sarah work?', 'Pricing details', 'Setup process']);
  };

  return (
    <section id="hero" className="min-h-screen bg-gradient-to-b from-background-primary to-background-secondary">
      <div className="container mx-auto px-4 py-4 md:py-6 lg:py-8 max-w-7xl">
        {/* Hero Content - Smaller, integrated */}
        <div className="mb-4 sm:mb-5 md:mb-6 text-center max-w-5xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-text-primary mb-2 sm:mb-3">
            Never Miss a Booking
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-text-secondary mb-3 sm:mb-4">
            Sarah answers, qualifies, and books clients for you 24/7 — even after hours.
          </p>
          
          {/* Prominent Demo Button */}
          {showDemoButton && (
            <div className="animate-fade-in">
              <button
                onClick={startScriptedDemo}
                className="inline-flex items-center gap-3 px-8 py-4 bg-teal hover:bg-teal-hover text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-pulse-soft"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Meet Sarah — Watch Her Book a Client
                <span className="text-sm font-normal opacity-90">(20s Demo)</span>
              </button>
              <p className="text-sm text-text-tertiary mt-2">See her in action with a real booking flow</p>
            </div>
          )}
        </div>

        {/* Audio Activated Notification */}
        {showAudioActivated && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
            <div className="bg-teal text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.766L4.146 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.146l4.237-3.766a1 1 0 011.617.766zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Audio activated - Sarah can speak now!</span>
            </div>
          </div>
        )}

        {/* Unified Interactive Container - Larger for WOW */}
        <div className="bg-white rounded-3xl border border-border-default shadow-2xl overflow-hidden max-w-7xl mx-auto">
          {/* Mobile: Stack vertically, Desktop: Side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-0">
          
            {/* Left: Avatar Video */}
            <div className="relative">
              {/* Video Container - Optimized for mobile visibility */}
              <div className="relative w-full min-h-[350px] sm:min-h-[450px] md:min-h-[650px] lg:min-h-[750px] xl:min-h-[800px] bg-black rounded-l-3xl lg:rounded-r-none overflow-hidden">
                  {!videoLoaded && (
                    <img 
                      src="/videos/poster.jpg" 
                      alt="Sarah - Virtual Assistant"
                      className="absolute inset-0 w-full h-full object-cover z-0"
                      loading="eager"
                    />
                  )}
                  {/* Single Video Element */}
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    webkit-playsinline="true"
                    x-webkit-airplay="allow"
                    poster="/videos/poster.jpg"
                    className="absolute inset-0 w-full h-full object-cover z-10"
                    onLoadedData={() => {
                      console.log('Video loaded');
                      setVideoLoaded(true);
                    }}
                    onCanPlay={() => {
                      setVideoLoaded(true);
                      // Força play no Safari/iOS quando vídeo estiver pronto
                      if (videoRef.current) {
                        videoRef.current.play().catch(e => {
                          console.log('Video autoplay retry failed:', e);
                        });
                      }
                    }}
                    onError={(e) => {
                      console.error('Video error:', e);
                    }}
                    aria-label="Sarah, your virtual assistant - video demonstration"
                    role="img"
                  />
                  {/* Stronger bottom gradient for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-20" />
                  
                  
                  {/* Sarah Label */}
                  <div className="absolute top-3 left-3 z-30">
                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <span className="text-xs text-white font-medium">Sarah — AI</span>
                      <span className="text-xs">·</span>
                      <span className="text-xs text-white/80">Demo</span>
                    </div>
                  </div>
                  
                  {/* TTS Audio Control Button (video always stays muted) */}
                  <div className="absolute top-3 right-3 z-30">
                    <button 
                      onClick={toggleAudio}
                      className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2"
                      title={isMuted ? "Enable Sarah's voice" : "Mute Sarah's voice"}
                      aria-label={isMuted ? "Enable text-to-speech" : "Mute text-to-speech"}
                      aria-pressed={!isMuted}
                      type="button"
                    >
                      {isMuted ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.766L4.146 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.146l4.237-3.766a1 1 0 011.617.766zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.766L4.146 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.146l4.237-3.766a1 1 0 011.617.766zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {/* Status chips with improved readability - Hidden on mobile */}
                  <div className="absolute bottom-4 left-4 z-30 hidden sm:block">
                    {/* "I'm here 24/7..." line - smaller and above chips */}
                    <div className="text-sm text-white/90 mb-2" role="status" aria-live="polite">
                      I&apos;m here 24/7 to answer questions and book appointments
                    </div>
                    <div className="flex flex-wrap gap-x-2.5 md:gap-x-3 gap-y-2 pb-2">
                      <div className="text-[13px] md:text-sm bg-white/85 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm ring-1 ring-black/5 font-medium text-gray-700 animate-fade-in">
                        ✓ HIPAA-ready
                      </div>
                      <div className="text-[13px] md:text-sm bg-white/85 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm ring-1 ring-black/5 font-medium text-gray-700 animate-fade-in" style={{animationDelay: '0.6s'}}>
                        ✓ Go-live in 72h
                      </div>
                      <div className="text-[13px] md:text-sm bg-white/85 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm ring-1 ring-black/5 font-medium text-gray-700 animate-fade-in" style={{animationDelay: '1.2s'}}>
                        ✓ Works with Boulevard/Square/Calendly
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            {/* Right: Chat Interface - Optimized for mobile */}
            <div className="flex flex-col min-h-[350px] sm:min-h-[450px] md:min-h-[650px] lg:min-h-[750px] xl:min-h-[800px] p-4 sm:p-5 md:p-6 lg:p-8 lg:border-l lg:border-border-default bg-gray-50 lg:bg-transparent">
              {/* Header */}
              <div className="mb-3 sm:mb-4 md:mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text-primary font-medium">
                      Live Demo
                    </span>
                  </div>
                  <span className="text-xs text-text-tertiary">Interactive • no patient data stored</span>
                </div>
              </div>

              {/* Chat Interface - Reduced height for mobile */}
              <div 
                ref={chatRef}
                className="h-[250px] sm:h-[320px] md:h-[400px] lg:h-[500px] overflow-y-auto bg-white rounded-2xl border border-border-light p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6 space-y-3 sm:space-y-4"
                role="log"
                aria-live="polite"
                aria-label="AI conversation"
              >
                {/* Messages */}
                {messages.map((message) => (
                  <div key={message.id} className="animate-fade-in mb-4">
                    {message.type === 'booking' || message.type === 'system' ? (
                      <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                          <span className="text-sm font-medium text-text-primary">
                            {message.text}
                          </span>
                        </div>
                      </div>
                    ) : message.type === 'offer' ? (
                      <div className="flex justify-start">
                        <div className="w-8 h-8 bg-teal rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                          <span className="text-white text-sm font-medium">S</span>
                        </div>
                        <div className="max-w-[80%]">
                          <button
                            onClick={() => {
                              setOfferClicked(true);
                              setShowPurchaseModal(true);
                              setScriptedContext('scripted');
                            }}
                            className="group bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-2xl p-4 shadow-lg hover:shadow-xl transform transition-all hover:scale-[1.02] text-left w-full"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-base mb-1">{message.text}</p>
                                {message.subtext && <p className="text-xs text-teal-50">{message.subtext}</p>}
                              </div>
                              <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {/* AI avatar */}
                        {message.type === 'ai' && (
                          <div className="w-8 h-8 bg-teal rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                            <span className="text-white text-sm font-medium">S</span>
                          </div>
                        )}
                        
                        <div className={`max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
                          message.type === 'user' 
                            ? 'bg-teal text-white rounded-tr-none' 
                            : 'bg-gray-50 text-text-primary rounded-tl-none'
                        }`}>
                          <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                            message.type === 'user' ? 'text-white' : 'text-text-primary'
                          }`}>
                            {message.text}
                          </p>
                          {message.confidence && message.confidence < 0.6 && (
                            <p className="text-text-tertiary text-xs mt-1">
                              Let me know if I misunderstood!
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="w-8 h-8 bg-teal rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                      <span className="text-white text-sm font-medium">S</span>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Voice transcript preview */}
                {isListening && currentTranscript && (
                  <div className="flex justify-end mb-2">
                    <div className="max-w-[80%] px-4 py-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-2xl text-sm italic">
                      {currentTranscript}...
                    </div>
                  </div>
                )}
              </div>

              {/* Action Chips */}
              <div className="mb-3 sm:mb-4 md:mb-6">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {currentChips.map((chipLabel, index) => {
                    const isSelected = selectedChip === chipLabel;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleChipClick(chipLabel)}
                        className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 font-medium rounded-full transition-all duration-200 ${
                          isSelected
                            ? 'bg-teal text-white transform scale-105 shadow-lg'
                            : 'bg-white border border-gray-200 text-text-primary hover:border-teal hover:shadow-md'
                        }`}
                        style={{animationDelay: `${index * 100}ms`}}
                        aria-label={`Select ${chipLabel}`}
                      >
                        {chipLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Input */}
              <div className="mb-2 sm:mb-3 md:mb-4">
                <form onSubmit={handleTextSubmit}>
                  <div className="flex items-center gap-2 bg-white border-2 border-teal rounded-3xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm transition-all duration-200">
                    <input
                      ref={inputRef}
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Type or tap a suggestion..."
                      className="flex-1 text-text-primary placeholder-text-tertiary focus:outline-none text-sm"
                      maxLength={200}
                    />

                    {/* Voice Button */}
                    {voiceSupported && (
                      <button
                        type="button"
                        onClick={toggleListening}
                        className={`
                          p-2 rounded-full transition-all duration-200 
                          ${isListening 
                            ? 'bg-red-500 text-white animate-pulse' 
                            : 'bg-teal text-white shadow-md hover:bg-teal-hover'
                          }
                        `}
                        title={isListening ? 'Stop listening' : 'Start voice input'}
                      >
                        {isListening ? (
                          <div className="w-4 h-4 bg-white rounded-full" />
                        ) : (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/>
                            <path d="M19 10v1a7 7 0 0 1-14 0v-1a1 1 0 0 1 2 0v1a5 5 0 0 0 10 0v-1a1 1 0 1 1 2 0Z"/>
                            <path d="M12 18.5a1 1 0 0 1 1 1V22a1 1 0 1 1-2 0v-2.5a1 1 0 0 1 1-1Z"/>
                          </svg>
                        )}
                      </button>
                    )}

                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={!textInput.trim()}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-600 rounded-2xl text-sm sm:text-base font-medium transition-all duration-200"
                      title="Send message"
                    >
                      Send
                    </button>
                  </div>
                </form>
                
                {/* Voice status */}
                {isListening && (
                  <div className="mt-2 text-sm text-gray-600 italic text-center">
                    {currentTranscript ? `"${currentTranscript}"` : 'Listening... speak now'}
                  </div>
                )}
              </div>

              {/* Removed CTA buttons - now handled in chat */}

              {/* Footer microcopy */}
              <div className="mt-auto">
                <div className="text-center text-[10px] sm:text-xs text-text-tertiary py-1 sm:py-2">
                  Live in 72 hours on a branded page · Optional website embed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating CTA - Shows during AI chat mode */}
      {showFloatingCTA && !showPurchaseModal && (
        <div className="fixed bottom-4 right-4 z-30 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-sm">
            <p className="text-sm font-semibold text-text-primary mb-2">
              Ready to get Sarah for your med spa?
            </p>
            <p className="text-xs text-text-secondary mb-3">
              Live in 48 hours • 30-day money back guarantee
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleCTAClick('pilot')}
                className="flex-1 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium text-sm transition-colors"
              >
                Start Pilot
              </button>
              <button
                onClick={() => setShowPurchaseModal(true)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors"
              >
                See Plans
              </button>
            </div>
            <button
              onClick={() => setShowFloatingCTA(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Sticky CTA Banner - Shows after modal dismissal (backup) */}
      {modalWasDismissed && !showPurchaseModal && !showFloatingCTA && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 shadow-2xl z-30 animate-slide-up">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex-1">
              <p className="font-semibold text-sm">
                🔥 Don&apos;t miss out! Only 3 January setup spots left
              </p>
              <p className="text-xs opacity-90">
                Get Sarah live for your med spa in 72 hours
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleCTAClick('pilot')}
                className="px-4 py-2 bg-white text-teal-600 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                Start Pilot - $297
              </button>
              <button
                onClick={() => setModalWasDismissed(false)}
                className="text-white hover:text-gray-300 transition-colors"
                title="Close banner"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Slide-over Modal */}
      <PurchaseSlideOver 
        isOpen={showPurchaseModal}
        onClose={handleModalClose}
        context={demoContext}
        onKeepChatting={handleKeepChatting}
      />
    </section>
  );
}