import { NextRequest, NextResponse } from 'next/server';

/**
 * D-ID Video Avatar API Route
 * 
 * Generates talking avatar videos using D-ID API.
 * This is an optional feature - falls back gracefully if unavailable.
 * 
 * Security:
 * - API key stored in environment variable
 * - Rate limiting should be implemented at application level
 * - Never expose API key to frontend
 */

const DID_API_BASE = 'https://api.d-id.com';
const MAX_SCRIPT_LENGTH = 300;
const POLL_INTERVAL = 2000; // 2 seconds
const MAX_POLL_ATTEMPTS = 30; // 60 seconds max wait time

interface DIDCreateRequest {
  source_url: string;
  script: {
    type: string;
    input: string;
    provider?: {
      type: string;
      voice_id?: string;
      voice_config?: {
        style?: string;
      };
    };
  };
  config?: {
    result_format?: string;
    fluent?: boolean;
    pad_audio?: number;
  };
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
 * Truncate script to max length while preserving sentence boundaries
 */
function truncateScript(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  // Try to cut at sentence boundary
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastExclamation = truncated.lastIndexOf('!');
  const lastQuestion = truncated.lastIndexOf('?');
  
  const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
  
  if (lastSentenceEnd > maxLength * 0.7) {
    return truncated.substring(0, lastSentenceEnd + 1);
  }
  
  // Fallback to word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Create D-ID video generation request
 */
async function createDIDVideo(
  script: string,
  avatarImageUrl: string
): Promise<{ videoId: string } | null> {
  const apiKey = process.env.DID_API_KEY;
  
  if (!apiKey) {
    throw new Error('D-ID API key not configured');
  }

  // Truncate script if needed
  const truncatedScript = truncateScript(script, MAX_SCRIPT_LENGTH);

  const requestBody: DIDCreateRequest = {
    source_url: avatarImageUrl,
    script: {
      type: 'text',
      input: truncatedScript,
      provider: {
        type: 'microsoft',
        voice_id: 'en-US-AriaNeural', // Professional, neutral voice
        voice_config: {
          style: 'neutral', // No emotional exaggeration
        },
      },
    },
    config: {
      result_format: 'mp4',
      fluent: true,
      pad_audio: 0.0,
    },
  };

  try {
    const response = await fetch(`${DID_API_BASE}/talks`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `D-ID API error: ${response.status} - ${errorData.message || response.statusText}`
      );
    }

    const data: DIDCreateResponse = await response.json();
    return { videoId: data.id };
  } catch (error: any) {
    console.error('D-ID create video error:', error);
    throw error;
  }
}

/**
 * Poll D-ID API until video is ready
 */
async function pollDIDVideo(videoId: string): Promise<string | null> {
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
          'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`D-ID poll error: ${response.status}`);
      }

      const data: DIDGetResponse = await response.json();

      if (data.status === 'done' && data.result_url) {
        return data.result_url;
      }

      if (data.status === 'error') {
        throw new Error(`D-ID video generation failed: ${data.error?.message || 'Unknown error'}`);
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
    // Check if D-ID is enabled (can be disabled in demo/test environments)
    if (process.env.DID_ENABLED === 'false') {
      return NextResponse.json(
        { error: 'Video avatar feature is disabled' },
        { status: 503 }
      );
    }

    const { text, avatarImageUrl } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!avatarImageUrl || typeof avatarImageUrl !== 'string') {
      return NextResponse.json(
        { error: 'Avatar image URL is required' },
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

    // Create video generation request
    const videoData = await createDIDVideo(text, avatarImageUrl);
    
    if (!videoData) {
      throw new Error('Failed to create D-ID video request');
    }

    // Poll until video is ready
    const videoUrl = await pollDIDVideo(videoData.videoId);

    return NextResponse.json({
      videoUrl,
      videoId: videoData.videoId,
    });
  } catch (error: any) {
    console.error('D-ID video generation error:', error);

    // Return error but don't expose internal details
    return NextResponse.json(
      {
        error: 'Video generation failed',
        message: 'Video avatar unavailable. Please use text/voice mode.',
      },
      { status: 500 }
    );
  }
}

