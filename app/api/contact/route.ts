import { NextRequest, NextResponse } from 'next/server';
import { sendContactForm } from '@/app/lib/n8n-webhook';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Validate phone format (at least 10 digits)
    const phoneRegex = /\d{10,}/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    // Send to n8n webhook
    try {
      const success = await sendContactForm({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });

      if (!success) {
        console.warn('n8n webhook returned error, but continuing...');
      } else {
        console.log('Contact form sent to n8n successfully');
      }
    } catch (error) {
      console.error('Failed to send contact form to n8n:', error);
      // Don't fail the request if webhook fails - still return success
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
    });
  } catch (error: any) {
    console.error('Contact form API error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while submitting your message. Please try again.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

