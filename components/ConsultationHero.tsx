'use client';

import { useEffect, useRef, useState } from 'react';
import { useAssistantStore } from '@/store/useAssistantStore';
import { trackEvent } from '@/lib/analytics';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ChatMessage {
  id: string;
  type: 'assistant' | 'user';
  text: string;
  timestamp: number;
  isTyping?: boolean;
}

export default function ConsultationHero() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showChips, setShowChips] = useState(false);
  const [currentChips, setCurrentChips] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [avatarState, setAvatarState] = useState<'idle' | 'listening' | 'talking' | 'ack_nod'>('idle');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showDemoButton, setShowDemoButton] = useState(false);
  const [demoStarted, setDemoStarted] = useState(false);
  const [autoStartTimer, setAutoStartTimer] = useState<NodeJS.Timeout | null>(null);

  // Initial greeting sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      // Start typing indicator
      setIsTyping(true);
      setAvatarState('talking');
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages([{
          id: '1',
          type: 'assistant',
          text: "Hi—I'm Sarah, your virtual receptionist. Want to see how I handle after-hours leads?",
          timestamp: Date.now()
        }]);
        setShowDemoButton(true);
        setAvatarState('idle');
        
        // Auto-start demo after 2 seconds if no interaction
        const autoTimer = setTimeout(() => {
          if (!hasInteracted && !demoStarted) {
            startDemo();
          }
        }, 2000);
        
        setAutoStartTimer(autoTimer);
      }, 800);
      
      trackEvent('hero_view');
    }, 500);
    
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Cancel auto-start on any user interaction
  const cancelAutoStart = () => {
    if (autoStartTimer) {
      clearTimeout(autoStartTimer);
      setAutoStartTimer(null);
    }
    setHasInteracted(true);
  };

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Video source based on state
  const getVideoSrc = () => {
    const basePath = '/videos/';
    switch (avatarState) {
      case 'listening':
        return `${basePath}listening.mp4`;
      case 'talking':
        return `${basePath}talking_neutral.mp4`;
      case 'ack_nod':
        return `${basePath}listening.mp4`;
      default:
        return `${basePath}idle.mp4`;
    }
  };

  const simulateTyping = (text: string, callback: () => void) => {
    setIsTyping(true);
    setAvatarState('talking');
    
    // Fixed 450ms typing delay
    setTimeout(() => {
      setIsTyping(false);
      setAvatarState('idle');
      callback();
    }, 450);
  };

  const startDemo = () => {
    cancelAutoStart();
    setDemoStarted(true);
    setShowDemoButton(false);
    setCurrentStep(2);
    
    trackEvent('demo_start');
    
    // Step 2: Service message
    setTimeout(() => {
      simulateTyping("I answer in seconds—day or night.", () => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'assistant',
          text: "I answer in seconds—day or night.",
          timestamp: Date.now()
        }]);
        
        trackEvent('demo_service');
      });
    }, 300);
    
    // Step 3: Volume/qualification message
    setTimeout(() => {
      simulateTyping("I filter tire-kickers and book real consults on your calendar.", () => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'assistant',
          text: "I filter tire-kickers and book real consults on your calendar.",
          timestamp: Date.now()
        }]);
        
        trackEvent('demo_volume');
      });
    }, 2000);
    
    // Step 4: Final booking message and reveal CTAs
    setTimeout(() => {
      setAvatarState('ack_nod');
      setTimeout(() => {
        simulateTyping("You'll get SMS/email alerts instantly.", () => {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            type: 'assistant',
            text: "You'll get SMS/email alerts instantly.",
            timestamp: Date.now()
          }]);
          
          setCurrentStep(3);
          trackEvent('demo_booking_shown');
          trackEvent('cta_viewed');
          
          // Enable input after demo
          setCurrentChips(['Tell me about pricing', 'How does setup work?', 'Book a demo call']);
          setShowChips(true);
        });
      }, 400);
    }, 4500);
  };

  const handleChipClick = (chip: string) => {
    cancelAutoStart();
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: chip,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setShowChips(false);
    setAvatarState('listening');
    
    trackEvent('chip_select', { value: chip });

    // Handle post-demo interactions
    if (chip === 'Tell me about pricing') {
      simulateTyping("Full setup is $997 + $97/month, or try our 14-day pilot for $297 (credited toward full setup).", () => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'assistant',
          text: "Full setup is $997 + $97/month, or try our 14-day pilot for $297 (credited toward full setup).",
          timestamp: Date.now()
        }]);
        setCurrentChips(['Start pilot', 'Book full setup', 'More questions']);
        setShowChips(true);
      });
      
    } else if (chip === 'How does setup work?') {
      simulateTyping("I'll be live on your branded page in 72 hours. No coding needed—just connect your calendar and we handle the rest.", () => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'assistant',
          text: "I'll be live on your branded page in 72 hours. No coding needed—just connect your calendar and we handle the rest.",
          timestamp: Date.now()
        }]);
        setCurrentChips(['Start pilot', 'See pricing', 'Book demo call']);
        setShowChips(true);
      });
      
    } else if (chip === 'Book a demo call') {
      simulateTyping("I'd love to show you a personalized demo! Let me connect you with our team.", () => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'assistant',
          text: "I'd love to show you a personalized demo! Let me connect you with our team.",
          timestamp: Date.now()
        }]);
        // Could add a calendar booking flow here
      });
      
    } else if (chip === 'Start pilot') {
      trackEvent('cta_click_pilot', { location: 'consultation_hero' });
      router.push('/checkout-pilot');
      
    } else if (chip === 'Book full setup') {
      trackEvent('cta_click_full', { location: 'consultation_hero' });
      router.push('/checkout-full');
    }
  };

  const handleSkipToDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('features');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="min-h-screen bg-gradient-to-br from-background-secondary to-background-primary relative">
      {/* Minimal Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold text-text-primary">MedSpa AI</div>
        </div>
      </nav>

      {/* Full viewport consultation card */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-[85vh] lg:h-[80vh]">
            
            {/* Left: Avatar (3:4 aspect ratio) */}
            <div className="relative bg-gradient-to-br from-background-secondary to-background-tertiary">
              {/* Top bar */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text-primary">Sarah — AI</span>
                  <span className="px-2 py-0.5 bg-teal/10 text-teal text-xs rounded-full">Demo</span>
                </div>
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="text-text-secondary hover:text-text-primary transition-colors"
                    aria-label="What is this?"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  {showTooltip && (
                    <div className="absolute right-0 top-8 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
                      Interactive demo. No patient data stored.
                    </div>
                  )}
                </div>
              </div>

              {/* Video Container - Full size */}
              <div className="absolute inset-0">
                <video
                  ref={videoRef}
                  src={getVideoSrc()}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  onLoadedData={() => setVideoLoaded(true)}
                  aria-label="Virtual assistant Sarah"
                />
                
                {!videoLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background-card">
                    <div className="animate-pulse text-text-secondary">Loading Sarah...</div>
                  </div>
                )}
              </div>

              {/* Status strip */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-xs text-text-tertiary text-center">
                  no-code • setup 72h • HIPAA-safe lead capture
                </div>
              </div>
            </div>

            {/* Right: Chat Interface */}
            <div className="flex flex-col h-full p-6">
              {/* Progress indicator */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-text-secondary">Step {currentStep} of 3</span>
                    <span className="text-xs text-text-tertiary">Demo • no patient data</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          step <= currentStep ? 'bg-teal' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal transition-all duration-500"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* Chat messages */}
              <div 
                ref={chatRef}
                className="flex-1 overflow-y-auto mb-4 space-y-3"
                role="log"
                aria-live="polite"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
                      message.type === 'user' 
                        ? 'bg-teal text-white' 
                        : 'bg-background-secondary text-text-primary border border-border-light'
                    }`}>
                      {message.text}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-background-secondary px-4 py-2.5 rounded-2xl border border-border-light">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-text-tertiary mr-2">Thinking</span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Demo Button */}
              {showDemoButton && (
                <div className="mb-4">
                  <button
                    onClick={() => startDemo()}
                    onMouseEnter={cancelAutoStart}
                    className="w-full h-44 sm:h-11 bg-teal hover:bg-teal-hover text-white rounded-lg font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-opacity-50 flex items-center justify-center text-lg"
                  >
                    See it work (20s)
                  </button>
                  
                  {/* Small navigation links under button */}
                  <div className="flex justify-center gap-4 mt-3 text-xs text-text-tertiary">
                    <button
                      onClick={() => {
                        cancelAutoStart();
                        const element = document.getElementById('pricing');
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="hover:text-teal transition-colors"
                    >
                      Pricing
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => {
                        cancelAutoStart();
                        const element = document.getElementById('features');
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="hover:text-teal transition-colors"
                    >
                      Features
                    </button>
                    <span>·</span>
                    <Link
                      href="#features"
                      onClick={(e) => {
                        cancelAutoStart();
                        handleSkipToDetails(e);
                      }}
                      className="hover:text-teal transition-colors"
                    >
                      Skip to details ↓
                    </Link>
                  </div>
                </div>
              )}

              {/* Post-demo Chips */}
              {showChips && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {currentChips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleChipClick(chip)}
                        className="px-4 py-2 bg-white border-2 border-border-light rounded-full text-text-primary hover:border-teal hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-opacity-50"
                        aria-label={`Select ${chip}`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Rail - Only visible at Step 3 */}
              {currentStep === 3 && (
                <div className="pt-4 border-t border-border-light">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        trackEvent('cta_click_pilot', { location: 'consultation_hero' });
                        router.push('/checkout-pilot');
                      }}
                      className="flex-1 py-3 px-6 bg-teal hover:bg-teal-hover text-white rounded-lg font-semibold shadow-md transition-all duration-200"
                    >
                      Start 14-Day Pilot ($297)
                    </button>
                    <button
                      onClick={() => {
                        trackEvent('cta_click_full', { location: 'consultation_hero' });
                        router.push('/checkout-full');
                      }}
                      className="flex-1 py-3 px-6 bg-white border-2 border-border text-text-primary hover:bg-background-tertiary rounded-lg font-semibold transition-all duration-200"
                    >
                      Book Full Setup
                    </button>
                  </div>
                  <p className="text-xs text-text-tertiary text-center mt-2">
                    Live in 72 hours on a branded page · Optional website embed
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}