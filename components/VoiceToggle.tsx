'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceToggleProps {
  onTranscription: (text: string) => void;
  onRecordingChange?: (isRecording: boolean) => void;
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  className?: string;
}

export default function VoiceToggle({
  onTranscription,
  onRecordingChange,
  enabled = false,
  onToggle,
  className = ""
}: VoiceToggleProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Audio feedback beeps
  const playBeep = useCallback((type: 'start' | 'end') => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(type === 'start' ? 800 : 400, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (error) {
        // Silently fail if audio context is not available
      }
    }
  }, []);

  // Check browser support and initialize
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      setIsSupported(!!SpeechRecognition);
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsRecording(true);
          onRecordingChange?.(true);
          playBeep('start');
        };

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            setTranscript(finalTranscript);
            onTranscription(finalTranscript.trim());
          } else {
            setTranscript(interimTranscript);
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
          onRecordingChange?.(false);
          playBeep('end');
          setTranscript('');
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          onRecordingChange?.(false);
          
          if (event.error === 'not-allowed') {
            setHasPermission(false);
          }
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onTranscription, onRecordingChange, playBeep]);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setHasPermission(false);
      return false;
    }
  };

  const startRecording = async () => {
    if (!recognitionRef.current || !enabled) return;
    
    if (!hasPermission) {
      const permitted = await requestMicrophonePermission();
      if (!permitted) return;
    }

    try {
      recognitionRef.current.start();
      
      // Auto-stop after 6 seconds (max response time)
      timeoutRef.current = setTimeout(() => {
        stopRecording();
      }, 6000);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleToggle = async () => {
    if (!isSupported) return;
    
    const newEnabled = !enabled;
    
    if (newEnabled && !hasPermission) {
      const permitted = await requestMicrophonePermission();
      if (!permitted) return;
    }
    
    if (onToggle) {
      onToggle(newEnabled);
    }
  };

  const handleMouseDown = () => {
    if (enabled && !isRecording) {
      startRecording();
    }
  };

  const handleMouseUp = () => {
    if (enabled && isRecording) {
      stopRecording();
    }
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMouseDown();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMouseUp();
  };

  if (!isSupported) {
    return null; // Hide if not supported
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Voice Enable Toggle */}
      <button
        onClick={handleToggle}
        className={`
          px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border
          ${enabled 
            ? 'bg-teal text-white border-teal shadow-md' 
            : 'bg-white text-text-secondary border-border-light hover:border-teal hover:text-teal'
          }
        `}
        title={enabled ? "Voice enabled - click to disable" : "Enable voice input"}
      >
        <div className="flex items-center gap-1">
          {enabled ? <Volume2 size={12} /> : <MicOff size={12} />}
          <span>{enabled ? "Voice On" : "Voice Off"}</span>
        </div>
      </button>

      {/* Push-to-Talk Button */}
      {enabled && (
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`
            p-3 rounded-full transition-all duration-200 select-none
            ${isRecording
              ? 'bg-red-500 text-white shadow-lg scale-110 animate-pulse'
              : 'bg-teal text-white hover:bg-teal-hover shadow-md hover:shadow-lg hover:scale-105'
            }
          `}
          title="Hold to speak (max 6 seconds)"
        >
          <Mic size={20} />
        </button>
      )}

      {/* Live Transcript Display */}
      {transcript && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-black/80 text-white text-xs px-3 py-2 rounded-lg">
          {transcript}
          {!transcript.trim() && <span className="opacity-50">Listening...</span>}
        </div>
      )}

      {/* Permission Request Prompt */}
      {enabled && !hasPermission && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs px-3 py-2 rounded-lg">
          Please allow microphone access to use voice input
        </div>
      )}
    </div>
  );
}