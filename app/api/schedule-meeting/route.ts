import { NextRequest, NextResponse } from 'next/server';
import { sendConsultationBookingEmails } from '@/app/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, date, time, timezone, purpose } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !date || !time) {
      return NextResponse.json(
        { error: 'Name, email, phone, date, and time are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    console.log('Scheduling meeting via voice agent email:', { name, email, phone, date, time, timezone, purpose });
    
    const result = await sendConsultationBookingEmails({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      date: date.trim(),
      time: time.trim(),
      timezone: timezone?.trim() || 'IST',
      purpose: purpose?.trim(),
      source: 'voice_agent',
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Consultation request sent successfully',
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.error || 'Failed to send consultation request',
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Schedule meeting API error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while scheduling the meeting.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
