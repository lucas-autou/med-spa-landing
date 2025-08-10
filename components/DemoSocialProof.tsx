'use client';

export default function DemoSocialProof() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Trust Badges */}
        <div className="text-center mb-8">
          <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-4">
            Trusted by leading med spas
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 opacity-60">
            <div className="text-gray-400 font-semibold text-sm">Beverly Hills Aesthetics</div>
            <div className="text-gray-400 font-semibold text-sm">Miami Skin Clinic</div>
            <div className="text-gray-400 font-semibold text-sm">NYC MedSpa</div>
            <div className="text-gray-400 font-semibold text-sm">Dallas Beauty</div>
          </div>
        </div>

        {/* Powerful Testimonial */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-teal-50 to-pink-50 rounded-2xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Testimonial Content */}
            <div className="flex-1 text-center lg:text-left">
              <svg className="w-8 h-8 text-teal-400 mb-3 mx-auto lg:mx-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-lg lg:text-xl text-text-primary mb-4 italic">
                &ldquo;Sarah books an average of 18 extra appointments per month for our clinic — worth{' '}
                <span className="font-bold text-2xl text-emerald-600 px-2 py-1 bg-emerald-100 rounded-lg">
                  $9,000+
                </span>
                {' '}in additional revenue.&rdquo;
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold">
                  DA
                </div>
                <div className="text-left">
                  <p className="font-semibold text-text-primary">Dr. Ana Martinez</p>
                  <p className="text-sm text-text-secondary">Skin Renewal Med Spa, Miami</p>
                </div>
              </div>
            </div>

            {/* Stats/Results */}
            <div className="lg:w-48 lg:border-l lg:border-teal-200 lg:pl-6">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 text-center">
                <div className="bg-white rounded-xl p-4">
                  <div className="text-2xl font-bold text-teal-600">40%</div>
                  <div className="text-xs text-text-secondary">More Leads</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-2xl font-bold text-teal-600">24/7</div>
                  <div className="text-xs text-text-secondary">Availability</div>
                </div>
                <div className="bg-white rounded-xl p-4 lg:col-span-1 col-span-2">
                  <div className="text-2xl font-bold text-teal-600">72h</div>
                  <div className="text-xs text-text-secondary">Setup Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Urgency Message */}
        <div className="text-center mt-6">
          <p className="text-sm text-orange-600 font-medium">
            🔥 Only 3 January setup spots remaining
          </p>
        </div>
      </div>
    </section>
  );
}