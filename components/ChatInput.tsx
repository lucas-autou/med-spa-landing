'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { classifyIntent, type IntentResult } from '@/lib/intentMapping';

interface ChatInputProps {
  onSubmit: (message: string, intentResult?: IntentResult) => void;
  onVoiceToggle?: (enabled: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  voiceEnabled?: boolean;
  isRecording?: boolean;
  className?: string;
}

export default function ChatInput({
  onSubmit,
  onVoiceToggle,
  placeholder = "Ask about pricing, setup time, calendars…",
  disabled = false,
  voiceEnabled = false,
  isRecording = false,
  className = ""
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || disabled || isProcessing) return;
    
    const message = input.trim();
    setIsProcessing(true);
    
    try {
      // Process message through NLU
      const intentResult = classifyIntent(message);
      
      // Clear input
      setInput('');
      
      // Submit message with intent result
      onSubmit(message, intentResult);
      
    } catch (error) {
      console.error('Error processing message:', error);
      // Fallback: submit without intent processing
      onSubmit(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceToggle = () => {
    if (onVoiceToggle) {
      onVoiceToggle(!voiceEnabled);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2 bg-white border border-border-light rounded-xl p-3 shadow-sm focus-within:border-teal focus-within:shadow-md transition-all duration-200">
          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Please wait..." : placeholder}
            disabled={disabled || isProcessing}
            className="flex-1 text-text-primary placeholder-text-tertiary focus:outline-none disabled:opacity-50 text-sm"
            maxLength={200}
          />

          {/* Voice Toggle Button */}
          {onVoiceToggle && (
            <button
              type="button"
              onClick={handleVoiceToggle}
              disabled={disabled}
              className={`
                p-2 rounded-lg transition-all duration-200 
                ${voiceEnabled 
                  ? 'bg-teal text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }
                ${isRecording ? 'animate-pulse bg-red-500' : ''}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              title={voiceEnabled ? "Voice enabled - click to disable" : "Enable voice input"}
            >
              {isRecording ? (
                <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
              ) : voiceEnabled ? (
                <Mic size={16} />
              ) : (
                <MicOff size={16} />
              )}
            </button>
          )}

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || disabled || isProcessing}
            className="p-2 bg-teal text-white rounded-lg hover:bg-teal-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            title="Send message"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </form>

      {/* Voice Status Indicator */}
      {voiceEnabled && (
        <div className="absolute -top-8 left-0 right-0 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/80 text-white text-xs rounded-full">
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-400 animate-pulse' : 'bg-green-400'}`} />
            {isRecording ? 'Recording...' : 'Voice ready'}
          </div>
        </div>
      )}

      {/* Character Count */}
      {input.length > 150 && (
        <div className="absolute -bottom-6 right-0 text-xs text-text-tertiary">
          {input.length}/200
        </div>
      )}
    </div>
  );
}