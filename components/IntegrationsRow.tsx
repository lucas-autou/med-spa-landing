'use client';

const integrations = [
  { name: 'Vagaro', initial: 'V' },
  { name: 'Mindbody', initial: 'M' },
  { name: 'Acuity', initial: 'A' },
  { name: 'Square', initial: 'S' },
  { name: 'Google Cal', initial: 'G' },
  { name: 'Fresha', initial: 'F' },
  { name: 'Booker', initial: 'B' },
  { name: 'Calendly', initial: 'C' }
];

export default function IntegrationsRow() {
  return (
    <section className="py-16 bg-background-primary">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-lg font-semibold text-text-primary mb-2">
            Works with the tools you already use
          </p>
          <p className="text-sm text-text-secondary">
            No new software needed — Sarah connects with your existing system
          </p>
        </div>
        
        {/* Integration logos strip */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            {integrations.map((integration, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-sm text-gray-600">
                  {integration.initial}
                </div>
                <span className="text-sm font-medium">{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Trust note */}
        <p className="text-center text-xs text-text-tertiary mt-4">
          HIPAA-ready • PCI compliant • SOC 2 Type II
        </p>
      </div>
    </section>
  );
}