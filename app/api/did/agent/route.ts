import { NextRequest, NextResponse } from 'next/server';

/**
 * D-ID Agents API Integration for Real-Time Streaming
 * 
 * Creates agent sessions and provides WebRTC connection details
 * for real-time avatar streaming.
 */

const DID_API_BASE = 'https://api.d-id.com';

// Get the base URL for the application
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

const AGENT_IMAGE_URL = process.env.DID_AVATAR_URL || `${getBaseUrl()}/agent.png`;

interface CreateAgentRequest {
  source_url: string;
  config?: {
    result_format?: string;
    fluent?: boolean;
  };
}

interface AgentSession {
  session_id: string;
  ice_servers?: Array<{
    urls: string;
    username?: string;
    credential?: string;
  }>;
  sdp?: string;
}

/**
 * Create a D-ID agent session for real-time streaming
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.DID_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'D-ID API key not configured' },
        { status: 503 }
      );
    }

    const { source_url } = await request.json();
    const avatarUrl = source_url || AGENT_IMAGE_URL;

    // Create agent session using D-ID Agents API
    // Note: D-ID Agents API endpoint may vary - check latest documentation
    const response = await fetch(`${DID_API_BASE}/agents`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_url: avatarUrl,
        config: {
          result_format: 'mp4',
          fluent: true,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `D-ID Agent API error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const agentData = await response.json();
    
    return NextResponse.json({
      agentId: agentData.id || agentData.agent_id,
      sessionId: agentData.session_id || agentData.id,
      iceServers: agentData.ice_servers || [],
      sdp: agentData.sdp,
    });
  } catch (error: any) {
    console.error('D-ID Agent creation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create agent session',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Send text to agent for real-time speech
 */
export async function PUT(request: NextRequest) {
  try {
    const apiKey = process.env.DID_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'D-ID API key not configured' },
        { status: 503 }
      );
    }

    const { sessionId, text, voiceConfig } = await request.json();

    if (!sessionId || !text) {
      return NextResponse.json(
        { error: 'Session ID and text are required' },
        { status: 400 }
      );
    }

    // Send text to agent for real-time speech
    const response = await fetch(`${DID_API_BASE}/agents/${sessionId}/say`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice: voiceConfig || {
          provider: 'microsoft',
          voice_id: 'en-IN-PrabhatNeural',
          voice_config: {
            style: 'friendly',
            rate: '1.0',
            pitch: '+0Hz',
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `D-ID Agent say error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      messageId: result.id,
    });
  } catch (error: any) {
    console.error('D-ID Agent say error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send text to agent',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

