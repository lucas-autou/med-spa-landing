'use client';

const integrations = [
  { name: 'Vagaro', logo: '💇' },
  { name: 'Mindbody', logo: '🧘' },
  { name: 'Acuity', logo: '📅' },
  { name: 'Square', logo: '🟦' },
  { name: 'Google Calendar', logo: '📆' },
  { name: 'Fresha', logo: '💄' },
  { name: 'Booker', logo: '📖' },
  { name: 'Calendly', logo: '🗓️' }
];

export default function IntegrationsRow() {
  return (
    <section className="py-12 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">
            Seamless Integration
          </h3>
          <p className="text-xl font-bold text-text-primary">
            Works with the tools you already use — no new software needed
          </p>
        </div>
        
        {/* Integration logos */}
        <div className="flex flex-wrap justify-center items-center gap-8">
          {integrations.map((integration, index) => (
            <div 
              key={index}
              className="flex flex-col items-center gap-2 group transition-transform hover:scale-110"
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <span className="text-2xl">{integration.logo}</span>
              </div>
              <span className="text-xs text-text-secondary font-medium">{integration.name}</span>
            </div>
          ))}
        </div>
        
        {/* Note */}
        <p className="text-center text-sm text-text-tertiary mt-8">
          + custom integrations available for enterprise clients
        </p>
      </div>
    </section>
  );
}