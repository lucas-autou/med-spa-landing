// Text-to-Speech Service with ElevenLabs integration
// Falls back to Web Speech API if ElevenLabs is not available

import { 
  elevenLabsTTSClient, 
  initializeElevenLabs, 
  stopElevenLabsSpeaking 
} from './elevenLabsTTSClient';

export interface TTSOptions {
  rate?: number;      // Speed: 0.1 to 10 (default: 1)
  pitch?: number;     // Pitch: 0 to 2 (default: 1)
  volume?: number;    // Volume: 0 to 1 (default: 1)
  voice?: string;     // Voice name (default: system default)
  useElevenLabs?: boolean; // Force ElevenLabs or browser TTS
  onStart?: () => void;    // Callback when speech actually starts
}

class TTSService {
  private synthesis: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isSupported: boolean = false;
  private isSpeaking: boolean = false;
  private useElevenLabs: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Try to initialize ElevenLabs first
    if (typeof window !== 'undefined') {
      try {
        this.useElevenLabs = initializeElevenLabs();
        if (this.useElevenLabs) {
          console.log('🎙️ Using ElevenLabs for ultra-realistic TTS');
        }
      } catch (error) {
        console.warn('Failed to initialize ElevenLabs:', error);
        this.useElevenLabs = false;
      }
    }
    
    // Also initialize Web Speech API as fallback
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.isSupported = true;
      
      // Load voices
      this.loadVoices();
      
      // Some browsers need a user interaction to load voices
      if (this.synthesis.onvoiceschanged !== undefined) {
        this.synthesis.onvoiceschanged = () => this.loadVoices();
      }
    } else {
      console.warn('Web Speech API not supported in this browser');
    }
  }

  private loadVoices() {
    if (!this.synthesis) return;
    
    this.voices = this.synthesis.getVoices();
    
    // Try to select a female voice for Sarah
    const femaleVoices = this.voices.filter(voice => 
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('victoria') ||
      voice.name.toLowerCase().includes('karen') ||
      voice.name.toLowerCase().includes('moira') ||
      voice.name.toLowerCase().includes('tessa')
    );
    
    // Prefer US English female voice
    const usEnglishFemale = femaleVoices.find(voice => 
      voice.lang.startsWith('en-US')
    );
    
    if (usEnglishFemale) {
      this.selectedVoice = usEnglishFemale;
    } else if (femaleVoices.length > 0) {
      this.selectedVoice = femaleVoices[0];
    } else {
      // Fallback to any US English voice
      const usEnglish = this.voices.find(voice => voice.lang.startsWith('en-US'));
      this.selectedVoice = usEnglish || this.voices[0];
    }
  }

  public async speak(text: string, options: TTSOptions = {}): Promise<number> {
    // Use ElevenLabs if available and not explicitly disabled
    if (this.useElevenLabs && options.useElevenLabs !== false) {
      try {
        this.isSpeaking = true;
        // Call onStart callback if provided (for video sync)
        if (options.onStart) {
          console.log('🎙️ ElevenLabs TTS starting - calling onStart callback');
          options.onStart();
        }
        const duration = await elevenLabsTTSClient.speak(text, {
          // Map browser TTS options to ElevenLabs options
          stability: 0.5,
          similarityBoost: 0.75,
          style: 0.3,
          useSpeakerBoost: true,
        });
        this.isSpeaking = false;
        return duration;
      } catch (error) {
        console.warn('ElevenLabs TTS failed, falling back to browser TTS:', error);
        this.isSpeaking = false;
        // Continue to browser TTS fallback
      }
    }
    
    // Fallback to browser TTS
    return new Promise((resolve, reject) => {
      if (!this.isSupported || !this.synthesis) {
        console.warn('TTS not supported, skipping speech');
        resolve(0);
        return;
      }

      // Load voices if not loaded yet
      if (this.voices.length === 0) {
        this.loadVoices();
        // Try again after a short delay if voices aren't loaded
        if (this.voices.length === 0) {
          console.log('⏳ Voices not loaded yet, attempting to load...');
          setTimeout(() => {
            this.loadVoices();
            if (this.voices.length === 0) {
              console.warn('❌ No voices available, skipping TTS');
              resolve(0);
              return;
            }
            // Retry speak with voices loaded
            this.speak(text, options).then(resolve).catch(reject);
          }, 100);
          return;
        }
      }

      // Cancel any ongoing speech
      this.stop();

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
        console.log('🎤 Using voice:', this.selectedVoice.name);
      } else {
        console.log('⚠️ No voice selected, using browser default');
      }
      
      // Set options
      utterance.rate = options.rate || 1.1;     // Slightly faster for natural feel
      utterance.pitch = options.pitch || 1.1;   // Slightly higher pitch for friendliness
      utterance.volume = options.volume || 0.9;
      
      // Set language
      utterance.lang = 'en-US';
      
      // Event handlers
      utterance.onstart = () => {
        this.isSpeaking = true;
        console.log('🎵 TTS started speaking');
      };
      
      const startTime = Date.now();
      
      // Track speech events for accurate timing
      utterance.onstart = () => {
        console.log('🎙️ Browser TTS started');
        // Call the onStart callback if provided
        if (options.onStart) {
          options.onStart();
        }
      };
      
      // IMPORTANT: This promise resolves when audio actually ends
      // This ensures synchronization with video state changes
      utterance.onend = () => {
        this.isSpeaking = false;
        const duration = Date.now() - startTime;
        console.log('✅ Browser TTS completed - Duration:', duration, 'ms');
        // Resolve only when audio has truly ended
        resolve(duration);
      };
      
      utterance.onerror = (event) => {
        this.isSpeaking = false;
        console.error('TTS Error:', event);
        reject(event);
      };
      
      // Speak
      this.synthesis.speak(utterance);
    });
  }

  public stop() {
    // Stop ElevenLabs if it's playing
    if (this.useElevenLabs) {
      stopElevenLabsSpeaking();
    }
    
    // Also stop browser TTS
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public pause() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.pause();
    }
  }

  public resume() {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public getIsSupported(): boolean {
    return this.isSupported;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public setVoice(voiceName: string) {
    const voice = this.voices.find(v => v.name === voiceName);
    if (voice) {
      this.selectedVoice = voice;
    }
  }
}

// Export singleton instance
export const ttsService = new TTSService();

// Helper function for easy use
export async function speak(text: string, options?: TTSOptions): Promise<number> {
  return ttsService.speak(text, options);
}

// Export stop function
export function stopSpeaking(): void {
  ttsService.stop();
}