'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface Message {
  speaker: 'client' | 'sarah';
  text: string;
  delay: number; // milliseconds from start
}

const script: Message[] = [
  { speaker: 'client', text: "Hi! Do you have Botox this week?", delay: 1000 },
  { speaker: 'sarah', text: "Yes! I have Thursday 2:30 or 5:10. Any allergies to neuromodulators?", delay: 3500 },
  { speaker: 'client', text: "No allergies. 5:10 works.", delay: 7000 },
  { speaker: 'sarah', text: "Great, you're booked. I just texted prep info and our no-show policy.", delay: 9500 },
];

const completionChips = [
  { text: "Added to Google Calendar", delay: 13000 },
  { text: "SMS sent", delay: 13600 },
  { text: "Policy confirmed", delay: 14200 },
];

const finalMessage = { 
  speaker: 'sarah' as const, 
  text: "I'm here 24/7 so you never miss a booking.", 
  delay: 15000 
};

export default function ShowreelHero() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chips, setChips] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    startAnimation();
    
    // Add scroll listener for sticky CTA
    const handleScroll = () => {
      const scrolled = window.scrollY / window.innerHeight;
      setShowStickyCTA(scrolled > 0.3);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const startAnimation = () => {
    // Schedule all messages
    script.forEach((message) => {
      const timeout = setTimeout(() => {
        setMessages(prev => [...prev, message]);
      }, message.delay);
      timeoutRefs.current.push(timeout);
    });

    // Schedule completion chips
    completionChips.forEach((chip) => {
      const timeout = setTimeout(() => {
        setChips(prev => [...prev, chip.text]);
      }, chip.delay);
      timeoutRefs.current.push(timeout);
    });

    // Schedule final message
    const finalTimeout = setTimeout(() => {
      setShowFinalMessage(true);
    }, finalMessage.delay);
    timeoutRefs.current.push(finalTimeout);

    // Loop the animation
    const loopTimeout = setTimeout(() => {
      // Reset after a pause
      setTimeout(() => {
        setMessages([]);
        setChips([]);
        setShowFinalMessage(false);
        // Clear and restart
        timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
        timeoutRefs.current = [];
        startAnimation();
      }, 3000);
    }, 20000); // Total duration
    timeoutRefs.current.push(loopTimeout);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const scrollToDemo = () => {
    const demoSection = document.getElementById('interactive-demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] bg-gradient-to-b from-background-primary to-background-secondary overflow-hidden">
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Copy and CTAs */}
          <div className="space-y-6 lg:space-y-8 lg:pr-8 order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-text-primary leading-tight">
                Meet Sarah: Your 24/7 Receptionist That Books More Clients
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-text-secondary leading-relaxed">
                Instant replies. Direct bookings. Works with the tools you already use.
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
              <span className="flex items-center gap-2 font-medium">
                <span className="text-green-600 font-bold">✓</span> Live in 48h
              </span>
              <span className="flex items-center gap-2 font-medium">
                <span className="text-green-600 font-bold">✓</span> Cancel Anytime
              </span>
              <span className="flex items-center gap-2 font-medium">
                <span className="text-green-600 font-bold">✓</span> 14-Day Refund Guarantee
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={scrollToDemo}
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Talk to Sarah Now
              </button>
              <a
                href="/checkout-pilot"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-xl border-2 border-gray-300 text-text-primary hover:bg-gray-50 transition-all duration-200"
              >
                Start My Setup
              </a>
            </div>

            {/* Micro-proof and pricing transparency */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="text-sm text-green-700 font-semibold">
                    Full refund during pilot if not satisfied
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Setup $997 after pilot
                  </p>
                </div>
              </div>
            </div>

            {/* Social proof */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">+</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Trusted by med spas in Miami, LA, Dallas, NYC
                  </p>
                  <p className="text-xs text-text-tertiary">
                    Limited spots remaining for January setup
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Video showreel with overlay */}
          <div className="relative order-1 lg:order-2">
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md mx-auto lg:max-w-none">
              {/* Video container */}
              <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  poster="/videos/poster.jpg"
                >
                  <source src="/videos/idle.mp4" type="video/mp4" />
                </video>

                {/* Overlay chat bubbles */}
                <div className="absolute inset-0 p-2 sm:p-3 flex flex-col justify-end space-y-2 pointer-events-none">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.speaker === 'client' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div
                        className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm backdrop-blur-sm shadow-lg ${
                          message.speaker === 'client'
                            ? 'bg-blue-500/90 text-white rounded-br-sm'
                            : 'bg-white/95 text-gray-800 rounded-bl-sm'
                        }`}
                        style={{ backdropFilter: 'blur(8px)' }}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}

                  {/* Final message */}
                  {showFinalMessage && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="max-w-[75%] px-3 py-2 rounded-2xl text-sm bg-gradient-to-r from-teal-500/90 to-teal-600/90 text-white rounded-bl-sm backdrop-blur-sm shadow-lg"
                           style={{ backdropFilter: 'blur(8px)' }}>
                        {finalMessage.text}
                      </div>
                    </div>
                  )}

                  {/* Completion chips */}
                  {chips.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mt-3">
                      {chips.map((chip, index) => (
                        <div
                          key={index}
                          className="px-3 py-1 bg-green-100/95 text-green-700 rounded-full text-xs font-medium backdrop-blur-sm shadow-md"
                          style={{ 
                            backdropFilter: 'blur(8px)',
                            animationDelay: `${index * 0.6}s`,
                            animation: 'fadeIn 0.6s ease-out forwards'
                          }}
                        >
                          ✓ {chip}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Enhanced mute button */}
                <button
                  onClick={toggleMute}
                  className="absolute top-4 right-4 p-3 bg-black/70 hover:bg-black/90 rounded-full text-white transition-all duration-200 pointer-events-auto shadow-lg hover:scale-110"
                  aria-label={isMuted ? 'Unmute Video' : 'Mute Video'}
                >
                  {isMuted ? (
                    <div className="flex items-center gap-2">
                      <VolumeX size={18} />
                      <span className="text-xs hidden sm:block">🔊 Hear Sarah</span>
                    </div>
                  ) : (
                    <Volume2 size={18} />
                  )}
                </button>

                {/* Sarah label */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                  Sarah • AI Receptionist
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA for mobile */}
      {showStickyCTA && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50">
          <a
            href="/checkout-pilot"
            className="block w-full text-center py-3 px-6 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-all duration-200 shadow-lg"
          >
            Start Pilot — $297 credit
          </a>
        </div>
      )}
    </section>
  );
}