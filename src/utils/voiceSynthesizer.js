// Robust Web Speech API voice engine with auto-voice discovery & resume fixes

class SpeechEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.isSpeaking = false;
    this.voices = [];

    if (this.synth) {
      this.loadVoices();
      if (typeof window !== 'undefined' && window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices() || [];
  }

  speak(text, langCode = 'en-US', onStart, onEnd, onError) {
    if (!this.synth) {
      if (onError) onError('Speech synthesis not supported');
      return;
    }

    try {
      // Chrome/Safari voice synthesis stuck bug fix: cancel and resume
      this.synth.cancel();
      if (this.synth.paused) {
        this.synth.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);

      if (this.voices.length === 0) {
        this.loadVoices();
      }

      // Find best voice or fallback
      const targetLangPrefix = langCode.split('-')[0].toLowerCase();
      let matchedVoice = this.voices.find(v => v.lang.toLowerCase() === langCode.toLowerCase()) 
                      || this.voices.find(v => v.lang.toLowerCase().startsWith(targetLangPrefix))
                      || this.voices.find(v => v.default);

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.lang = langCode;
      utterance.rate = 0.95; // Clear natural pacing
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        this.isSpeaking = false;
        console.warn('Speech synthesis event:', e);
        if (onEnd) onEnd(); // gracefully reset UI state
      };

      // Periodic check to prevent Chrome speech cutoff on long texts
      const resumeInterval = setInterval(() => {
        if (!this.synth.speaking) {
          clearInterval(resumeInterval);
        } else {
          this.synth.pause();
          this.synth.resume();
        }
      }, 10000);

      this.synth.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis error:', err);
      this.isSpeaking = false;
      if (onError) onError(err);
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }
}

export const speechEngine = new SpeechEngine();
