import { NextRequest, NextResponse } from 'next/server';

/**
 * D-ID Agent WebRTC Connection Handler
 * 
 * Handles WebRTC offer/answer exchange for real-time streaming
 */

const DID_API_BASE = 'https://api.d-id.com';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.DID_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'D-ID API key not configured' },
        { status: 503 }
      );
    }

    const { sessionId, agentId, offer } = await request.json();

    if (!sessionId || !offer) {
      return NextResponse.json(
        { error: 'Session ID and offer are required' },
        { status: 400 }
      );
    }

    // Send WebRTC offer to D-ID agent
    // Note: This endpoint may vary based on D-ID's actual API
    const response = await fetch(`${DID_API_BASE}/agents/${agentId || sessionId}/webrtc`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        offer,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `D-ID WebRTC error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      answer: data.answer || data.sdp,
      iceServers: data.ice_servers || [],
    });
  } catch (error: any) {
    console.error('D-ID WebRTC connection error:', error);
    return NextResponse.json(
      {
        error: 'Failed to establish WebRTC connection',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}


