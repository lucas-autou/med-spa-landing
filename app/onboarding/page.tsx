/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function OnboardingPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    websiteUrl: '',
    contactEmail: '',
    contactPhone: '',
    services: [] as string[],
    hours: '',
    language: 'English',
    calendarIntegration: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const services = [
    'Botox', 'Dermal Fillers', 'Laser Hair Removal', 'Chemical Peels',
    'Microneedling', 'Facials', 'Body Contouring', 'Other'
  ];

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      trackEvent('form_submitted', {
        form_type: 'onboarding',
        services_count: formData.services.length,
        has_website: !!formData.websiteUrl,
        language: formData.language
      });

      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-primary to-background-secondary flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-background-primary border border-borders-card rounded-2xl p-8 shadow-2xl">
            <div className="mb-8">
              <div className="w-24 h-24 bg-status-success rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-text-primary mb-4">
                Thank You! Your Virtual Receptionist is Being Set Up
              </h1>
              <p className="text-text-secondary text-lg">
                Our team will configure your avatar and have everything ready within 72 hours.
              </p>
            </div>

            <div className="space-y-4 text-left mb-8">
              <div className="bg-background-secondary border border-borders-card rounded-lg p-4">
                <h3 className="text-text-primary font-semibold mb-2">What Happens Next:</h3>
                <ul className="space-y-2 text-text-secondary">
                  <li>• Custom avatar configuration for your brand</li>
                  <li>• Script optimization for your services</li>
                  <li>• Testing and quality assurance</li>
                  <li>• Embed code delivery via email</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/"
                className="px-6 py-3 bg-cta-primary hover:bg-cta-hover text-white font-semibold rounded-lg transition-colors flex-1"
              >
                Back to Home
              </a>
              <a
                href="mailto:support@medspareceptionist.com"
                className="px-6 py-3 border border-cta-primary text-cta-primary hover:bg-cta-primary hover:text-white rounded-lg transition-colors flex-1"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary to-background-secondary py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Let's Set Up Your Virtual Receptionist
          </h1>
          <p className="text-xl text-text-secondary">
            Tell us about your Med Spa so we can customize everything perfectly
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-background-primary border border-borders-card rounded-2xl p-8 shadow-2xl">
          
          {/* Business Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Business Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="businessName" className="block text-text-primary font-medium mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  className="w-full px-4 py-3 bg-background-secondary border border-borders-card rounded-lg text-text-primary focus:border-cta-primary focus:outline-none"
                  placeholder="Your Med Spa Name"
                />
              </div>
              
              <div>
                <label htmlFor="websiteUrl" className="block text-text-primary font-medium mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  id="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                  className="w-full px-4 py-3 bg-background-secondary border border-borders-card rounded-lg text-text-primary focus:border-cta-primary focus:outline-none"
                  placeholder="https://yourmedspa.com"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Contact Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactEmail" className="block text-text-primary font-medium mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className="w-full px-4 py-3 bg-background-secondary border border-borders-card rounded-lg text-text-primary focus:border-cta-primary focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="contactPhone" className="block text-text-primary font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  className="w-full px-4 py-3 bg-background-secondary border border-borders-card rounded-lg text-text-primary focus:border-cta-primary focus:outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Main Services</h2>
            <p className="text-text-secondary mb-4">Select all services you offer:</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {services.map((service) => (
                <label
                  key={service}
                  className={`
                    px-4 py-3 rounded-lg border cursor-pointer transition-all text-center
                    ${formData.services.includes(service)
                      ? 'bg-cta-primary border-cta-primary text-white'
                      : 'bg-background-secondary border-borders-card text-text-secondary hover:border-cta-primary'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={formData.services.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                  />
                  {service}
                </label>
              ))}
            </div>
          </div>

          {/* Additional Settings */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Additional Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="hours" className="block text-text-primary font-medium mb-2">
                  Hours of Operation
                </label>
                <input
                  type="text"
                  id="hours"
                  value={formData.hours}
                  onChange={(e) => setFormData(prev => ({ ...prev, hours: e.target.value }))}
                  className="w-full px-4 py-3 bg-background-secondary border border-borders-card rounded-lg text-text-primary focus:border-cta-primary focus:outline-none"
                  placeholder="Mon-Fri 9AM-6PM, Sat 9AM-3PM"
                />
              </div>
              
              <div>
                <label htmlFor="language" className="block text-text-primary font-medium mb-2">
                  Primary Language
                </label>
                <select
                  id="language"
                  value={formData.language}
                  onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-4 py-3 bg-background-secondary border border-borders-card rounded-lg text-text-primary focus:border-cta-primary focus:outline-none"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Both">Both English & Spanish</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="calendarIntegration"
                  checked={formData.calendarIntegration}
                  onChange={(e) => setFormData(prev => ({ ...prev, calendarIntegration: e.target.checked }))}
                  className="w-4 h-4 text-cta-primary bg-background-secondary border-borders-card rounded focus:ring-cta-primary focus:ring-2"
                />
                <label htmlFor="calendarIntegration" className="ml-3 text-text-primary">
                  I want calendar integration (Google Calendar/Calendly)
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-4 px-8 text-xl font-semibold rounded-lg transition-all duration-300
              ${isSubmitting 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-cta-primary hover:bg-cta-hover shadow-cta hover:shadow-xl transform hover:-translate-y-1'
              }
              text-white
            `}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Setting up your virtual receptionist...
              </div>
            ) : (
              'Complete Setup'
            )}
          </button>

          <p className="text-center text-text-secondary text-sm mt-4">
            Setup typically completed within 72 hours
          </p>
        </form>
      </div>
    </div>
  );
}