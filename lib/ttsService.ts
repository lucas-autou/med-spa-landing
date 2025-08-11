// Text-to-Speech Service using Web Speech API
// Falls back to silent mode if not supported

export interface TTSOptions {
  rate?: number;      // Speed: 0.1 to 10 (default: 1)
  pitch?: number;     // Pitch: 0 to 2 (default: 1)
  volume?: number;    // Volume: 0 to 1 (default: 1)
  voice?: string;     // Voice name (default: system default)
}

class TTSService {
  private synthesis: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isSupported: boolean = false;
  private isSpeaking: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Check if Web Speech API is available
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

  public speak(text: string, options: TTSOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported || !this.synthesis) {
        console.warn('TTS not supported, skipping speech');
        resolve();
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
              resolve();
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
      
      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
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
export async function speak(text: string, options?: TTSOptions): Promise<void> {
  return ttsService.speak(text, options);
}

// Export stop function
export function stopSpeaking(): void {
  ttsService.stop();
}