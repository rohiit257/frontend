/**
 * D-ID Voice Mapping Utility
 * 
 * Maps language codes to D-ID compatible voice IDs
 * Supports Microsoft Azure voices and ElevenLabs voices
 */

export interface VoiceConfig {
  voiceId: string;
  provider: string;
  name?: string;
  style?: string;
}

// Premium Microsoft Neural Voices (better quality for D-ID)
const MICROSOFT_VOICES: Record<string, VoiceConfig> = {
  // English - Indian Accent (Primary for realistic Indian voice)
  'en-male': {
    voiceId: 'en-IN-PrabhatNeural',
    provider: 'microsoft',
    name: 'Prabhat',
    style: 'friendly',
  },
  'en-male-indian': {
    voiceId: 'en-IN-PrabhatNeural',
    provider: 'microsoft',
    name: 'Prabhat',
    style: 'friendly',
  },
  'en-male-casual': {
    voiceId: 'en-IN-RaviNeural',
    provider: 'microsoft',
    name: 'Ravi',
    style: 'chat',
  },
  // English - Professional male voices (US/UK)
  'en-male-us': {
    voiceId: 'en-US-GuyNeural',
    provider: 'microsoft',
    name: 'Guy',
    style: 'newscast-formal',
  },
  'en-male-uk': {
    voiceId: 'en-GB-RyanNeural',
    provider: 'microsoft',
    name: 'Ryan',
    style: 'friendly',
  },
  // English - Professional female voices
  'en-female': {
    voiceId: 'en-US-JennyNeural',
    provider: 'microsoft',
    name: 'Jenny',
    style: 'assistant',
  },
  'en-female-professional': {
    voiceId: 'en-US-AriaNeural',
    provider: 'microsoft',
    name: 'Aria',
    style: 'newscast-formal',
  },
  // Default English - Indian accent
  en: {
    voiceId: 'en-IN-PrabhatNeural',
    provider: 'microsoft',
    name: 'Prabhat',
    style: 'friendly',
  },
  'en-US': {
    voiceId: 'en-US-GuyNeural',
    provider: 'microsoft',
    name: 'Guy',
    style: 'newscast-formal',
  },
  'en-IN': {
    voiceId: 'en-IN-PrabhatNeural',
    provider: 'microsoft',
    name: 'Prabhat',
    style: 'friendly',
  },
  'en-GB': {
    voiceId: 'en-GB-RyanNeural',
    provider: 'microsoft',
    name: 'Ryan',
    style: 'friendly',
  },
  // Hindi
  hi: {
    voiceId: 'hi-IN-MadhurNeural',
    provider: 'microsoft',
    name: 'Madhur',
  },
  'hi-IN': {
    voiceId: 'hi-IN-MadhurNeural',
    provider: 'microsoft',
    name: 'Madhur',
  },
  // Arabic
  ar: {
    voiceId: 'ar-AE-HamdanNeural',
    provider: 'microsoft',
    name: 'Hamdan',
  },
  'ar-AE': {
    voiceId: 'ar-AE-HamdanNeural',
    provider: 'microsoft',
    name: 'Hamdan',
  },
  // Spanish
  es: {
    voiceId: 'es-ES-AlvaroNeural',
    provider: 'microsoft',
    name: 'Alvaro',
  },
  // French
  fr: {
    voiceId: 'fr-FR-HenriNeural',
    provider: 'microsoft',
    name: 'Henri',
  },
  // German
  de: {
    voiceId: 'de-DE-ConradNeural',
    provider: 'microsoft',
    name: 'Conrad',
  },
};

// ElevenLabs Premium Voices (if API key available)
export const ELEVENLABS_VOICES = {
  adam: '3Lwx4MeTSjTvxHgnUh6k', // Professional male
  antoni: 'ErXwobaYiN019PkySvjV', // Warm male
  josh: 'TxGEqnHWrfWFTfGW9XjX', // Friendly male
  sam: 'yoZ06aMxZJJ28mfd3POQ', // Professional male
  rachel: '21m00Tcm4TlvDq8ikWAM', // Professional female
  domi: 'AZnzlk1XvdvUeBnXmlld', // Strong female
};

/**
 * Get voice configuration for a given language code
 * Defaults to professional English male if language not found
 */
export function getVoiceForLanguage(language?: string, gender?: 'male' | 'female'): VoiceConfig {
  if (!language) {
    return MICROSOFT_VOICES['en-male'];
  }

  const normalizedLang = language.toLowerCase().trim();
  
  // Try gender-specific voice first
  if (gender) {
    const genderKey = `${normalizedLang}-${gender}`;
    if (MICROSOFT_VOICES[genderKey]) {
      return MICROSOFT_VOICES[genderKey];
    }
  }
  
  // Try exact match
  if (MICROSOFT_VOICES[normalizedLang]) {
    return MICROSOFT_VOICES[normalizedLang];
  }

  // Try language code only (e.g., "en" from "en-US")
  const langCode = normalizedLang.split('-')[0];
  if (MICROSOFT_VOICES[langCode]) {
    return MICROSOFT_VOICES[langCode];
  }

  // Default to professional English male
  return MICROSOFT_VOICES['en-male'];
}

/**
 * Get ElevenLabs voice ID by name
 */
export function getElevenLabsVoice(voiceName: keyof typeof ELEVENLABS_VOICES): string {
  return ELEVENLABS_VOICES[voiceName] || ELEVENLABS_VOICES.adam;
}

/**
 * Truncate text to max length while preserving sentence boundaries
 * Optimized for natural speech breaks
 */
export function truncateText(text: string, maxLength: number = 500): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Try to cut at sentence boundary
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastExclamation = truncated.lastIndexOf('!');
  const lastQuestion = truncated.lastIndexOf('?');
  
  const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
  
  if (lastSentenceEnd > maxLength * 0.6) {
    return truncated.substring(0, lastSentenceEnd + 1);
  }
  
  // Fallback to comma or word boundary
  const lastComma = truncated.lastIndexOf(',');
  if (lastComma > maxLength * 0.7) {
    return truncated.substring(0, lastComma + 1);
  }
  
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace);
  }
  
  return truncated;
}

/**
 * Split text into speakable chunks for smoother delivery
 */
export function splitIntoChunks(text: string, maxChunkLength: number = 200): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxChunkLength) {
      currentChunk += sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    }
  }
  
  if (currentChunk) chunks.push(currentChunk.trim());
  
  return chunks;
}
