import { NextRequest, NextResponse } from 'next/server';
import { sendConsultationBookingEmails } from '@/app/lib/resend';

/**
 * API Route: Handle booking requests from voice/agent tools.
 *
 * This endpoint sends consultation requests to the team via Resend.
 */

interface BookingRequest {
  name: string;
  email: string;
  phone?: string;
  timezone: string;
  datetime: string;
  notes?: string;
}

function parseDateTime(datetimeStr: string): { date: string; time: string } {
  const parsed = new Date(datetimeStr);

  if (!isNaN(parsed.getTime())) {
    return {
      date: parsed.toISOString().slice(0, 10),
      time: parsed.toISOString().slice(11, 16),
    };
  }

  const parts = datetimeStr.trim().split(/\s+/);
  return {
    date: parts[0] || 'Date not provided',
    time: parts[1] || 'Time not provided',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const { date, time } = parseDateTime(body.datetime);
    const result = await sendConsultationBookingEmails({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || 'Not provided',
      date,
      time,
      timezone: body.timezone?.trim() || 'UTC',
      purpose: body.notes?.trim() || 'Voice booking request',
      source: 'booking_api',
    });

    if (!result.success) {
      console.error('Booking email send failed:', result.error);
      return NextResponse.json({
        success: true,
        message: `I've noted your booking request. Our team will contact you at ${body.email} to confirm the consultation.`,
        note: 'Manual follow-up required',
      });
    }

    return NextResponse.json({
      success: true,
      message: `Booking request received for ${body.name}. A confirmation email has been sent to ${body.email}.`,
    });
  } catch (error: any) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking', details: error.message },
      { status: 500 }
    );
  }
}
