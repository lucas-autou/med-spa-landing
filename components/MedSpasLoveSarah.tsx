'use client';

import { useEffect, useState, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

interface MetricCardProps {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
}

function MetricCard({ value, label, prefix = '', suffix = '', delay = 0 }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState('0');
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current).toString());
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, value, delay]);

  return (
    <div ref={cardRef} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-text-primary">
        {prefix}{displayValue}{suffix}
      </div>
      <div className="text-sm text-text-secondary mt-1">{label}</div>
    </div>
  );
}

export default function MedSpasLoveSarah() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const testimonials = [
    {
      quote: "Game-changer! Our virtual receptionist captured 40% more leads in the first month. Sarah books appointments while I sleep.",
      author: "Sarah Martinez",
      business: "Beverly Hills Aesthetics",
      avatar: "SM",
      rating: 5,
      metric: "40% more leads"
    },
    {
      quote: "21 new bookings in the first week alone. The ROI was immediate and Sarah handles everything professionally.",
      author: "Dr. Jennifer Chen",
      business: "Glow Medical Spa",
      avatar: "JC",
      rating: 5,
      metric: "21 bookings/week"
    },
    {
      quote: "Sarah answers 3am inquiries and books them for morning appointments. Never miss another client again.",
      author: "Michael Thompson",
      business: "Luxe Wellness Miami",
      avatar: "MT",
      rating: 5,
      metric: "24/7 coverage"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background-primary to-background-secondary">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            Med Spas Love Sarah
          </h2>
          <p className="text-lg text-text-secondary">
            Real results from real med spa owners
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Left: Video Testimonial with Play Button */}
          <div className="relative">
            <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl aspect-video relative group cursor-pointer">
              {/* Thumbnail/Video Player */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                {/* Play Button */}
                <button 
                  onClick={() => trackEvent('testimonial_video_play')}
                  className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl"
                  aria-label="Play testimonial video"
                >
                  <svg className="w-8 h-8 text-teal ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </button>
              </div>
              
              {/* Overlay Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="text-white">
                  <p className="font-semibold text-lg">Dr. Sarah Martinez</p>
                  <p className="text-sm opacity-90">Beverly Hills Aesthetics</p>
                </div>
              </div>
            </div>
            
            {/* Star Rating */}
            <div className="flex items-center justify-center mt-4 gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            
            {/* Testimonial Quote */}
            <div className="mt-4 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-700 italic leading-relaxed">
                &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    — {testimonials[currentTestimonial].author}
                  </p>
                  <p className="text-xs text-gray-500">
                    {testimonials[currentTestimonial].business}
                  </p>
                </div>
                <div className="bg-teal/10 text-teal px-3 py-1 rounded-full text-sm font-semibold">
                  {testimonials[currentTestimonial].metric}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Booking Conversation */}
          <div className="relative">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-teal to-teal-hover p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">S</span>
                    </div>
                    <div>
                      <p className="font-semibold">Real booking from Sarah:</p>
                      <p className="text-xs opacity-90">Captured at 11:47 PM last night</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-xs">Live</span>
                  </div>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="p-4 space-y-3 bg-gray-50">
                <div className="flex justify-end">
                  <div className="bg-teal text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%]">
                    <p className="text-sm">Hi! I&apos;d like to book Botox for next week</p>
                  </div>
                </div>
                
                <div className="flex justify-start gap-2">
                  <div className="w-8 h-8 bg-teal rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm">
                    <p className="text-sm text-gray-700">
                      Perfect! I have Thursday at 2:30pm or Friday at 10am available. 
                      Which works better?
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div className="bg-teal text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%]">
                    <p className="text-sm">Thursday at 2:30pm works great</p>
                  </div>
                </div>
                
                <div className="flex justify-start gap-2">
                  <div className="w-8 h-8 bg-teal rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm">
                    <p className="text-sm text-gray-700">
                      Excellent! You&apos;re all set for Thursday at 2:30pm. 
                      You&apos;ll receive a confirmation text shortly.
                    </p>
                  </div>
                </div>
                
                {/* Success Badge */}
                <div className="flex justify-center pt-2">
                  <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Booked</span>
                  </div>
                </div>
              </div>
              
              {/* Stats Footer */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center justify-around text-center">
                  <div>
                    <p className="text-sm font-semibold text-teal">✓ Booked</p>
                    <p className="text-xs text-gray-500">Automatically</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div>
                    <p className="text-sm font-semibold text-teal">✓ Calendar synced</p>
                    <p className="text-xs text-gray-500">Instantly</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div>
                    <p className="text-sm font-semibold text-teal">✓ SMS sent</p>
                    <p className="text-xs text-gray-500">Confirmed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <MetricCard value="21" label="New bookings" suffix="" delay={0} />
            <MetricCard value="9,400" label="Extra revenue" prefix="$" delay={200} />
            <MetricCard value="3" label="Response time" suffix=" sec" delay={400} />
            <MetricCard value="92" label="Show rate" suffix="%" delay={600} />
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-text-tertiary">First month ∙ Monthly average</p>
            <p className="text-xs text-text-tertiary mt-1">vs 78% before</p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <svg className="w-5 h-5 text-teal" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>200+ Med Spas</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <svg className="w-5 h-5 text-teal" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>Miami • LA • Dallas • NYC</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <svg className="w-5 h-5 text-teal" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100 4h2a1 1 0 100 2 2 2 0 01-2 2H4a2 2 0 01-2-2V5z" clipRule="evenodd" />
            </svg>
            <span>Live in 72 hours</span>
          </div>
        </div>
      </div>
    </section>
  );
}