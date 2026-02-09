import { NextRequest, NextResponse } from 'next/server';
import { scheduleMeeting } from '@/app/lib/n8n-webhook';

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

    // Send to n8n webhook
    console.log('Scheduling meeting via voice agent:', { name, email, phone, date, time, timezone, purpose });
    
    const result = await scheduleMeeting({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      date: date.trim(),
      time: time.trim(),
      timezone: timezone?.trim() || 'IST',
      purpose: purpose?.trim(),
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Meeting scheduled successfully',
        details: result.details,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message || 'Failed to schedule meeting',
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
