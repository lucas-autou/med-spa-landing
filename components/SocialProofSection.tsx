'use client';

import { Star, Play } from 'lucide-react';
import { useState } from 'react';

export default function SocialProofSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-16 sm:py-20 bg-background-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Med Spas Love Sarah
            </h2>
            <p className="text-lg text-text-secondary">
              Real results from real med spa owners
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Video Testimonial */}
            <div>
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video group cursor-pointer"
                   onClick={() => setIsPlaying(!isPlaying)}>
                {!isPlaying ? (
                  <>
                    {/* Placeholder for video thumbnail */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-purple-500/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-teal-600 ml-1" />
                        </div>
                      </div>
                    </div>
                    {/* Owner info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white font-semibold">Dr. Sarah Martinez</p>
                      <p className="text-white/80 text-sm">Beverly Hills Aesthetics</p>
                    </div>
                  </>
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-black">
                    <p className="text-white">Video player would load here</p>
                  </div>
                )}
              </div>
              
              {/* Testimonial Quote */}
              <div className="mt-6 p-6 bg-white rounded-xl shadow-md">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-text-primary font-medium italic mb-3">
                  &ldquo;Game-changer! Our virtual receptionist captured 40% more leads in the first month. 
                  Sarah books appointments while I sleep.&rdquo;
                </p>
                <p className="text-sm text-text-secondary">
                  — Sarah Martinez, Beverly Hills Aesthetics
                </p>
              </div>
            </div>

            {/* Booking Screenshot & Stats */}
            <div>
              {/* Screenshot */}
              <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-xs text-text-tertiary mb-3">Real booking from Sarah:</p>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="bg-gray-200 rounded-lg rounded-tl-none p-3">
                          <p className="text-sm text-text-primary">Hi! I&apos;d like to book Botox for next week</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-teal-500 rounded-full flex-shrink-0 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">S</span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-teal-50 rounded-lg rounded-tl-none p-3">
                          <p className="text-sm text-text-primary">Perfect! I have Thursday at 2:30pm or Friday at 10am available. Which works better?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      ✓ Booked
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      ✓ Calendar synced
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      ✓ SMS sent
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 text-center shadow-md">
                  <p className="text-3xl font-bold text-teal-600 mb-1">21</p>
                  <p className="text-sm text-text-secondary">New bookings</p>
                  <p className="text-xs text-text-tertiary">First month</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-md">
                  <p className="text-3xl font-bold text-teal-600 mb-1">$9,400</p>
                  <p className="text-sm text-text-secondary">Extra revenue</p>
                  <p className="text-xs text-text-tertiary">Monthly average</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-md">
                  <p className="text-3xl font-bold text-teal-600 mb-1">3 sec</p>
                  <p className="text-sm text-text-secondary">Response time</p>
                  <p className="text-xs text-text-tertiary">24/7 availability</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-md">
                  <p className="text-3xl font-bold text-teal-600 mb-1">92%</p>
                  <p className="text-sm text-text-secondary">Show rate</p>
                  <p className="text-xs text-text-tertiary">vs 78% before</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}