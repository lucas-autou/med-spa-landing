'use client';

import { useEffect, useState } from 'react';
import { useDemoStore } from '@/store/useDemoStore';
import { QUICK_RESPONSES } from '@/lib/intentMapping';
import AvatarWidget from './AvatarWidget';
import Chips from './Chips';
import ChatInput from './ChatInput';
import VoiceToggle from './VoiceToggle';
import CTAButtons from './CTAButtons';
import PurchaseSlideOver from './PurchaseSlideOver';

interface InteractiveDemoProps {
  className?: string;
  autoStart?: boolean;
}

export default function InteractiveDemo({ 
  className = "",
  autoStart = false
}: InteractiveDemoProps) {
  const { 
    demoState, 
    interactiveMode,
    conversationHistory,
    currentIntent,
    voiceEnabled,
    isRecording,
    safetyFlags,
    showCTARail,
    startInteractiveMode,
    processUserMessage,
    setVoiceEnabled,
    setRecording,
    selectChip,
    reset
  } = useDemoStore();
  
  const [showPurchaseSlideOver, setShowPurchaseSlideOver] = useState(false);

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && demoState === 'idle') {
      const timer = setTimeout(() => {
        startInteractiveMode();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoStart, demoState, startInteractiveMode]);

  const handleChipSelect = (chipLabel: string) => {
    // Check if this is a predefined quick response
    const quickResponse = QUICK_RESPONSES[chipLabel as keyof typeof QUICK_RESPONSES];
    
    if (quickResponse) {
      // Add user message
      useDemoStore.getState().addConversationMessage('user', chipLabel);
      
      // Add AI response
      setTimeout(() => {
        useDemoStore.getState().addConversationMessage('ai', quickResponse.response);
      }, 500);
      
      return;
    }
    
    // Fall back to regular chip selection
    selectChip(chipLabel, true);
  };

  const handleUserMessage = async (message: string, intentResult?: any) => {
    // Check if we should use AI for this message
    if (intentResult?.useAI || message.toLowerCase().includes('ask ai') || message.toLowerCase().includes('ai assistant')) {
      await handleAIMessage(message);
    } else {
      processUserMessage(message, intentResult);
    }
  };

  const handleAIMessage = async (message: string) => {
    // Add user message immediately
    useDemoStore.getState().addConversationMessage('user', message);
    
    // Show typing indicator
    useDemoStore.getState().setTyping(true);
    useDemoStore.getState().setVideoState('idle');

    try {
      // Prepare conversation history for AI
      const history = conversationHistory.slice(-6).map(msg => ({
        type: msg.type,
        text: msg.text
      }));

      // Call AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory: history,
          context: {
            mode: 'general',
            currentIntent,
            demoData: useDemoStore.getState().demoData
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const aiResult = await response.json();
      
      // Add AI response
      setTimeout(() => {
        useDemoStore.getState().setTyping(false);
        useDemoStore.getState().setVideoState('talking_neutral');
        useDemoStore.getState().addConversationMessage('ai', aiResult.response);
        
        // Handle safety flags
        if (aiResult.safetyFlags && aiResult.safetyFlags.length > 0) {
          aiResult.safetyFlags.forEach((flag: string) => {
            useDemoStore.getState().addSafetyFlag(flag);
          });
        }
        
        // Store AI chips for next interaction
        if (aiResult.chips && aiResult.chips.length > 0) {
          const store = useDemoStore.getState();
          store.currentContext = {
            ...store.currentContext,
            aiChips: aiResult.chips
          };
        }
        
        // Show CTA if appropriate
        if (aiResult.followUpAction === 'booking' || aiResult.followUpAction === 'consult') {
          setTimeout(() => {
            useDemoStore.getState().showCTARail = true;
          }, 2000);
        }
        
        // Return to idle state
        setTimeout(() => {
          useDemoStore.getState().setVideoState('idle');
        }, 2500);
      }, 800);

    } catch (error) {
      console.error('AI chat error:', error);
      
      // Fallback to regular processing
      setTimeout(() => {
        useDemoStore.getState().setTyping(false);
        useDemoStore.getState().setVideoState('talking_neutral');
        useDemoStore.getState().addConversationMessage(
          'ai', 
          "I'm having trouble connecting to my advanced responses right now. Let me help you with our standard options!"
        );
        
        setTimeout(() => {
          useDemoStore.getState().setVideoState('idle');
        }, 2000);
      }, 500);
    }
  };

  const handleVoiceTranscription = (transcript: string) => {
    if (transcript.trim()) {
      handleUserMessage(transcript);
    }
  };

  const handleVoiceToggle = (enabled: boolean) => {
    setVoiceEnabled(enabled);
  };

  const handleRecordingChange = (recording: boolean) => {
    setRecording(recording);
  };

  // Get the last few conversation messages to display
  const recentMessages = conversationHistory.slice(-4);
  const lastAiMessage = recentMessages.filter(msg => msg.type === 'ai').pop();

  // Default chips for initial interaction (max 3)
  const defaultChips = ['Book appointment', 'See pricing', 'Ask question'];

  // Get current chips based on last AI response or intent
  const getCurrentChips = () => {
    if (lastAiMessage?.stepId === 'interactive_greet') {
      return defaultChips;
    }
    
    // Check if we have AI-suggested chips stored
    const lastMessage = conversationHistory[conversationHistory.length - 1];
    if (lastMessage?.type === 'ai') {
      // Check if we have stored AI chips in demo data or context
      const aiChips = useDemoStore.getState().currentContext?.aiChips;
      if (aiChips && aiChips.length > 0) {
        return aiChips;
      }
      
      // Contextual chips based on current intent (max 3)
      switch (currentIntent) {
        case 'book_appointment':
          return ['Botox', 'Fillers', 'Laser'];
        case 'pricing':
          return ['Botox pricing', 'Filler pricing', 'Laser pricing'];
        case 'reschedule':
          return ['Existing appointment', 'New appointment', 'Check availability'];
        default:
          return defaultChips;
      }
    }
    
    return defaultChips;
  };

  const renderConversationHistory = () => {
    if (conversationHistory.length === 0) {
      // Show initial greeting
      return (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-teal rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">S</span>
          </div>
          <div className="flex-1">
            <div className="bg-gray-50 rounded-2xl rounded-tl-none p-3">
              <p className="text-text-primary">Hi! I can help you book Botox, check pricing, or reschedule. What do you need?</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {conversationHistory.map((message, index) => (
          <div key={index} className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
            {message.type === 'ai' && (
              <div className="w-8 h-8 bg-teal rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">S</span>
              </div>
            )}
            
            <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'flex justify-end' : ''}`}>
              <div className={`rounded-2xl p-3 ${
                message.type === 'user' 
                  ? 'bg-teal text-white rounded-tr-none' 
                  : 'bg-gray-50 rounded-tl-none'
              }`}>
                <p className={message.type === 'user' ? 'text-white' : 'text-text-primary'}>
                  {message.text}
                </p>
                {message.confidence && message.confidence < 0.6 && (
                  <p className="text-text-tertiary text-xs mt-1">
                    Let me know if I misunderstood!
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSafetyWarning = () => {
    if (safetyFlags.length === 0) return null;

    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm">⚠</span>
          </div>
          <div>
            <h4 className="font-medium text-yellow-800 mb-1">Specialist Consultation Recommended</h4>
            <p className="text-yellow-700 text-sm">
              Based on your needs, I&apos;d like to connect you with one of our specialists for the best care.
            </p>
            <div className="mt-3">
              <CTAButtons 
                primaryText="Schedule Specialist Consult"
                secondaryText="Ask Different Question"
                variant="compact"
                className="gap-2"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCTARail = () => {
    if (!showCTARail || safetyFlags.length > 0) return null;

    // Determine contextual CTA text based on conversation
    const getContextualCTA = () => {
      const lastIntent = currentIntent;
      const hasBookingContext = conversationHistory.some(msg => 
        msg.text.toLowerCase().includes('book') || 
        msg.text.toLowerCase().includes('appointment')
      );
      const hasPricingContext = conversationHistory.some(msg => 
        msg.text.toLowerCase().includes('pric') || 
        msg.text.toLowerCase().includes('cost')
      );
      
      if (hasBookingContext) {
        return "Yes — I want Sarah booking for me";
      } else if (hasPricingContext) {
        return "Get Sarah at this price";
      } else {
        return "Get Sarah for My Med Spa";
      }
    };

    return (
      <div className="p-4 border-t border-gray-100 bg-gray-50 animate-fade-in">
        <div className="text-center space-y-3">
          {/* Primary CTA Button */}
          <button 
            onClick={() => setShowPurchaseSlideOver(true)}
            className="px-8 py-3 bg-teal text-white rounded-lg font-semibold hover:bg-teal-hover transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
            {getContextualCTA()}
          </button>
          
          {/* Secondary link */}
          <div>
            <button
              onClick={() => setShowPurchaseSlideOver(true)}
              className="text-sm text-text-secondary hover:text-teal underline-offset-4 hover:underline transition-colors">
              See pricing & plans
            </button>
          </div>
          
          {/* Trust indicators */}
          <p className="text-xs text-text-tertiary">
            Go live in 72h · HIPAA-ready · Works with your booking system
          </p>
        </div>
      </div>
    );
  };

  if (!interactiveMode && demoState !== 'interactive') {
    return (
      <div className={`w-full ${className}`}>
        {/* Two-column layout matching target design */}
        <div className="flex gap-6 max-w-7xl mx-auto">
          {/* Left: Avatar Card */}
          <div className="w-[440px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <AvatarWidget 
                useDemo={false} 
                className="w-full" 
              />
            </div>
          </div>

          {/* Right: Start Interface */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg flex flex-col justify-center">
            <div className="p-8 text-center space-y-6">
              <h3 className="text-xl font-medium text-text-primary">
                Try Sarah Live
              </h3>
              <p className="text-text-secondary">
                Have a real conversation with Sarah. Ask questions, book appointments, or learn about our services.
              </p>
              
              <button
                onClick={startInteractiveMode}
                className="px-8 py-3 bg-teal text-white font-medium rounded-xl hover:bg-teal-hover transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Start Interactive Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`w-full ${className}`}>
        {/* Two-column layout matching target design */}
        <div className="flex gap-6 max-w-7xl mx-auto">
        {/* Left: Avatar Card */}
        <div className="w-[440px] flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <AvatarWidget 
              useDemo={true} 
              autoStart={false}
              className="w-full" 
            />
          </div>
        </div>

        {/* Right: Chat Interface */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg flex flex-col max-h-[600px]">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal rounded-full"></div>
              <span className="text-sm font-medium text-text-primary">Live Demo</span>
            </div>
            <button 
              onClick={() => handleVoiceToggle(!voiceEnabled)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                voiceEnabled 
                  ? 'bg-teal text-white' 
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 616 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
              {voiceEnabled ? 'Voice On' : 'Voice Off'}
            </button>
            <span className="text-xs text-text-tertiary">Interactive • no patient data stored</span>
          </div>

          {/* Chat Messages Area - FIXED HEIGHT */}
          <div className="p-4 space-y-4 overflow-y-auto" style={{height: '320px'}}>
            {renderConversationHistory()}
            {renderSafetyWarning()}
            
            {/* Current chips */}
            {!safetyFlags.length && (
              <Chips
                options={getCurrentChips()}
                onSelect={handleChipSelect}
                className="mb-4"
              />
            )}
          </div>

          {/* Chat Input Area */}
          <div className="p-4 border-t border-gray-100 flex-shrink-0">
            <div className="relative">
              <ChatInput
                onSubmit={handleUserMessage}
                onVoiceToggle={handleVoiceToggle}
                voiceEnabled={voiceEnabled}
                isRecording={isRecording}
                placeholder="Tell Sarah what you're interested in..."
                className=""
              />
            </div>
            
            {/* Demo note */}
            <p className="text-xs text-text-tertiary text-center mt-2">
              Live in 72 hours on a branded page • Optional website embed
            </p>
          </div>

          {/* Offer CTA Rail - Business Section Outside Chat */}
          {renderCTARail()}
        </div>
        </div>
      </div>
      
      {/* Purchase SlideOver */}
      <PurchaseSlideOver 
        isOpen={showPurchaseSlideOver} 
        onClose={() => setShowPurchaseSlideOver(false)} 
      />
    </>
  );
}