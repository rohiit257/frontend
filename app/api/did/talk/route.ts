import { NextRequest, NextResponse } from 'next/server';
import { getVoiceForLanguage, truncateText } from '@/app/lib/did-voices';

/**
 * D-ID Talks API Integration - Enhanced for Natural Speech
 * 
 * Generates talking-head avatar videos using D-ID Talks API with
 * premium voice settings for natural lip-sync.
 */

const DID_API_BASE = 'https://api.d-id.com';
const POLL_INTERVAL = 1500; // 1.5 seconds
const MAX_POLL_ATTEMPTS = 40; // 60 seconds max wait time
const MAX_TEXT_LENGTH = 500;

// Get the base URL for the application
function getBaseUrl(): string {
  // In production, use the environment variable or construct from request
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // For local development, default to localhost
  return 'http://localhost:3000';
}

// Use the agent.png from public folder - needs to be publicly accessible
// For D-ID to work, the image must be accessible via a full URL
// You may need to upload agent.png to a CDN or use a publicly accessible URL
const AGENT_IMAGE_URL = process.env.DID_AVATAR_URL || `${getBaseUrl()}/agent.png`;

// Safe avatar images - stock photos that won't trigger celebrity detection (fallbacks)
const DID_PRESENTERS = [
  AGENT_IMAGE_URL, // Primary: use agent.png
  'https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
];

// Default to agent.png
const DEFAULT_AVATAR_URL = AGENT_IMAGE_URL;

interface DIDTalkRequest {
  source_url: string;
  script: {
    type: string;
    input: string;
    provider: {
      type: string;
      voice_id: string;
      voice_config?: {
        style?: string;
        rate?: string;
        pitch?: string;
      };
    };
  };
  config: {
    stitch: boolean;
    result_format?: string;
    fluent?: boolean;
    pad_audio?: number;
  };
  driver_url?: string;
}

interface DIDCreateResponse {
  id: string;
  status: string;
  created_at: string;
}

interface DIDGetResponse {
  id: string;
  status: string;
  created_at: string;
  result_url?: string;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Create D-ID talk request with enhanced voice settings
 * Includes retry logic with fallback presenters if celebrity detection occurs
 */
async function createDIDTalk(
  text: string,
  language: string = 'en',
  voiceGender: 'male' | 'female' = 'male',
  presenterIndex: number = 0
): Promise<{ videoId: string }> {
  const apiKey = process.env.DID_API_KEY;

  if (!apiKey) {
    throw new Error('D-ID API key not configured');
  }

  // Get voice configuration
  const voiceConfig = getVoiceForLanguage(language, voiceGender);

  // Truncate and clean text
  let processedText = truncateText(text, MAX_TEXT_LENGTH);
  // Remove markdown and special characters for cleaner speech
  processedText = processedText
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/#+\s/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  // Get avatar URL - prioritize agent.png, use fallback if retrying
  let avatarUrl: string;
  if (presenterIndex === 0) {
    // Primary: use agent.png from public folder
    avatarUrl = process.env.DID_AVATAR_URL || AGENT_IMAGE_URL;
    console.log(`Using agent.png: ${avatarUrl}`);
  } else if (presenterIndex < DID_PRESENTERS.length) {
    // Use fallback presenter
    avatarUrl = DID_PRESENTERS[presenterIndex];
    console.log(`Using fallback presenter ${presenterIndex}: ${avatarUrl}`);
  } else {
    avatarUrl = DEFAULT_AVATAR_URL;
  }
  
  // Validate URL has proper image extension
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const hasValidExtension = imageExtensions.some(ext => 
    avatarUrl.toLowerCase().includes(ext)
  );
  
  if (!hasValidExtension) {
    console.warn('Avatar URL missing image extension, using default presenter');
    avatarUrl = DEFAULT_AVATAR_URL;
  }

  // Ensure text is not empty
  if (!processedText || processedText.length === 0) {
    throw new Error('Text input cannot be empty');
  }

  // Build request with enhanced settings
  const requestBody: DIDTalkRequest = {
    source_url: avatarUrl,
    script: {
      type: 'text',
      input: processedText,
      provider: {
        type: voiceConfig.provider,
        voice_id: voiceConfig.voiceId,
        voice_config: {
          style: voiceConfig.style || 'friendly',
          rate: '1.0', // Natural speaking rate for Indian accent
          pitch: '+0Hz', // Slightly higher pitch for more natural sound
        },
      },
    },
    config: {
      stitch: true,
      result_format: 'mp4',
      fluent: true, // Enable fluent mode for natural speech
      pad_audio: 0.5, // Add slight padding for natural feel
    },
  };

  try {
    console.log('Creating D-ID talk video:', {
      avatarUrl,
      textLength: processedText.length,
      voice: voiceConfig.voiceId,
    });

    const response = await fetch(`${DID_API_BASE}/talks`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { raw: errorText };
      }
      
      console.error('D-ID API Error:', {
        status: response.status,
        error: errorData,
      });
      
      throw new Error(
        `D-ID API error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data: DIDCreateResponse = await response.json();
    console.log('D-ID talk created:', data.id);
    return { videoId: data.id };
  } catch (error: any) {
    console.error('D-ID create talk error:', error);
    throw error;
  }
}

/**
 * Poll D-ID API until video is ready
 */
async function pollDIDTalk(videoId: string): Promise<string> {
  const apiKey = process.env.DID_API_KEY;

  if (!apiKey) {
    throw new Error('D-ID API key not configured');
  }

  let attempts = 0;

  while (attempts < MAX_POLL_ATTEMPTS) {
    try {
      const response = await fetch(`${DID_API_BASE}/talks/${videoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`D-ID poll error: ${response.status}`);
      }

      const data: DIDGetResponse = await response.json();

      if (data.status === 'done' && data.result_url) {
        console.log('D-ID video ready:', data.result_url);
        return data.result_url;
      }

      if (data.status === 'error') {
        throw new Error(
          `D-ID video generation failed: ${data.error?.message || 'Unknown error'}`
        );
      }

      // Status is 'created' or 'started' - continue polling
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
      attempts++;
    } catch (error: any) {
      console.error('D-ID poll error:', error);
      throw error;
    }
  }

