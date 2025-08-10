'use client';

import { ArrowRight } from 'lucide-react';

const painPoints = [
  {
    icon: '📞',
    title: 'Missed calls after hours',
    description: 'Potential clients call outside business hours and never try again'
  },
  {
    icon: '⏰',
    title: 'Delayed responses',
    description: 'Clients book with competitors who respond faster'
  },
  {
    icon: '💸',
    title: 'Lost revenue',
    description: 'Every missed lead is money left on the table'
  }
];

const solutions = [
  {
    icon: '💬',
    title: 'Instant replies 24/7',
    description: 'Sarah never sleeps, never takes breaks'
  },
  {
    icon: '📅',
    title: 'Direct booking',
    description: 'Clients can book appointments immediately'
  },
  {
    icon: '🎯',
    title: 'Never miss a lead',
    description: 'Every inquiry gets captured and qualified'
  }
];

export default function WhySarahWorks() {
  return (
    <section className="py-16 sm:py-20 bg-background-secondary">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Your clients don&apos;t wait. Neither should you.
          </h2>
          <p className="text-lg text-text-secondary">
            Turn every inquiry into a booked appointment, even when you&apos;re not there
          </p>
        </div>

        {/* Pain Points vs Solutions */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto mb-12">
          {/* Pain Points */}
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
              <span className="text-red-500 mr-2">✗</span> Without Sarah
            </h3>
            <div className="space-y-4">
              {painPoints.map((pain, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 bg-red-50 border border-red-100 rounded-xl"
                >
                  <span className="text-2xl flex-shrink-0">{pain.icon}</span>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">{pain.title}</h4>
                    <p className="text-sm text-text-secondary">{pain.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
              <span className="text-green-600 mr-2">✓</span> With Sarah
            </h3>
            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-xl"
                >
                  <span className="text-2xl flex-shrink-0">{solution.icon}</span>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">{solution.title}</h4>
                    <p className="text-sm text-text-secondary">{solution.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flow Diagram */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-text-primary mb-6 text-center">
            How Sarah Works
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8">
            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🙋</span>
              </div>
              <p className="text-sm font-medium text-text-primary">Lead Inquires</p>
              <p className="text-xs text-text-secondary mt-1">Any time, any channel</p>
            </div>
            
            <ArrowRight className="text-teal-500 hidden sm:block" size={24} />
            
            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🤖</span>
              </div>
              <p className="text-sm font-medium text-text-primary">Sarah Responds</p>
              <p className="text-xs text-text-secondary mt-1">Instant, personalized</p>
            </div>
            
            <ArrowRight className="text-teal-500 hidden sm:block" size={24} />
            
            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📅</span>
              </div>
              <p className="text-sm font-medium text-text-primary">Booking Confirmed</p>
              <p className="text-xs text-text-secondary mt-1">Synced to your calendar</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-600">3 sec</p>
              <p className="text-xs text-text-secondary">Avg response time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-600">40%</p>
              <p className="text-xs text-text-secondary">More bookings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-600">24/7</p>
              <p className="text-xs text-text-secondary">Always available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}