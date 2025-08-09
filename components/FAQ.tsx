'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqs = [
    {
      question: "Will it work with my website?",
      answer: "Yes, absolutely! No coding required. We provide a simple embed snippet (iframe/script) that works with any website platform - WordPress, Squarespace, Wix, custom sites, you name it. Takes less than 5 minutes to add."
    },
    {
      question: "Is Spanish available?",
      answer: "Yes! Our virtual receptionist speaks both English and Spanish fluently. She can automatically detect the visitor's language preference or they can choose their preferred language at the start of the conversation."
    },
    {
      question: "Do I need to train it?",
      answer: "Not at all! We handle all the training and setup for you. Our team pre-configures your virtual receptionist with Med Spa-specific scripts, your services, and best practices. You just need to fill out a simple onboarding form."
    },
    {
      question: "How quickly can I get set up?",
      answer: "Most setups are completed within 72 hours. After checkout, you'll receive an onboarding form, and our team gets to work immediately. You'll have your virtual receptionist live and capturing leads by the end of the week."
    },
    {
      question: "What if I want to cancel?",
      answer: "You can cancel your monthly subscription at any time with no penalties or fees. The setup fee is non-refundable, but there are no long-term contracts. For pilot customers, the 14 days are yours to test everything risk-free."
    },
    {
      question: "Does it integrate with my calendar?",
      answer: "Calendar integration with Google Calendar and Calendly is coming soon! Currently, you'll receive instant email and SMS notifications when someone books, and you can manually add appointments to your calendar. Full automation is in development."
    },
    {
      question: "How many leads can it handle?",
      answer: "There's no limit! Your virtual receptionist can handle unlimited simultaneous conversations and lead capture. Whether you get 10 visitors or 1000 visitors per day, she'll talk to every single one of them."
    },
    {
      question: "What about privacy and data security?",
      answer: "We take privacy seriously and are GDPR/CCPA compliant. We only store essential information (name, email, phone, service interest) needed to deliver leads to you. All data is encrypted and you can request deletion at any time."
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