  throw new Error('D-ID video generation timeout');
}

export async function POST(request: NextRequest) {
  try {
    // Check if D-ID is enabled
    if (process.env.DID_ENABLED === 'false') {
      return NextResponse.json(
        { error: 'Video avatar feature is disabled' },
        { status: 503 }
      );
    }

    const { text, language, voiceGender } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Validate API key exists
    if (!process.env.DID_API_KEY) {
      console.error('D-ID API key not configured');
      return NextResponse.json(
        { error: 'Video avatar service unavailable' },
        { status: 503 }
      );
    }

    // Try creating D-ID talk with retry on errors
    let videoData: { videoId: string } | null = null;
    let lastError: Error | null = null;
    const MAX_RETRIES = 3;
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      for (let presenterIndex = 0; presenterIndex < DID_PRESENTERS.length; presenterIndex++) {
        try {
          videoData = await createDIDTalk(
            text, 
            language || 'en',
            voiceGender || 'male',
            presenterIndex
          );
          break; // Success, exit presenter loop
        } catch (error: any) {
          lastError = error;
          const errorMsg = error.message || '';
          
          // Celebrity detection - try next presenter
          if (errorMsg.includes('CelebrityDetected') || errorMsg.includes('451')) {
            console.log(`Celebrity detected, trying fallback presenter ${presenterIndex + 1}...`);
            continue;
          }
          
          // Server error (500) - wait and retry same presenter
          if (errorMsg.includes('500') || errorMsg.includes('Internal Server')) {
            console.log(`Server error, attempt ${attempt + 1}/${MAX_RETRIES}, waiting 2s...`);
            await new Promise(r => setTimeout(r, 2000));
            break; // Exit presenter loop to retry
          }
          
          // Other errors - throw immediately
          throw error;
        }
      }
      if (videoData) break; // Success, exit retry loop
    }
    
    if (!videoData) {
      throw lastError || new Error('Failed to create video after retries');
    }

    // Poll until video is ready
    const videoUrl = await pollDIDTalk(videoData.videoId);

    return NextResponse.json({
      videoUrl,
      videoId: videoData.videoId,
    });
  } catch (error: any) {
    console.error('D-ID talk error:', error);

    return NextResponse.json(
      {
        error: 'Video generation failed',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
