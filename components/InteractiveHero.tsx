'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useRouter } from 'next/navigation';
import { liveDemoInstance, type DemoMessage } from '@/lib/liveDemo';
import { detectContraindications } from '@/lib/nluShim';

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

export default function InteractiveHero() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Video and UI state
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoState, setVideoState] = useState<'idle' | 'listening' | 'talking'>('idle');
  
  // Demo state
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showCTARail, setShowCTARail] = useState(false);
  
  // Voice interface
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  // Input state
  const [textInput, setTextInput] = useState('');
  const [inputMode, setInputMode] = useState<'chips' | 'text' | 'name' | 'phone'>('chips');
  const [awaitingInput, setAwaitingInput] = useState<'name' | 'phone' | null>(null);

  // Process user input through live demo (defined early to avoid reference errors)
  const processUserInput = useCallback((input: string, isChipSelection: boolean) => {
    setIsTyping(true);
    setVideoState('listening');
    
    // Clear selected chip after short delay
    if (isChipSelection) {
      setTimeout(() => setSelectedChip(null), 300);
    }
    
    // Process through state machine
    setTimeout(() => {
      const newMessages = liveDemoInstance.processInput(input, isChipSelection);
      setMessages([...newMessages]);
      setIsTyping(false);
      setVideoState('talking');
      
      // Check if booking is complete to show CTA
      if (liveDemoInstance.isBookingComplete()) {
        setShowCTARail(true);
        trackEvent('cta_viewed');
      }
      
      // Update input mode based on latest message
      const latestMessage = newMessages[newMessages.length - 1];
      if (latestMessage && latestMessage.type === 'ai') {
        if (latestMessage.requiresInput) {
          setAwaitingInput(latestMessage.requiresInput);
          setInputMode(latestMessage.requiresInput);
        } else if (latestMessage.chips) {
          setInputMode('chips');
          setAwaitingInput(null);
        } else {
          setInputMode('text');
        }
      }
      
      // Return to idle after talking
      setTimeout(() => setVideoState('idle'), 2000);
    }, 400);
  }, []);

  // Handle voice input
  const handleVoiceInput = useCallback((transcript: string) => {
    if (transcript.trim()) {
      processUserInput(transcript.trim(), false);
      trackEvent('chip_select', { value: `voice: ${transcript}` });
    }
  }, [processUserInput]);

  // Check for voice support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(!!SpeechRecognition);
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      
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
  }, [handleVoiceInput]);

  // Initialize demo with greeting
  useEffect(() => {
    const initialMessages = liveDemoInstance.getMessages();
    setMessages(initialMessages);
    
    // Track initial view
    trackEvent('hero_view');
  }, []);
  
  // Scroll to latest content
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Video state mapping
  const getVideoSrc = () => {
    const basePath = '/videos/';
    switch (videoState) {
      case 'listening':
        return `${basePath}listening.mp4`;
      case 'talking':
        return `${basePath}talking_neutral.mp4`;
      default:
        return `${basePath}idle.mp4`;
    }
  };

  // Handle chip selection
  const handleChipClick = (chipLabel: string) => {
    setSelectedChip(chipLabel);
    trackEvent('chip_select', { value: chipLabel });
    processUserInput(chipLabel, true);
  };

  // Handle text input submission
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      const input = textInput.trim();
      
      // Check for contraindications
      if (detectContraindications(input)) {
        trackEvent('chip_select', { value: `contraindication: ${input}` });
      } else {
        trackEvent('answer_sent', { input });
      }
      
      processUserInput(input, false);
      setTextInput('');
    }
  };
  
  // Toggle voice mode
  const toggleVoiceMode = () => {
    if (!voiceSupported) return;
    setIsVoiceMode(!isVoiceMode);
    trackEvent('chip_select', { value: `voice_mode: ${!isVoiceMode}` });
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
        trackEvent('chip_select', { value: 'voice_start' });
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
  
  // Get current message chips
  const getCurrentChips = () => {
    const latestMessage = messages[messages.length - 1];
    return latestMessage?.type === 'ai' ? latestMessage.chips || [] : [];
  };
  
  // Get input placeholder based on mode
  const getInputPlaceholder = () => {
    switch (inputMode) {
      case 'name':
        return 'Enter your first name...';
      case 'phone':
        return 'Enter your phone number...';
      default:
        return 'Ask about pricing, setup time, calendars...';
    }
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
            <div className="relative p-6 lg:p-8">
              <div className="sticky top-6">
                {/* Video Container */}
                <div className="relative w-full max-w-md mx-auto lg:max-w-none">
                  <div className="aspect-[3/4] lg:aspect-[3/4] min-h-[480px] max-h-[680px] lg:min-h-0 lg:max-h-none rounded-2xl overflow-hidden bg-background-card">
                  <video
                    ref={videoRef}
                    src={getVideoSrc()}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    onLoadedData={() => setVideoLoaded(true)}
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
                      I'm here 24/7 to answer questions and book appointments
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
            </div>

            {/* Right: Chat Interface */}
            <div className="flex flex-col h-[500px] md:h-[600px] lg:h-[700px] p-6 lg:p-8 lg:border-l lg:border-border-default bg-gray-50 lg:bg-transparent">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text-primary font-medium">
                      Live Demo
                    </span>
                    {voiceSupported && (
                      <button
                        onClick={toggleVoiceMode}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          isVoiceMode 
                            ? 'bg-teal text-white' 
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        title={isVoiceMode ? 'Switch to text mode' : 'Enable voice mode'}
                      >
                        🎤 {isVoiceMode ? 'Voice On' : 'Voice Off'}
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-text-tertiary">Interactive • no patient data stored</span>
                </div>
              </div>

              {/* Chat Interface */}
              <div 
                ref={chatRef}
                className="flex-1 overflow-y-auto bg-white rounded-2xl border border-border-light p-6 mb-6 space-y-4 animate-step-transition"
                role="log"
                aria-live="polite"
                aria-label="Demo conversation"
              >
                {/* Messages */}
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`max-w-[62%] md:max-w-[58%] px-4 py-3 rounded-2xl drop-shadow-sm ${
                      message.type === 'user' 
                        ? 'bg-teal text-white' 
                        : 'bg-gray-50 text-text-primary'
                    }`}>
                      {message.text}
                    </div>
                  </div>
                ))}
                
                {/* Status Cards (for booking confirmations) */}
                {messages.length > 0 && messages[messages.length - 1]?.cards && (
                  <div className="flex flex-wrap gap-2 justify-start animate-fade-in">
                    {messages[messages.length - 1].cards?.map((card, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <span>{card.icon}</span>
                        <span>{card.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-50 px-4 py-2 rounded-2xl">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Voice transcript preview with better positioning */}
                {isListening && currentTranscript && (
                  <div className="flex justify-end mb-2">
                    <div className="max-w-[62%] md:max-w-[58%] px-4 py-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-2xl text-sm italic drop-shadow-sm">
                      {currentTranscript}...
                    </div>
                  </div>
                )}
              </div>

              {/* Action Chips with improved readability */}
              {inputMode === 'chips' && getCurrentChips() && getCurrentChips()!.length > 0 && (
                <div className="mb-6 pb-5 md:pb-6">
                  <div className="flex flex-wrap gap-x-2.5 md:gap-x-3 gap-y-2">
                    {getCurrentChips()!.map((chipLabel, index) => {
                      const isSelected = selectedChip === chipLabel;
                      const isPilotCTA = chipLabel.includes('Start 14-Day Pilot');
                      
                      return (
                        <button
                          key={index}
                          onClick={() => handleChipClick(chipLabel)}
                          className={`text-[13px] md:text-sm px-3 py-1.5 min-h-[28px] md:min-h-[32px] font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-teal focus:ring-opacity-50 transition-all duration-200 ${
                            isSelected
                              ? 'bg-teal text-white transform scale-105 shadow-lg'
                              : isPilotCTA
                              ? 'bg-teal hover:bg-teal-hover text-white shadow-md hover:shadow-lg'
                              : 'bg-white/85 backdrop-blur-sm ring-1 ring-black/5 shadow-sm text-text-primary hover:ring-teal hover:shadow-md'
                          }`}
                          style={!isSelected && !isPilotCTA ? {animationDelay: `${index * 0.6}s`} : {}}
                          aria-label={`Select ${chipLabel}`}
                        >
                          {chipLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Text Input - when not using chips */}
              {(inputMode === 'text' || inputMode === 'name' || inputMode === 'phone') && (
                <div className="mb-4">
                  <form onSubmit={handleTextSubmit}>
                    <div className="flex gap-2">
                      <input
                        ref={inputRef}
                        type={inputMode === 'phone' ? 'tel' : 'text'}
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder={getInputPlaceholder()}
                        className="flex-1 px-4 py-3 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                        aria-label={getInputPlaceholder()}
                        required={inputMode === 'name' || inputMode === 'phone'}
                      />
                      
                      {/* Voice button in text mode */}
                      {isVoiceMode && voiceSupported && (
                        <button
                          type="button"
                          onClick={toggleListening}
                          className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                            isListening
                              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                          title={isListening ? 'Release to stop' : 'Push to talk'}
                        >
                          🎤
                        </button>
                      )}
                      
                      <button
                        type="submit"
                        disabled={!textInput.trim()}
                        className="px-6 py-3 bg-teal hover:bg-teal-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200"
                        aria-label="Send message"
                      >
                        {inputMode === 'name' || inputMode === 'phone' ? 'Submit' : 'Send'}
                      </button>
                    </div>
                  </form>
                  
                  {/* Voice transcript display */}
                  {isListening && (
                    <div className="mt-2 text-sm text-gray-600 italic">
                      {currentTranscript ? `Listening: "${currentTranscript}"` : 'Listening... speak now'}
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Rail CTAs - Show after booking success */}
              {showCTARail && (
                <div className="mt-auto animate-fade-in">
                  <div className="flex flex-col sm:flex-row gap-3 bg-gray-50 p-6 -mx-6 -mb-6 rounded-b-2xl border-t border-border-light">
                    <button
                      onClick={() => handleCTAClick('pilot')}
                      className="flex-1 py-3 px-6 bg-teal hover:bg-teal-hover text-white rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
                      aria-label="Start 14-day pilot for $297"
                    >
                      Start 14-Day Pilot ($297)
                      <div className="text-xs opacity-75 mt-1">(credited if you continue)</div>
                    </button>
                    <button
                      onClick={() => handleCTAClick('full')}
                      className="flex-1 py-3 px-6 bg-transparent border-2 border-border-default text-text-primary hover:bg-background-tertiary hover:border-teal rounded-xl font-semibold transition-all duration-200"
                      aria-label="Book full setup"
                    >
                      Book Full Setup
                    </button>
                  </div>
                  
                  <div className="text-center text-xs text-text-tertiary mt-3">
                    Live in 72 hours on a branded page · Optional website embed
                  </div>
                </div>
              )}
              
              {/* Footer microcopy when CTA rail not shown */}
              {!showCTARail && (
                <div className="mt-auto">
                  <div className="text-center text-xs text-text-tertiary py-2">
                    Live in 72 hours on a branded page · Optional website embed
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}