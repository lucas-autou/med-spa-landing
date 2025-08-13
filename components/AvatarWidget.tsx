'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAssistantStore, type AvatarState } from '@/store/useAssistantStore';
import { useDemoStore, type VideoState } from '@/store/useDemoStore';
import { trackAvatarEvent } from '@/lib/analytics';
import { config } from '@/lib/config';
import AvatarPlaceholder from './AvatarPlaceholder';

interface AvatarWidgetProps {
  className?: string;
  autoStart?: boolean;
  useDemo?: boolean;
}

export default function AvatarWidget({ className = '', autoStart = true, useDemo = false }: AvatarWidgetProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [useVideoMode, setUseVideoMode] = useState(false);
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>(config.avatar.videos.idle);
  const [nextVideoSrc, setNextVideoSrc] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const preloadedVideos = useRef<Map<string, HTMLVideoElement>>(new Map());
  
  const {
    avatarState,
    setAvatarState,
    isConversationActive,
    startConversation,
    leadData,
    updateLeadData,
    setSpeaking,
  } = useAssistantStore();

  const { videoState, demoState } = useDemoStore();

  // Preload all videos for smooth transitions
  const preloadVideos = useCallback(async () => {
    const videos = [
      config.avatar.videos.idle,
      config.avatar.videos.listening,
      config.avatar.videos.talking.neutral,
      config.avatar.videos.talking.animated,
      config.avatar.videos.talking.empathetic,
      config.avatar.videos.welcome,
      config.avatar.videos.pointing,
    ];

    const loadPromises = videos.map(src => {
      return new Promise<void>((resolve) => {
        const video = document.createElement('video');
        video.src = src;
        video.preload = 'auto';
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        
        video.onloadeddata = () => {
          preloadedVideos.current.set(src, video);
          resolve();
        };
        
        video.onerror = () => {
          console.warn(`Failed to preload video: ${src}`);
          resolve();
        };
        
        // Start loading
        video.load();
      });
    });

    try {
      await Promise.all(loadPromises);
      return true;
    } catch (error) {
      console.error('Error preloading videos:', error);
      return false;
    }
  }, []);

  // Check if videos exist, fallback to placeholder
  useEffect(() => {
    // Try to load the first video to see if videos are available
    const testVideo = document.createElement('video');
    testVideo.src = config.avatar.videos.idle;
    
    testVideo.onloadeddata = async () => {
      // Videos are available, use video mode
      setUseVideoMode(true);
      
      // Preload all videos
      await preloadVideos();
      setIsLoaded(true);
    };
    
    testVideo.onerror = () => {
      // Videos not available, use placeholder mode
      setUseVideoMode(false);
      setIsLoaded(true);
    };
  }, [preloadVideos]);

  // Smooth crossfade transition between videos
  const transitionToVideo = useCallback((newSrc: string) => {
    if (isTransitioning || currentVideoSrc === newSrc) return;
    
    setIsTransitioning(true);
    setNextVideoSrc(newSrc);
    
    // Start playing the next video (hidden)
    if (nextVideoRef.current) {
      nextVideoRef.current.play().catch(console.warn);
    }
    
    // Perform crossfade after a brief moment to ensure next video is ready
    setTimeout(() => {
      // Swap the videos
      setCurrentVideoSrc(newSrc);
      setNextVideoSrc('');
      setIsTransitioning(false);
    }, 100);
  }, [currentVideoSrc, isTransitioning]);

  // Handle avatar state changes and video switching
  useEffect(() => {
    if (!isLoaded) return;

    let newVideoSrc: string = config.avatar.videos.idle;
    
    // Use demo video state if in demo mode, otherwise use regular avatar state
    const currentState = useDemo ? videoState : avatarState;
    
    switch (currentState) {
      case 'listening':
        newVideoSrc = config.avatar.videos.listening;
        break;
      case 'talking':
      case 'talking_neutral':
        newVideoSrc = config.avatar.videos.talking.neutral;
        break;
      case 'talking_animated':
        newVideoSrc = config.avatar.videos.talking.animated;
        break;
      case 'talking_empathetic':
        newVideoSrc = config.avatar.videos.talking.empathetic;
        break;
      case 'ack_nod':
        newVideoSrc = config.avatar.videos.listening;
        break;
      case 'wave':
        newVideoSrc = config.avatar.videos.talking.animated; // Use animated for wave
        break;
      case 'welcome':
        newVideoSrc = config.avatar.videos.welcome;
        break;
      case 'pointing':
        newVideoSrc = config.avatar.videos.pointing;
        break;
      default:
        newVideoSrc = config.avatar.videos.idle;
    }

    if (currentVideoSrc !== newVideoSrc) {
      transitionToVideo(newVideoSrc);
    }
  }, [avatarState, videoState, useDemo, isLoaded, currentVideoSrc, transitionToVideo]);

  // Auto-start conversation after component mounts
  useEffect(() => {
    if (autoStart && isLoaded && !isConversationActive) {
      const timer = setTimeout(() => {
        startConversation();
        trackAvatarEvent('avatar_interaction_start');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoStart, isLoaded, isConversationActive, startConversation]);

  const handleVideoLoad = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.warn);
    }
  };

  const handleGreeting = () => {
    if (!isConversationActive) {
      startConversation();
      speak(getGreetingText());
      trackAvatarEvent('greeting_started');
    }
  };

  const speak = (text: string, onComplete?: () => void) => {
    setAvatarState('talking');
    setSpeaking(true);
    
    // Simulate speech duration (replace with actual TTS)
    const duration = Math.max(2000, text.length * 50); // ~50ms per character
    
    setTimeout(() => {
      setAvatarState('idle');
      setSpeaking(false);
      if (onComplete) onComplete();
    }, duration);
  };

  const getGreetingText = () => {
    return "Hi! I'm your Virtual Receptionist for Med Spas. Can I ask 2 quick questions to see how I can help fill your calendar?";
  };

  // This component is now simplified since InteractiveHero handles the conversation

  // Chip handling now done in InteractiveHero

  // Simplified for compatibility

  return (
    <div className={`flex flex-col items-center space-y-6 ${className}`}>
      {/* Avatar Display */}
      {useVideoMode ? (
        <div ref={containerRef} className="relative w-72 h-96 md:w-80 md:h-[432px] rounded-2xl overflow-hidden bg-background-card border border-border-light shadow-lg">
          {isLoaded ? (
            <>
              {/* Current video */}
              <video
                ref={videoRef}
                src={currentVideoSrc}
                autoPlay
                loop
                muted
                playsInline
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out ${
                  isTransitioning && nextVideoSrc ? 'opacity-0' : 'opacity-100'
                }`}
                onLoadedData={handleVideoLoad}
              />
              
              {/* Next video (for crossfade) */}
              {nextVideoSrc && (
                <video
                  ref={nextVideoRef}
                  src={nextVideoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out ${
                    isTransitioning ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-pulse text-text-secondary">Loading avatar...</div>
            </div>
          )}
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-teal/5 via-transparent to-transparent pointer-events-none" />
        </div>
      ) : (
        <AvatarPlaceholder state={avatarState} />
      )}

      {/* Greeting Button (before conversation starts) */}
      {!isConversationActive && (
        <button
          onClick={handleGreeting}
          className="px-6 py-3 bg-teal hover:bg-teal-hover text-white font-semibold rounded-lg shadow-cta transition-all duration-200 transform hover:scale-105"
        >
          👋 Start Conversation
        </button>
      )}

      {/* Simplified - conversation now handled by InteractiveHero */}
      {/* This component is kept for compatibility but main interaction is in InteractiveHero */}
    </div>
  );
}