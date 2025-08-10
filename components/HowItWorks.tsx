'use client';

import { CalendarCheck, Sparkles, Zap } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      icon: CalendarCheck,
      title: 'Setup in 72h',
      description: 'Connect your calendar & FAQs'
    },
    {
      id: 2,
      icon: Sparkles,
      title: 'Sarah Trains',
      description: 'Learns your services & offers'
    },
    {
      id: 3,
      icon: Zap,
      title: 'Goes Live 24/7',
      description: 'Books & qualifies clients instantly'
    }
  ];

  return (
    <section className="w-full py-8">
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-12 w-full h-[1px] bg-gray-300">
                      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                        <svg className="w-2 h-2 text-gray-400" fill="currentColor" viewBox="0 0 8 8">
                          <path d="M5.25 0l-4 4 4 4 1.5-1.5L4.25 4l2.5-2.5L5.25 0z" transform="rotate(180 4 4)" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}