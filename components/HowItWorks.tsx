'use client';

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      number: '1',
      title: 'Setup in 72h',
      description: 'Connect calendar & FAQs'
    },
    {
      id: 2,
      number: '2',
      title: 'Sarah trains',
      description: 'Learns your services & offers'
    },
    {
      id: 3,
      number: '3',
      title: 'Goes live 24/7',
      description: 'Answers & books instantly'
    }
  ];

  return (
    <section className="py-16 bg-background-secondary">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {steps.map((step) => (
              <div key={step.id} className="p-6 md:p-8 text-center group hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-center mb-3">
                  <span className="w-10 h-10 bg-teal/10 text-teal rounded-full flex items-center justify-center text-lg font-bold group-hover:bg-teal group-hover:text-white transition-colors">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}