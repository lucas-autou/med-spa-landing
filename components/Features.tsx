'use client';

export default function Features() {
  const features = [
    {
      title: '24/7 Lead Capture',
      description: 'Never miss a potential client, even when your office is closed',
      icon: '🕐',
      highlight: false,
    },
    {
      title: 'Smart Qualifying Chips',
      description: 'Interactive buttons plus voice option for natural conversations',
      icon: '🎯',
      highlight: true,
    },
    {
      title: 'Instant Notifications',
      description: 'Get alerted via email and SMS the moment someone books',
      icon: '📱',
      highlight: false,
    },
    {
      title: 'Calendar Integration',
      description: 'Optional Google Calendar and Calendly sync (coming soon)',
      icon: '📅',
      highlight: false,
    },
    {
      title: 'Med Spa Presets',
      description: 'Pre-configured for Botox, fillers, laser, facials, and more',
      icon: '💉',
      highlight: true,
    },
    {
      title: 'Multi-Language Support',
      description: 'English and Spanish support built-in',
      icon: '🌎',
      highlight: false,
    },
  ];

  return (
    <section className="py-20 px-4" id="features">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Everything You Need to{' '}
            <span className="text-teal">
              Grow Your Practice
            </span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Purpose-built for Med Spas with features that convert visitors into paying clients
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`
                relative group p-8 rounded-xl border transition-all duration-300 hover:-translate-y-1
                ${
                  feature.highlight
                    ? 'bg-gradient-to-br from-teal/5 to-blush-light border-teal/20 hover:border-teal/40 shadow-md'
                    : 'bg-background-card border-border-light hover:border-teal/30 shadow-sm hover:shadow-md'
                }
              `}
            >
              {/* Beauty accent for highlighted features */}
              {feature.highlight && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-blush rounded-full opacity-60" />
              )}
              
              {/* Icon */}
              <div className="text-5xl mb-6 text-center">
                {feature.icon}
              </div>
              
              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-background-card rounded-xl border border-border-light shadow-md">
          <div className="text-center">
            <div className="text-3xl font-bold text-teal mb-2">24/7</div>
            <div className="text-text-secondary text-sm">Always Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal mb-2">3x</div>
            <div className="text-text-secondary text-sm">More Bookings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal mb-2">72h</div>
            <div className="text-text-secondary text-sm">Setup Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal mb-2">∞</div>
            <div className="text-text-secondary text-sm">Lead Capacity</div>
          </div>
        </div>
      </div>
    </section>
  );
}