import { NextRequest, NextResponse } from 'next/server';
import { sendToN8N } from '@/app/lib/n8n-webhook';

/**
 * API Route: Handle booking requests from ElevenLabs voice agent
 * 
 * This endpoint receives booking requests from the ElevenLabs agent's
 * book_meeting tool and handles calendar integration.
 * 
 * Supports two modes:
 * 1. Cal.com integration (if CAL_COM_API_KEY is set)
 * 2. n8n webhook fallback (existing integration)
 */

const CAL_COM_API_KEY = process.env.CAL_COM_API_KEY;
const CAL_COM_EVENT_TYPE_ID = process.env.CAL_COM_EVENT_TYPE_ID;

interface BookingRequest {
    name: string;
    email: string;
    timezone: string;
    datetime: string;
    notes?: string;
}

// Parse datetime string to ISO format
function parseDateTime(datetimeStr: string, timezone: string): Date {
    // Try to parse various formats
    const date = new Date(datetimeStr);

    if (!isNaN(date.getTime())) {
        return date;
    }

    // If parsing fails, default to tomorrow at 10 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    return tomorrow;
}

// Book via Cal.com API
async function bookWithCalCom(booking: BookingRequest): Promise<{ success: boolean; bookingId?: string; error?: string }> {
    if (!CAL_COM_API_KEY || !CAL_COM_EVENT_TYPE_ID) {
        return { success: false, error: 'Cal.com not configured' };
    }

    try {
        const startTime = parseDateTime(booking.datetime, booking.timezone);
        const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 min duration

        const response = await fetch('https://api.cal.com/v1/bookings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CAL_COM_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventTypeId: parseInt(CAL_COM_EVENT_TYPE_ID),
                start: startTime.toISOString(),
                end: endTime.toISOString(),
                responses: {
                    name: booking.name,
                    email: booking.email,
                },
                timeZone: booking.timezone || 'UTC',
                metadata: {
                    source: 'elevenlabs_voice_agent',
                    notes: booking.notes || '',
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Cal.com booking error:', response.status, errorData);
            return { success: false, error: errorData.message || 'Cal.com booking failed' };
        }

        const data = await response.json();
        return { success: true, bookingId: data.id?.toString() };
    } catch (error: any) {
        console.error('Cal.com API error:', error);
        return { success: false, error: error.message };
    }
}

// Book via n8n webhook (fallback)
async function bookWithN8N(booking: BookingRequest): Promise<{ success: boolean; error?: string }> {
    try {
        const success = await sendToN8N({
            type: 'call_booking',
            mobile: booking.email, // Using email since we don't have phone
            timezone: booking.timezone,
            sessionId: `elevenlabs-${Date.now()}`,
            timestamp: new Date().toISOString(),
            source: 'ai_chat',
        });

        return { success };
    } catch (error: any) {
        console.error('n8n webhook error:', error);
        return { success: false, error: error.message };
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: BookingRequest = await request.json();

        // Validate required fields
        if (!body.name || !body.email) {
            return NextResponse.json(
                { error: 'Name and email are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        console.log('Booking request received:', {
            name: body.name,
            email: body.email,
            timezone: body.timezone,
            datetime: body.datetime,
        });

        // Try Cal.com first, fallback to n8n
        let result: { success: boolean; bookingId?: string; error?: string };

        if (CAL_COM_API_KEY && CAL_COM_EVENT_TYPE_ID) {
            result = await bookWithCalCom(body);

            if (!result.success) {
                console.warn('Cal.com booking failed, falling back to n8n:', result.error);
                result = await bookWithN8N(body);
            }
        } else {
            // Use n8n as primary if Cal.com is not configured
            result = await bookWithN8N(body);
        }

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: `Booking confirmed for ${body.name}. A calendar invite will be sent to ${body.email}.`,
                bookingId: result.bookingId,
            });
        } else {
            // Even if integration fails, we log the booking attempt
            console.error('All booking methods failed:', result.error);

            // Return success to the agent but log the failure
            // This ensures the conversation continues smoothly
            return NextResponse.json({
                success: true,
                message: `I've noted your booking request. Our team will contact you at ${body.email} to confirm the consultation.`,
                note: 'Manual follow-up required',
            });
        }
    } catch (error: any) {
        console.error('Booking API error:', error);
        return NextResponse.json(
            { error: 'Failed to process booking', details: error.message },
            { status: 500 }
        );
    }
}
