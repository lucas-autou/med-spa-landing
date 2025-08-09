'use client';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Install (no code)',
      description: 'One-line script on your website or standalone landing page in 72 hours',
      icon: '⚙️',
    },
    {
      number: '02', 
      title: 'Answers in seconds (24/7)',
      description: 'Qualifies leads, answers pricing & treatment FAQs around the clock',
      icon: '💬',
    },
    {
      number: '03',
      title: 'Books on your calendar',
      description: 'Direct integration with Calendly, Google Calendar, or Outlook',
      icon: '📅',
    },
  ];

  return (
    <section className="py-20 px-4 bg-background-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            How It Works
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Three simple steps to transform your Med Spa&apos;s lead capture
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group"
            >
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-teal to-transparent z-0" />
              )}
              
              {/* Card */}
              <div className="relative bg-white border border-border-light rounded-xl p-8 h-full hover:border-teal/50 transition-all duration-300 group-hover:transform group-hover:-translate-y-2 shadow-sm hover:shadow-md">
                {/* Step number */}
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal to-blush rounded-full text-white font-bold text-xl mb-6 mx-auto">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="text-4xl text-center mb-4">
                  {step.icon}
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-text-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Decorative accent */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-blush rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-text-secondary mb-6">
            Ready to get started? Setup typically takes just 72 hours.
          </p>
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white border border-border-light rounded-lg shadow-sm">
            <span className="w-3 h-3 bg-status-success rounded-full animate-pulse"></span>
            <span className="text-text-secondary">Average setup: 2-3 days</span>
          </div>
        </div>
      </div>
    </section>
  );
}