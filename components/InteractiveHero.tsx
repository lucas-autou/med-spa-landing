'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useRouter } from 'next/navigation';
import { classifyIntent, type IntentResult } from '@/lib/intentMapping';
import PurchaseSlideOver from './PurchaseSlideOver';

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
  type: 'user' | 'ai';
  text: string;
  timestamp: number;
  intent?: string;
  confidence?: number;
  isCtaMessage?: boolean;
}

export default function InteractiveHero() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Video and UI state
  const [videoLoaded, setVideoLoaded] = useState(true);
  const [videoState, setVideoState] = useState<'idle' | 'listening' | 'talking'>('idle');
  
  // AI Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentChips, setCurrentChips] = useState<string[]>(['Book appointment', 'Get pricing', 'Ask question']);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // Purchase slide-over state
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [modalWasDismissed, setModalWasDismissed] = useState(false);
  
  // Voice interface
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  // Input state
  const [textInput, setTextInput] = useState('');

  // Add initial greeting message
  useEffect(() => {
    const initialMessage: ChatMessage = {
      id: '1',
      type: 'ai',
      text: "Hi! I can help you book Botox, check pricing, or reschedule. What do you need?",
      timestamp: Date.now()
    };
    setMessages([initialMessage]);
    trackEvent('hero_view');
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
    setVideoState('listening');

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
      
      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: Date.now().toString() + '_ai',
          type: 'ai',
          text: aiResult.response,
          timestamp: Date.now(),
          confidence: aiResult.confidence
        };

        setIsTyping(false);
        setVideoState('talking');
        setMessages(prev => [...prev, aiMessage]);
        
        // Update chips with AI response
        if (aiResult.chips && aiResult.chips.length > 0) {
          setCurrentChips(aiResult.chips.slice(0, 3)); // Max 3 chips
        }
        
        // Show purchase slide-over if appropriate
        if ((aiResult.followUpAction === 'booking' || aiResult.followUpAction === 'consult') && interactionCount >= 2) {
          console.log('🎯 Triggering slide-over modal!');
          setTimeout(() => {
            const ctaMessage: ChatMessage = {
              id: Date.now().toString() + '_cta',
              type: 'ai',
              text: "Perfect! I can get you set up right now. Let me show you our options - I have everything ready for you.",
              timestamp: Date.now(),
              isCtaMessage: true
            };
            setMessages(prev => [...prev, ctaMessage]);
            
            // Show purchase slide-over after a brief delay
            setTimeout(() => {
              setShowPurchaseModal(true);
              // trackEvent('purchase_modal_shown', { trigger: 'ai_detected_intent' });
            }, 2000);
          }, 1500);
        } else if (aiResult.followUpAction === 'booking' || aiResult.followUpAction === 'consult') {
          // For earlier interactions, just add inline message without modal
          setTimeout(() => {
            const ctaMessage: ChatMessage = {
              id: Date.now().toString() + '_cta',
              type: 'ai',
              text: "I'd love to help set this up for your med spa! Tell me a bit more about your needs and I can show you our options.",
              timestamp: Date.now(),
              isCtaMessage: true
            };
            setMessages(prev => [...prev, ctaMessage]);
          }, 1500);
        }
        
        // Return to idle state
        setTimeout(() => {
          setVideoState('idle');
        }, 2500);
      }, 800);

    } catch (error) {
      console.error('AI chat error:', error);
      
      setTimeout(() => {
        const fallbackMessage: ChatMessage = {
          id: Date.now().toString() + '_ai_fallback',
          type: 'ai',
          text: "I'm having trouble connecting right now, but I'd love to help! Would you like to schedule a consultation or ask about our services?",
          timestamp: Date.now()
        };

        setIsTyping(false);
        setVideoState('talking');
        setMessages(prev => [...prev, fallbackMessage]);
        setCurrentChips(['Schedule consult', 'See pricing', 'Try again']);
        
        setTimeout(() => {
          setVideoState('idle');
        }, 2000);
      }, 500);
    }
  }, [messages]);

  // Process user input (text or chip)
  const processUserInput = useCallback((input: string, isChipSelection: boolean = false) => {
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
    
    handleAIMessage(input);
  }, [handleAIMessage]);

  // Handle voice input
  const handleVoiceInput = useCallback((transcript: string) => {
    if (transcript.trim()) {
      processUserInput(transcript.trim(), false);
      trackEvent('voice_started', { value: transcript.substring(0, 50) });
    }
  }, [processUserInput]);

  // Check for voice support
  useEffect(() => {
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

  // Video state mapping
  const getVideoSrc = () => {
    switch (videoState) {
      case 'listening':
        return '/videos/listening.mp4';
      case 'talking':
        return '/videos/talking_neutral.mp4';
      default:
        return '/videos/idle.mp4';
    }
  };

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
  
  
  // Start/stop listening
  const toggleListening = () => {
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
  };

  // Handle CTA clicks
  const handleCTAClick = (type: 'pilot' | 'full') => {
    if (type === 'pilot') {
      trackEvent('cta_click_pilot', { location: 'hero' });
      router.push('/checkout-pilot');
    } else {
      trackEvent('cta_click_full', { location: 'hero' });
      router.push('/checkout-full');
    }
  };

  // Handle modal close with dismissal tracking
  const handleModalClose = () => {
    setShowPurchaseModal(false);
    setModalWasDismissed(true);
    // trackEvent('purchase_modal_dismissed', { interactions: interactionCount });
  };

  return (
    <section id="hero" className="min-h-screen bg-background-secondary">
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12 max-w-6xl">
        {/* Hero Content */}
        <div className="mb-8 text-center lg:text-left max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
            Never Miss a Booking
          </h1>
          <p className="text-xl text-text-secondary">
            Your 24/7 virtual receptionist — answering, qualifying, and booking clients even after hours.
          </p>
        </div>

        {/* Unified Interactive Container */}
        <div className="bg-white rounded-3xl border border-border-default shadow-2xl overflow-hidden max-w-5xl mx-auto">
          {/* Mobile: Stack vertically, Desktop: Side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-0">
          
            {/* Left: Avatar Video */}
            <div className="relative">
              {/* Video Container */}
              <div className="relative w-full h-full min-h-[500px] md:min-h-[600px] lg:min-h-[650px]">
                <div className="w-full h-full rounded-l-3xl lg:rounded-r-none overflow-hidden bg-background-card">
                  <video
                    ref={videoRef}
                    src={getVideoSrc()}
                    key={videoState}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    onLoadedData={() => setVideoLoaded(true)}
                    onCanPlay={() => setVideoLoaded(true)}
                    onLoadStart={() => setVideoLoaded(false)}
                    aria-label="Virtual assistant avatar"
                  />
                  {/* Stronger bottom gradient for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/24 to-transparent pointer-events-none" />
                  
                  {!videoLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background-card">
                      <div className="animate-pulse text-text-secondary">Loading assistant...</div>
                    </div>
                  )}
                  
                  {/* Sarah Label */}
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <span className="text-xs text-white font-medium">Sarah — AI</span>
                      <span className="text-xs">·</span>
                      <span className="text-xs text-white/80">Demo</span>
                    </div>
                  </div>
                  
                  {/* Unmute Button with improved hit area */}
                  <div className="absolute top-3 right-3">
                    <button 
                      className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                      title="Hear Sarah"
                      aria-label="Unmute audio"
                      aria-pressed="false"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.766L4.146 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.146l4.237-3.766a1 1 0 011.617.766zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Status chips with improved readability */}
                  <div className="absolute bottom-4 left-4">
                    {/* "I'm here 24/7..." line - smaller and above chips */}
                    <div className="text-sm text-white/80 mb-2">
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
            </div>

            {/* Right: Chat Interface */}
            <div className="flex flex-col min-h-[500px] md:min-h-[600px] lg:min-h-[650px] p-6 lg:p-8 lg:border-l lg:border-border-default bg-gray-50 lg:bg-transparent">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text-primary font-medium">
                      Live Demo
                    </span>
                  </div>
                  <span className="text-xs text-text-tertiary">Interactive • no patient data stored</span>
                </div>
              </div>

              {/* Chat Interface */}
              <div 
                ref={chatRef}
                className="h-[400px] overflow-y-auto bg-white rounded-2xl border border-border-light p-6 mb-6 space-y-4"
                role="log"
                aria-live="polite"
                aria-label="AI conversation"
              >
                {/* Messages */}
                {messages.map((message) => (
                  <div key={message.id} className="animate-fade-in">
                    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {/* AI avatar */}
                      {message.type === 'ai' && (
                        <div className="w-8 h-8 bg-teal rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                          <span className="text-white text-sm font-medium">S</span>
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        message.type === 'user' 
                          ? 'bg-teal text-white rounded-tr-none' 
                          : 'bg-gray-50 text-text-primary rounded-tl-none'
                      }`}>
                        {message.text}
                        {message.confidence && message.confidence < 0.6 && (
                          <p className="text-text-tertiary text-xs mt-1">
                            Let me know if I misunderstood!
                          </p>
                        )}
                      </div>
                    </div>
                    
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
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {currentChips.map((chipLabel, index) => {
                    const isSelected = selectedChip === chipLabel;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleChipClick(chipLabel)}
                        className={`text-sm px-4 py-2 font-medium rounded-full transition-all duration-200 ${
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
              <div className="mb-4">
                <form onSubmit={handleTextSubmit}>
                  <div className="flex items-center gap-2 bg-white border-2 border-teal rounded-3xl px-4 py-3 shadow-sm transition-all duration-200">
                    <input
                      ref={inputRef}
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Tell Sarah what you're interested in..."
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
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-600 rounded-2xl font-medium transition-all duration-200"
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

              {/* CTA Buttons - Outside Chat */}
              {messages.some(m => m.isCtaMessage) && (
                <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-center space-y-3">
                    <p className="text-sm font-medium text-text-primary">
                      Get Sarah Live for Your Med Spa
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => {
                          setShowPurchaseModal(true);
                          // trackEvent('purchase_modal_shown', { trigger: 'external_cta_click' });
                        }}
                        className="px-4 py-2 bg-teal hover:bg-teal-hover text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                        aria-label="Show pricing options"
                      >
                        See Pricing Options
                      </button>
                      <button
                        onClick={() => {
                          setShowPurchaseModal(true);
                          // trackEvent('purchase_modal_shown', { trigger: 'external_cta_click' });
                        }}
                        className="px-4 py-2 border-2 border-teal text-teal hover:bg-teal hover:text-white rounded-lg font-medium transition-all duration-200"
                        aria-label="Get started now"
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer microcopy */}
              <div className="mt-auto">
                <div className="text-center text-xs text-text-tertiary py-2">
                  Live in 72 hours on a branded page · Optional website embed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky CTA Banner - Shows after modal dismissal */}
      {modalWasDismissed && !showPurchaseModal && (
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
      />
    </section>
  );
}