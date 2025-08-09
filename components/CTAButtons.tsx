'use client';

import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

interface CTAButtonsProps {
  showBoth?: boolean;
  className?: string;
  primaryText?: string;
  secondaryText?: string;
  variant?: 'default' | 'large' | 'compact';
}

export default function CTAButtons({ 
  showBoth = true,
  className = '',
  primaryText = 'Start 14-Day Pilot',
  secondaryText = 'Book Full Setup',
  variant = 'default'
}: CTAButtonsProps) {
  const router = useRouter();

  const handleHireNow = () => {
    trackEvent('cta_click_hire_now', {
      location: 'avatar_widget',
      plan_type: 'FULL',
      amount: 997
    });
    router.push('/checkout-full');
  };

  const handlePilot = () => {
    trackEvent('cta_click_pilot', {
      location: 'avatar_widget', 
      plan_type: 'PILOT',
      amount: 297
    });
    router.push('/checkout-pilot');
  };

  const getSizeClasses = () => {
    switch (variant) {
      case 'large':
        return 'px-8 py-4 text-lg';
      case 'compact':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  const primaryButton = (
    <button
      onClick={handleHireNow}
      className={`
        bg-teal hover:bg-teal-hover
        text-white font-semibold rounded-lg shadow-cta
        transition-all duration-200 transform hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-teal focus:ring-opacity-50
        ${getSizeClasses()}
      `}
      aria-label="Hire virtual receptionist now for full setup"
    >
      {primaryText}
    </button>
  );

  const secondaryButton = showBoth ? (
    <button
      onClick={handlePilot}
      className={`
        bg-transparent border-2 border-border text-text-primary
        hover:bg-background-tertiary hover:border-teal
        font-semibold rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-teal focus:ring-opacity-50
        ${getSizeClasses()}
      `}
      aria-label="Start 14-day paid pilot program"
    >
      {secondaryText}
    </button>
  ) : null;

  return (
    <div className={`flex gap-3 ${className}`}>
      {primaryButton}
      {secondaryButton}
    </div>
  );
}