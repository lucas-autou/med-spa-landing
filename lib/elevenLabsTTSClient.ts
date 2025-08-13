// ElevenLabs TTS Client-side Service
// Uses the REST API directly to avoid Node.js dependencies in the browser

export interface ElevenLabsTTSOptions {
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

// Popular female voices for Sarah
const SARAH_VOICES = {
  rachel: '21m00Tcm4TlvDq8ikWAM',     // Rachel - warm, conversational
  bella: 'EXAVITQu4vr4xnSDxMaL',      // Bella - young, friendly
  elli: 'MF3mGyEYCl7XYWbV9V6O',       // Elli - calm, professional
  nicole: 'piTKgcLEGmPE4e6mEKli',     // Nicole - mature, trustworthy
  sarah: 'EXAVITQu4vr4xnSDxMaL',      // Default Sarah voice
};

class ElevenLabsTTSClient {
  private apiKey: string = '';
  private currentAudio: HTMLAudioElement | null = null;
  private selectedVoiceId: string = SARAH_VOICES.rachel;
  private isSpeaking = false;
  private isInitialized = false;

  public initialize(apiKey?: string): boolean {
    // Get API key from parameter or environment
    if (typeof window !== 'undefined') {
      this.apiKey = apiKey || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '';
      
      if (!this.apiKey) {
        console.warn('ElevenLabs API key not provided, TTS will use browser fallback');
        return false;
      }

      this.isInitialized = true;
      console.log('✅ ElevenLabs TTS Client initialized');
      return true;
    }
    return false;
  }

  public async speak(text: string, options: ElevenLabsTTSOptions = {}): Promise<number> {
    if (!this.isInitialized || !this.apiKey) {
      throw new Error('ElevenLabs not initialized');
    }

    try {
      // Stop any ongoing speech
      this.stop();

      console.log('🎤 ElevenLabs TTS starting...', {
        textLength: text.length,
        voiceId: options.voiceId || this.selectedVoiceId,
      });

      // Make direct API call to ElevenLabs
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${options.voiceId || this.selectedVoiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: options.modelId || 'eleven_turbo_v2_5',
            voice_settings: {
              stability: options.stability ?? 0.5,
              similarity_boost: options.similarityBoost ?? 0.75,
              style: options.style ?? 0.3,
              use_speaker_boost: options.useSpeakerBoost ?? true,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
      }

      // Get audio blob from response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.volume = 0.9;
      this.isSpeaking = true;

      return new Promise((resolve, reject) => {
        if (!this.currentAudio) {
          reject(new Error('Audio element not created'));
          return;
        }

        const audio = this.currentAudio;
        let startTime = Date.now();
        let audioDuration = 0;
        
        // Get duration from metadata when available
        audio.onloadedmetadata = () => {
          audioDuration = audio.duration * 1000; // Convert to milliseconds
          console.log('📏 Audio metadata duration:', audioDuration, 'ms');
        };
        
        // Track when audio actually starts playing
        audio.onplay = () => {
          startTime = Date.now();
          console.log('🍵 Audio playback started');
        };

        // IMPORTANT: This promise now resolves ONLY when audio actually ends
        // This ensures perfect synchronization with video state changes
        audio.onended = () => {
          this.isSpeaking = false;
          
          // Calculate actual playback duration
          const actualDuration = Date.now() - startTime;
          
          // Use metadata duration if available, otherwise use actual
          const finalDuration = audioDuration > 0 ? audioDuration : actualDuration;
          
          URL.revokeObjectURL(audioUrl);
          console.log('✅ ElevenLabs TTS completed - Duration:', finalDuration, 'ms');
          
          // Resolve with duration, but more importantly, 
          // this promise resolution signals that audio has truly ended
          resolve(finalDuration);
        };

        this.currentAudio.onerror = (error) => {
          this.isSpeaking = false;
          URL.revokeObjectURL(audioUrl);
          console.error('❌ Audio playback error:', error);
          reject(error);
        };

        // Play audio and handle errors
        this.currentAudio.play().then(() => {
          console.log('🎵 Audio playback initiated');
        }).catch((error) => {
          this.isSpeaking = false;
          URL.revokeObjectURL(audioUrl);
          console.error('❌ Failed to play audio:', error);
          reject(error);
        });
      });
    } catch (error) {
      this.isSpeaking = false;
      console.error('❌ ElevenLabs TTS error:', error);
      throw error;
    }
  }

  public stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    this.isSpeaking = false;
  }

  public setVoice(voiceId: string): void {
    this.selectedVoiceId = voiceId;
  }

  public getAvailableVoices() {
    return SARAH_VOICES;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public getIsInitialized(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const elevenLabsTTSClient = new ElevenLabsTTSClient();

// Helper functions
export async function speakWithElevenLabs(
  text: string,
  options?: ElevenLabsTTSOptions
): Promise<number> {
  return elevenLabsTTSClient.speak(text, options);
}

export function stopElevenLabsSpeaking(): void {
  elevenLabsTTSClient.stop();
}

export function initializeElevenLabs(apiKey?: string): boolean {
  if (typeof window !== 'undefined') {
    return elevenLabsTTSClient.initialize(apiKey);
  }
  return false;
}