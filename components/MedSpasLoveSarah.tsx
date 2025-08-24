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

        {/* Med Spa Testimonials Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-teal uppercase tracking-wide mb-2">TESTIMONIALS</p>
            <h3 className="text-3xl font-bold text-gray-900">Our clients say it best</h3>
            <p className="text-gray-600 mt-3 text-lg">Real success stories from our clients</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

            {/* Testimonial 1 - Beverly Hills Aesthetics */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" opacity="0.5"/>
                </svg>
                <img
                  src="/logos/loreal.png"
                  alt="Loreal"
                  className="h-6 max-w-[60px] object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
                "This app is amazing! It's great to have digital working for us, you nailed it!<span className="font-semibold text-gray-900"> ‍So good to have these answers automatically. 🥰"</span>
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center gap-3">
                  <img
                    src="/profiles/florinda.jpeg"
                    alt="Nathalia Florindo"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Nathalia Florindo</p>
                    <p className="text-sm text-gray-500">Global Manager</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500">L'Oréal Paris</p>
                  <p className="text-xs text-gray-400"></p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 - Miami Glow Med Spa */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" opacity="0.5"/>
                </svg>
                <img
                  src="/logos/jeep.png"
                  alt="Jeep"
                  className="h-6 max-w-[60px] object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
                “Well-deserved recognition for an outstanding result. A big shoutout to the colleagues who <span className="font-semibold text-gray-900">drove this transformation and brought our automation to life</span>, now expanded to multiple countries. (…) <span className="font-semibold text-gray-900">Thanks to our partners at AutoU.</span>“
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center gap-3">
                  <img
                    src="/profiles/flecha.jpeg"
                    alt="Mateus Flecha"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Mateus Flecha</p>
                    <p className="text-sm text-gray-500">Vice President</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500">Stellantis</p>
                  <p className="text-xs text-gray-400">Jeep & Fiat</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 - Pure Wellness Dallas */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" opacity="0.5"/>
                </svg>
                <img
                  src="/logos/prudential.png"
                  alt="Prudential"
                  className="h-6 max-w-[60px] object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
                “Thank you for the work, team. <span className="font-semibold text-gray-900">The automated flow</span> we envisioned at the start of our setup is <span className="font-semibold text-gray-900">being delivered just as planned.”</span>
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center gap-3">
                  <img
                    src="/profiles/roman.webp"
                    alt="Roman Davis"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Roman Davis</p>
                    <p className="text-sm text-gray-500">Custommer Coordinator</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500">Prudential</p>
                  <p className="text-xs text-gray-400"></p>
                </div>
              </div>
            </div>

            {/* Testimonial 4 - Elite Skin NYC */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" opacity="0.5"/>
                </svg>
                <img
                  src="/logos/nestle.png"
                  alt="L'Oréal Clinic Partner"
                  className="h-6 max-w-[60px] object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
                “We have been trying to connect with our clients like this for years and never succeeded. <span className="font-semibold text-gray-900">Now we are able to answer thousands of leads instantly with AI</span>”
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center gap-3">
                  <img
                    src="/profiles/marie.jpeg"
                    alt="Marie Lambert"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Marie Lambert</p>
                    <p className="text-sm text-gray-500">Manager</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500">Nestlé</p>
                  <p className="text-xs text-gray-400"></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real AutoU Stats Section - Enterprise Proven Technology */}
        <div className="text-center py-12 pb-6">
          <div className="mb-8">
            <p className="text-sm font-semibold text-teal uppercase tracking-wide mb-2">Our Clients</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Built by AutoU — the AI company behind Fortune 500 leaders
            </h3>
            <p className="text-gray-600 text-base max-w-3xl mx-auto">
              Sarah is built, trained and managed by AutoU, a global tech company trusted by leaders across multiple industries. Some of our clients include:
            </p>
          </div>

          {/* Client Logos */}
          <div className="mb-10">
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 max-w-5xl mx-auto px-4">
              {/* L'Oréal */}
              <img src="/logos/loreal.png" alt="L'Oréal" className="h-6 max-w-[80px] object-contain opacity-50 hover:opacity-100 transition-opacity" />
              {/* Colgate */}
              <img src="/logos/colgate.png" alt="Colgate" className="h-6 max-w-[80px] object-contain opacity-50 hover:opacity-100 transition-opacity" />
              {/* Nestlé */}
              <img src="/logos/nestle.png" alt="Nestlé" className="h-6 max-w-[80px] object-contain opacity-50 hover:opacity-100 transition-opacity" />
              {/* Jeep */}
              <img src="/logos/jeep.png" alt="Jeep" className="h-6 max-w-[80px] object-contain opacity-50 hover:opacity-100 transition-opacity" />
              {/* Jaguar */}
              <img src="/logos/jaguar.jpg.avif" alt="Jaguar" className="h-6 max-w-[80px] object-contain opacity-50 hover:opacity-100 transition-opacity" />
              {/* Prudential */}
              <img src="/logos/prudential.png" alt="Prudential" className="h-6 max-w-[80px] object-contain opacity-50 hover:opacity-100 transition-opacity" />
              {/* Saint-Gobain */}
              <img src="/logos/saint-gobain.png" alt="Saint-Gobain" className="h-6 max-w-[80px] object-contain opacity-50 hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Total Users */}
              <div className="text-center group">
                <div className="text-2xl mb-2">🌍</div>
                <p className="text-xl font-bold text-gray-900 mb-1">100K+</p>
                <p className="text-sm text-gray-600 font-medium">Total Users</p>
              </div>

              {/* Value Generated */}
              <div className="text-center group">
                <div className="text-2xl mb-2">💰</div>
                <p className="text-xl font-bold text-gray-900 mb-1">$12.6M+</p>
                <p className="text-sm text-gray-600 font-medium">Saved with AI</p>
              </div>

              {/* Countries */}
              <div className="text-center group">
                <div className="text-2xl mb-2">🗺️</div>
                <p className="text-xl font-bold text-gray-900 mb-1">15+</p>
                <p className="text-sm text-gray-600 font-medium">Countries</p>
              </div>

              {/* Enterprise Clients */}
              <div className="text-center group">
                <div className="text-2xl mb-2">🏢</div>
                <p className="text-xl font-bold text-gray-900 mb-1">40+</p>
                <p className="text-sm text-gray-600 font-medium">Enterprise Clients</p>
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
          Go live in 48–72h. 14-day pilot for $97.
        </p>

        <div className="relative group inline-block mb-8">
          <div className="absolute -inset-2 bg-white/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition duration-500"></div>
          <button
            onClick={() => {
              trackEvent('cta_click_pilot_testimonial');
              const pricingSection = document.getElementById('pricing-section');
              if (pricingSection) {
                pricingSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.open('/checkout-pilot', '_blank');
              }
            }}
            className="relative inline-flex items-center gap-4 bg-white text-teal hover:bg-gray-50 px-16 py-7 rounded-3xl font-bold text-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 border border-white/20"
          >
            Start 14-Day Pilot — $97
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Microcopy under button */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/90 text-base font-medium">
            <span>Keep all leads</span>
            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
            <span>1-lead money-back</span>
            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
            <span>Cancel anytime</span>
          </div>
        </div>

        {/* Trust badge */}
        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 py-2.5 rounded-full">
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
          <span className="font-semibold text-sm">Trusted by L'Oréal, Fiat, Nestlé & 40+ industry leaders</span>
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
                <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4 ring-2 ring-teal/20">
                  <img
                    src="/videos/poster.jpg"
                    alt="Sarah - Virtual Receptionist"
                    className="w-full h-full object-cover"
                  />
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
              From Setup to 24/7 Bookings in 72 Hours
            </h2>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            We handle everything. Go live with Sarah in 3 simple steps.
          </p>

          {/* 48-72h urgency badge */}
          <div className="inline-flex items-center gap-2 bg-teal/10 text-teal px-4 py-2 rounded-full text-sm font-bold">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            48-72 Hours Setup
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

                {/* Icon - Calendar/Connection */}
                <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 7h12v9a1 1 0 01-1 1H5a1 1 0 01-1-1V7z"/>
                    <path d="M15 13a1 1 0 100-2 1 1 0 000 2z"/>
                    <path d="M15 17a1 1 0 100-2 1 1 0 000 2z"/>
                    <path d="M11 13a1 1 0 100-2 1 1 0 000 2z"/>
                    <path d="M11 17a1 1 0 100-2 1 1 0 000 2z"/>
                    <path d="M7 13a1 1 0 100-2 1 1 0 000 2z"/>
                    <path d="M7 17a1 1 0 100-2 1 1 0 000 2z"/>
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Setup <span className="text-teal">(Day 1)</span>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We plug into your calendar & FAQs — no tech skills needed.
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

                {/* Icon - AI/Chat bubble */}
                <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Sarah Trains <span className="text-teal">(Day 2)</span>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Sarah learns your services, pricing, and offers.
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

                {/* Icon - Clock/Checkmark (24/7 live) */}
                <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Go Live <span className="text-teal">(Day 3)</span>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  She's live — answering every DM, SMS, and chat instantly.
                </p>

                {/* Timeline dot - desktop */}
                <div className="hidden lg:block absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-teal rounded-full border-4 border-white shadow-lg"></div>
              </div>
            </div>

          </div>
        </div>

        {/* Integrated Tools Section */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Sarah Works With Your Current System
            </h3>
            <p className="text-gray-600 text-lg">
              We handle all integrations during setup — Vagaro, Mindbody, Calendly, or any calendar you use
            </p>
          </div>

          {/* Integration logos strip */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-8">
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6">
              {[
                { name: 'Vagaro', initial: 'V', color: 'from-purple-500 to-purple-600' },
                { name: 'Mindbody', initial: 'M', color: 'from-blue-500 to-blue-600' },
                { name: 'Acuity', initial: 'A', color: 'from-green-500 to-green-600' },
                { name: 'Square', initial: 'S', color: 'from-gray-700 to-gray-800' },
                { name: 'Google Cal', initial: 'G', color: 'from-red-500 to-red-600' },
                { name: 'Fresha', initial: 'F', color: 'from-teal-500 to-teal-600' },
                { name: 'Booker', initial: 'B', color: 'from-indigo-500 to-indigo-600' },
                { name: 'Calendly', initial: 'C', color: 'from-orange-500 to-orange-600' }
              ].map((integration, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 group hover:scale-105 transition-transform duration-200"
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${integration.color} rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-md`}>
                    {integration.initial}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-teal transition-colors">{integration.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Completion Badge */}
          <div className="text-center mt-12 mb-8">
            <div className="inline-flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-6 py-3 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-base">That's it — Setup complete in 72 hours</span>
            </div>
            <p className="text-gray-600 mt-4 text-lg">
              Including seamless integration with your existing calendar system.
            </p>
            <p className="text-gray-500 mt-2">
              No new software to learn, no complex configurations.
            </p>
          </div>

          {/* Trust note */}
          <p className="text-center text-sm text-gray-500">
            HIPAA-ready • PCI compliant • SOC 2 Type II
          </p>
        </div>
      </div>
    </section>
    </>
  );
}
