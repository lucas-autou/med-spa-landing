'use client';

import { useEffect } from 'react';
import { useDemoStore } from '@/store/useDemoStore';
import { demoConfig } from '@/lib/demoConfig';
import AvatarWidget from './AvatarWidget';
import DemoProgress from './DemoProgress';
import DemoCards from './DemoCards';
import Chips from './Chips';
import CTAButtons from './CTAButtons';

export default function DemoWidget() {
  const { 
    demoState, 
    currentStep, 
    isTyping, 
    showCTARail,
    startDemo, 
    selectChip,
    autoStartTimer,
    setVideoState,
    clearTimers
  } = useDemoStore();

  // Auto-start demo after configured time if idle
  useEffect(() => {
    if (demoState === 'idle') {
      const timer = setTimeout(() => {
        startDemo();
      }, demoConfig.autostartMs);

      return () => clearTimeout(timer);
    }
  }, [demoState, startDemo]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const handleChipSelect = (value: string) => {
    selectChip(value);
  };

  const renderBubble = () => {
    if (!currentStep) return null;

    return (
      <div className="bg-white border border-border-light rounded-2xl p-4 shadow-lg mb-6 relative">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-teal rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">S</span>
          </div>
          <div className="flex-1">
            {isTyping ? (
              <div className="flex items-center gap-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-teal rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-teal rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-teal rounded-full animate-bounce"></div>
                </div>
                <span className="text-text-secondary text-sm ml-2">Sarah is typing...</span>
              </div>
            ) : (
              <p className="text-text-primary">{currentStep.bubble}</p>
            )}
          </div>
        </div>
        
        {/* Speech bubble tail */}
        <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white border-r border-b border-border-light transform rotate-45"></div>
      </div>
    );
  };

  const renderChips = () => {
    if (!currentStep?.chips || isTyping) return null;

    return (
      <Chips
        options={currentStep.chips}
        onSelect={handleChipSelect}
        idlePreview={currentStep.idlePreview}
        className="mb-6"
      />
    );
  };

  const renderCTARail = () => {
    if (!showCTARail) return null;

    return (
      <div className="mt-8 space-y-4">
        <CTAButtons 
          primaryText="Start 14-Day Pilot ($297)"
          secondaryText="Book Full Setup"
          variant="default"
          className="justify-center"
        />
        
        {/* Subtitle */}
        <p className="text-center text-sm text-text-secondary">
          (credited if you continue)
        </p>
        
        {/* Links below CTAs */}
        <div className="flex justify-center gap-4 text-sm">
          <button 
            onClick={() => selectChip('Replay 20-sec demo ↺')}
            className="text-teal hover:text-teal-hover transition-colors"
          >
            Replay 20-sec demo ↺
          </button>
          <span className="text-text-tertiary">·</span>
          <button 
            onClick={() => selectChip('See pricing')}
            className="text-teal hover:text-teal-hover transition-colors"
          >
            See pricing
          </button>
        </div>
      </div>
    );
  };

  const renderFreeChatInput = () => {
    if (demoState !== 'freechat') return null;

    return (
      <div className="mt-6">
        <div className="bg-white border border-border-light rounded-lg p-4">
          <input
            type="text"
            placeholder="Ask about pricing, setup time, calendars…"
            className="w-full text-text-primary placeholder-text-tertiary focus:outline-none"
          />
        </div>
        
        {/* Suggestion chips */}
        <div className="mt-3">
          <Chips
            options={['Pricing', 'Setup in 72h?', 'Works with Calendly?']}
            onSelect={handleChipSelect}
            className="justify-center"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto">
      <DemoProgress />
      
      <div className="flex flex-col items-center space-y-6">
        {/* Avatar */}
        <AvatarWidget 
          useDemo={true} 
          autoStart={false}
          className="w-full" 
        />

        {/* Conversation */}
        <div className="w-full space-y-4">
          {renderBubble()}
          {renderChips()}
          <DemoCards />
          {renderCTARail()}
          {renderFreeChatInput()}
        </div>
      </div>
    </div>
  );
}