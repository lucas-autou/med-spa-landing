'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import PurchaseSlideOver from './PurchaseSlideOver';

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const faqs = [
    {
      question: "Will Sarah work with my booking system?",
      answer: "Yes! Sarah integrates seamlessly with Vagaro, Mindbody, Acuity, Square Appointments, Google Calendar, Fresha, Booker, and Calendly. We handle all the setup - you don't need to change any of your existing systems.",
      chip: "Integrations"
    },
    {
      question: "How long does setup take?",
      answer: "Sarah goes live in 48-72 hours. After checkout, you'll fill out a quick onboarding form (takes 10 minutes), and our team handles everything else. Most clients are capturing leads by day 2.",
      chip: "Setup time"
    },
    {
      question: "What about refunds?",
      answer: "We offer a 14-day money-back guarantee. If Sarah doesn't deliver value for your med spa, we'll refund your pilot fee - no questions asked. You keep all the leads generated during the trial.",
      chip: "Refunds"
    },
    {
      question: "What's the monthly cost after the pilot?",
      answer: "After your 14-day pilot or initial setup, Sarah is $199/month. This includes unlimited conversations, bookings, and all updates. No per-booking fees, no hidden costs. Cancel anytime.",
      chip: "Monthly cost"
    },
    {
      question: "Can I customize Sarah's script and voice?",
      answer: "Absolutely! While we provide optimized Med Spa scripts that convert, you can customize Sarah's responses, your service menu, pricing, and policies through a simple dashboard. Changes go live instantly.",
      chip: "Scripts/voice"
    }
  ];

  const quickChips = ["Integrations", "Setup time", "Refunds", "Monthly cost", "Scripts/voice"];

  const toggleItem = (index: number) => {
    const newOpenItem = openItem === index ? null : index;
    setOpenItem(newOpenItem);
    
    if (newOpenItem !== null) {
      trackEvent('faq_opened', { question_index: index, question: faqs[index].question });
    }
  };

  const handleChipClick = (chip: string) => {
    setSelectedChip(chip);
    const faqIndex = faqs.findIndex(faq => faq.chip === chip);
    if (faqIndex !== -1) {
      setOpenItem(faqIndex);
      trackEvent('faq_chip_clicked', { chip });
    }
    setTimeout(() => setSelectedChip(null), 300);
  };

  return (
    <section className="py-20 bg-background-secondary" id="faq">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            Still have questions? Just ask Sarah.
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Click a topic below or expand for details
          </p>
          
          {/* Quick access chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {quickChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedChip === chip
                    ? 'bg-teal text-white transform scale-105'
                    : 'bg-white border border-gray-200 text-text-primary hover:border-teal hover:shadow-md'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-border-light rounded-xl overflow-hidden transition-all duration-300 hover:border-teal/30 shadow-sm hover:shadow-md"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-8 py-6 text-left focus:outline-none focus:ring-2 focus:ring-teal focus:ring-inset"
                aria-expanded={openItem === index}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-text-primary pr-4">
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 transition-transform duration-300 ${
                    openItem === index ? 'transform rotate-180' : ''
                  }`}>
                    <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${
                openItem === index 
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}>
                <div className="px-8 pb-6">
                  <p className="text-text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sarah's nudge to convert */}
        <div className="text-center mt-16 p-8 bg-gradient-to-br from-teal/5 to-white border border-teal/20 rounded-2xl shadow-lg">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-teal rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">S</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-3">
            I&apos;m Sarah — ready to work for your med spa
          </h3>
          <p className="text-text-secondary mb-6">
            Want me to start booking appointments for you? I can be live on your site in 72 hours.
          </p>
          <button
            onClick={() => {
              trackEvent('faq_cta_click');
              setShowPurchaseModal(true);
            }}
            className="px-8 py-3 bg-teal hover:bg-teal-hover text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Start 14-Day Pilot — $297
          </button>
          <p className="text-xs text-text-tertiary mt-3">
            After pilot/setup, service is $199/mo. Cancel anytime.
          </p>
          <p className="text-xs text-text-tertiary mt-2">
            Go live in 48–72h · We handle everything · Works with your booking system
          </p>
        </div>

        {/* Purchase Slide-over Modal */}
        <PurchaseSlideOver 
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          context="regular"
        />
      </div>
    </section>
  );
}