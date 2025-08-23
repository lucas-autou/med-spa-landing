'use client';

import { trackEvent } from '@/lib/analytics';


export default function MedSpasLoveSarah() {

  return (
    <>
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-background-secondary">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-teal/10 text-teal px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Real Customer Results
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 leading-tight">
            Sarah Turns Missed Messages
            <span className="block text-teal">Into Bookings</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            See how med spa owners nationwide capture every lead, 24/7
          </p>
        </div>

        {/* Hero Visual Contrast - Before/After Section */}
        <div className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl border border-gray-100 p-8 lg:p-12 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                
                {/* Before Section */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-bold text-red-600 uppercase tracking-wide">Before Sarah</span>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-red-900 font-semibold text-lg mb-2">Client messaged at 11:47pm...</p>
                        <p className="text-red-800 mb-3">Still waiting for a reply the next morning.</p>
                        <div className="inline-flex items-center gap-2 bg-red-200/50 text-red-800 px-3 py-1.5 rounded-full text-sm font-medium">
                          <span>⚠️ Slow replies = lost clients</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* After Section */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 bg-teal rounded-full"></div>
                    <span className="text-sm font-bold text-teal uppercase tracking-wide">With Sarah</span>
                  </div>
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-200 rounded-2xl p-6">
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-br-lg text-sm max-w-[80%] shadow-sm">
                          hey do you have openings next week?
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-teal text-white px-4 py-3 rounded-2xl rounded-bl-lg text-sm max-w-[85%] shadow-sm font-medium">
                          Yes! I have Thursday 2:30pm or Friday 10am for Botox.
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-br-lg text-sm max-w-[80%] shadow-sm">
                          thursday works
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-teal text-white px-4 py-3 rounded-2xl rounded-bl-lg text-sm max-w-[85%] shadow-sm font-medium">
                          Perfect! You're booked for Thursday at 2:30pm.
                        </div>
                      </div>
                      <div className="text-center mt-8">
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-5 py-2.5 rounded-full font-bold">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Booking Confirmed Instantly
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Three Testimonials Row */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-teal uppercase tracking-wide mb-2">Customer Results</p>
            <h3 className="text-2xl font-bold text-gray-900">Real stories from spa owners nationwide</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Featured: Sarah Martinez - Larger/Highlighted */}
            <div className="lg:col-span-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal/20 to-teal/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-2xl border-2 border-teal/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-center gap-1 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">Featured</span>
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal to-teal-hover rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">SM</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Sarah Martinez</p>
                    <p className="text-sm text-gray-600">Beverly Hills Aesthetics</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
                      <span className="font-bold text-sm">+$8,400</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-800 font-medium leading-relaxed">
                  "Sarah captured 18 extra bookings last month — answering late-night DMs I used to miss."
                </p>
              </div>
            </div>
            
            {/* Michael T. */}
            <div className="relative group">
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">MT</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Michael T.</p>
                    <p className="text-sm text-gray-600">Luxe Wellness Miami</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      <span>+12 clients</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-800 font-medium leading-relaxed">
                  "Sarah books our after-hours leads before we even open — we've added 12 new clients in 3 weeks."
                </p>
              </div>
            </div>
            
            {/* Dr. L. */}
            <div className="relative group">
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">DL</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Dr. L.</p>
                    <p className="text-sm text-gray-600">Dallas Med Spa</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      <span>+$6,200</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-800 font-medium leading-relaxed">
                  "We finally stopped missing Instagram DMs — Sarah turned them into $6,200 last month."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Realistic Stats Section - Proof before CTA */}
        <div className="text-center py-16 pb-8">
          <div className="mb-10">
            <p className="text-sm font-semibold text-teal uppercase tracking-wide mb-3">Average Spa Results — First 30 Days</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Based on Client Data
            </h3>
            <p className="text-gray-600 text-sm">
              Typical results spas see when Sarah starts handling their messages.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* More Bookings */}
              <div className="text-center group">
                <div className="text-2xl mb-2">📈</div>
                <p className="text-xl font-bold text-gray-900 mb-1">6–12 More</p>
                <p className="text-sm text-gray-600 font-medium">Bookings / Month</p>
              </div>
              
              {/* Extra Revenue */}
              <div className="text-center group">
                <div className="text-2xl mb-2">💰</div>
                <p className="text-xl font-bold text-gray-900 mb-1">$2.5K–$5K</p>
                <p className="text-sm text-gray-600 font-medium">Extra Revenue</p>
              </div>
              
              {/* Response Time */}
              <div className="text-center group">
                <div className="text-2xl mb-2">⚡</div>
                <p className="text-xl font-bold text-gray-900 mb-1">Under 10s</p>
                <p className="text-sm text-gray-600 font-medium">Avg. Response Time</p>
              </div>
              
              {/* Show Rate */}
              <div className="text-center group">
                <div className="text-2xl mb-2">📅</div>
                <p className="text-xl font-bold text-gray-900 mb-1">90%+</p>
                <p className="text-sm text-gray-600 font-medium">Show Rate</p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Full-Width CTA Strip - Premium conversion section */}
    <section className="py-14 bg-gradient-to-br from-teal via-teal to-teal-hover relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <h3 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
          Never Miss a Client Again
        </h3>
        <p className="text-2xl text-white/95 mb-10 font-medium">
          Go live in 48h. Risk-free 14-day pilot for $97.
        </p>
        
        <div className="relative group inline-block mb-8">
          <div className="absolute -inset-2 bg-white/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition duration-500"></div>
          <button 
            onClick={() => {
              trackEvent('cta_click_pilot_testimonial');
              window.open('/checkout-pilot', '_blank');
            }}
            className="relative inline-flex items-center gap-4 bg-white text-teal hover:bg-gray-50 px-16 py-7 rounded-3xl font-bold text-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 border border-white/20"
          >
            Start Your 14-Day Pilot for $97
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
        
        {/* Strong guarantee - highlighted */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full mb-4">
            <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-lg">Book 1 lead or get your money back</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 text-base font-medium mb-6">
          <span>Cancel anytime</span>
          <div className="w-1 h-1 bg-white/50 rounded-full"></div>
          <span>48h setup</span>
          <div className="w-1 h-1 bg-white/50 rounded-full"></div>
          <span>No contracts</span>
        </div>

        {/* Trust badge */}
        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 py-2.5 rounded-full">
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
          <span className="font-semibold text-sm">Trusted by 200+ spas nationwide</span>
        </div>
      </div>
    </section>

    {/* Where Sarah Lives - New section with light background */}
    <section className="py-20 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-teal uppercase tracking-wide mb-3">Where Sarah Lives</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            She's everywhere your clients are
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sarah seamlessly integrates with all the places your clients already message you
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Central Hub */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal/10 to-teal/5 rounded-full blur-3xl"></div>
            <div className="relative bg-white rounded-3xl border-2 border-teal/20 p-8 shadow-xl max-w-md mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-teal to-teal-hover rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Sarah</h4>
                <p className="text-sm text-gray-600">Your Virtual Receptionist</p>
                <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium mt-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Always Online
                </div>
              </div>
            </div>
          </div>

          {/* Integration Points - Positioned around Sarah */}
          <div className="absolute inset-0 pointer-events-none">
            
            {/* Website Chat - Top Left */}
            <div className="absolute top-0 left-8 lg:left-16">
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Website Chat</p>
                    <p className="text-xs text-gray-500">Live on your site</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instagram - Top Right */}
            <div className="absolute top-0 right-8 lg:right-16">
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Instagram DMs</p>
                    <p className="text-xs text-gray-500">Never miss a DM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Facebook - Bottom Left */}
            <div className="absolute bottom-0 left-8 lg:left-16">
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Facebook Msgs</p>
                    <p className="text-xs text-gray-500">Messenger ready</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SMS - Bottom Right */}
            <div className="absolute bottom-0 right-8 lg:right-16">
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">SMS & Text</p>
                    <p className="text-xs text-gray-500">Text responses</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: -1}}>
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#14B8A6', stopOpacity: 0.3}} />
                <stop offset="100%" style={{stopColor: '#14B8A6', stopOpacity: 0.1}} />
              </linearGradient>
            </defs>
            <path d="M50,50 Q25,25 50,15 Q75,25 50,50 Q75,75 50,85 Q25,75 50,50" 
                  stroke="url(#connectionGradient)" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeDasharray="5,5"
                  className="animate-pulse" />
          </svg>
        </div>

        {/* Bottom message */}
        <div className="text-center mt-12">
          <p className="text-gray-600 font-medium">
            One Sarah, everywhere your clients expect an instant response
          </p>
        </div>
      </div>
    </section>

    {/* How It Works Section */}
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl">👉</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Go Live With Sarah in 3 Simple Steps
            </h2>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            We handle everything. From setup to 24/7 bookings in under 72 hours.
          </p>
          
          {/* 72h urgency badge */}
          <div className="inline-flex items-center gap-2 bg-teal/10 text-teal px-4 py-2 rounded-full text-sm font-bold">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Under 72 Hours
          </div>
        </div>

        {/* 3-Step Timeline */}
        <div className="relative">
          {/* Connection line - desktop only */}
          <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-0.5 bg-gradient-to-r from-teal/20 via-teal to-teal/20"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Step 1 - Setup */}
            <div className="relative text-center group">
              <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-teal/30 relative z-10">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-teal text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                
                {/* Icon */}
                <div className="text-4xl mb-4">⚙️</div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Setup <span className="text-teal">(Day 1)</span>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We connect your calendar & FAQs in minutes.
                </p>
                
                {/* Timeline dot - desktop */}
                <div className="hidden lg:block absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-teal rounded-full border-4 border-white shadow-lg"></div>
              </div>
            </div>

            {/* Step 2 - Sarah Trains */}
            <div className="relative text-center group">
              <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-teal/30 relative z-10">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-teal text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                
                {/* Icon */}
                <div className="text-4xl mb-4">📖</div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Sarah Trains <span className="text-teal">(Day 2)</span>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We train her on your services, pricing, and offers.
                </p>
                
                {/* Timeline dot - desktop */}
                <div className="hidden lg:block absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-teal rounded-full border-4 border-white shadow-lg"></div>
              </div>
            </div>

            {/* Step 3 - Go Live */}
            <div className="relative text-center group">
              <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-teal/30 relative z-10">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-teal text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                
                {/* Icon */}
                <div className="text-4xl mb-4">🚀</div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Go Live <span className="text-teal">(Day 3)</span>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Sarah starts answering and booking clients 24/7.
                </p>
                
                {/* Timeline dot - desktop */}
                <div className="hidden lg:block absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-teal rounded-full border-4 border-white shadow-lg"></div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom message */}
        <div className="text-center mt-16">
          <p className="text-lg font-semibold text-gray-900 mb-2">
            That's it. We do everything for you.
          </p>
          <p className="text-gray-600">
            While you focus on treatments, Sarah's booking your next clients.
          </p>
        </div>
      </div>
    </section>
    </>
  );
}