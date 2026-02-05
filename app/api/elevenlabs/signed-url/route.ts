import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: Generate a signed URL for ElevenLabs conversation
 * 
 * This endpoint securely generates a signed URL using your ElevenLabs API key.
 * The signed URL allows the client to establish a WebSocket connection without
 * exposing your API key on the frontend.
 */

const ELEVENLABS_API_KEY = "sk_fe873722dc38627103968a40adf048881e4b86d5b4ac5a7f";
const AGENT_ID = "agent_7501kgn67r6zejpt9vkr1rnhmnv3";

export async function GET(request: NextRequest) {
  try {
    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY is not configured');
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    if (!AGENT_ID) {
      console.error('NEXT_PUBLIC_ELEVENLABS_AGENT_ID is not configured');
      return NextResponse.json(
        { error: 'ElevenLabs Agent ID not configured' },
        { status: 500 }
      );
    }

    // Get signed URL from ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${AGENT_ID}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to get signed URL from ElevenLabs' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      signedUrl: data.signed_url,
    });
  } catch (error: any) {
    console.error('Signed URL generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
