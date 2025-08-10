'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqs = [
    {
      question: "Will Sarah work with my booking system?",
      answer: "Yes! Sarah integrates seamlessly with Vagaro, Mindbody, Acuity, Square Appointments, Google Calendar, Fresha, Booker, and Calendly. We handle all the setup - you don't need to change any of your existing systems."
    },
    {
      question: "Can I change Sarah's script?",
      answer: "Absolutely! While we provide optimized Med Spa scripts that convert, you can customize Sarah's responses, your service menu, pricing, and policies through a simple dashboard. Changes go live instantly."
    },
    {
      question: "How long to get set up?",
      answer: "Sarah goes live in 48 hours or less. After checkout, you'll fill out a quick onboarding form (takes 10 minutes), and our team handles everything else. Most clients are capturing leads by day 2."
    },
    {
      question: "Do I need new software?",
      answer: "No new software needed! Sarah works through a simple embed code on your existing website (like adding a YouTube video). She connects to your current booking system - no need to learn or manage anything new."
    }
  ];

  const toggleItem = (index: number) => {
    const newOpenItem = openItem === index ? null : index;
    setOpenItem(newOpenItem);
    
    if (newOpenItem !== null) {
      trackEvent('faq_opened', { question_index: index, question: faqs[index].question });
    }
  };

  return (
    <section className="py-20 px-4 bg-background-card/30" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-text-secondary">
            Everything you need to know about getting started
          </p>
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

        {/* Contact for more questions */}
        <div className="text-center mt-16 p-8 bg-white border border-border-light rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-text-primary mb-3">
            Still have questions?
          </h3>
          <p className="text-text-secondary mb-6">
            Get in touch with our team and we&apos;ll help you choose the right plan for your Med Spa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@medspareceptionist.com"
              className="px-6 py-3 bg-teal hover:bg-teal/90 text-white font-medium rounded-lg transition-colors"
            >
              Email Support
            </a>
            <button
              onClick={() => {
                // This would typically open a chat widget or booking calendar
                trackEvent('contact_request', { source: 'faq' });
                alert('Chat support coming soon! Please email support@medspareceptionist.com for now.');
              }}
              className="px-6 py-3 border border-teal text-teal hover:bg-teal hover:text-white font-medium rounded-lg transition-colors"
            >
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}