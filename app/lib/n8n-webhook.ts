/**
 * n8n Webhook Integration
 * 
 * Sends data to n8n automation workflows via webhook
 * 
 * Configure the webhook URLs via environment variables:
 * N8N_WEBHOOK_URL=https://n8n-lhkb.onrender.com/webhook-test/9327c71e-51c9-40bd-8c01-57e75595debe
 * N8N_MEETING_WEBHOOK_URL=https://your-n8n-instance.com/webhook/schedule-meeting
 */

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 
  process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
  'https://n8n-lhkb.onrender.com/webhook-test/9327c71e-51c9-40bd-8c01-57e75595debe';

const N8N_MEETING_WEBHOOK_URL = process.env.N8N_MEETING_WEBHOOK_URL ||
  process.env.NEXT_PUBLIC_N8N_MEETING_WEBHOOK_URL ||
  N8N_WEBHOOK_URL; // Fallback to main webhook if meeting webhook not configured

export interface CallBookingData {
  type: 'call_booking';
  mobile: string;
  timezone: string;
  sessionId?: string;
  timestamp: string;
  source: 'ai_chat';
}

export interface MeetingScheduleData {
  name: string;
  email: string;
  phone: string;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:mm (24-hour)
  timezone: string;
  purpose?: string;
}

export interface ContactFormData {
  type: 'contact_form';
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: string;
  source: 'contact_form';
}

export type WebhookData = CallBookingData | ContactFormData;

/**
 * Send data to n8n webhook
 */
export async function sendToN8N(data: WebhookData): Promise<boolean> {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error('n8n webhook error:', response.status, response.statusText);
      return false;
    }

    const result = await response.json().catch(() => ({}));
    console.log('n8n webhook success:', result);
    return true;
  } catch (error) {
    console.error('Failed to send to n8n webhook:', error);
    return false;
  }
}

/**
 * Send call booking data to n8n
 */
export async function sendCallBooking(data: Omit<CallBookingData, 'type' | 'timestamp' | 'source'>): Promise<boolean> {
  const webhookData: CallBookingData = {
    type: 'call_booking',
    mobile: data.mobile,
    timezone: data.timezone,
    sessionId: data.sessionId,
    timestamp: new Date().toISOString(),
    source: 'ai_chat',
  };

  return sendToN8N(webhookData);
}

/**
 * Send contact form data to n8n
 */
export async function sendContactForm(data: Omit<ContactFormData, 'type' | 'timestamp' | 'source'>): Promise<boolean> {
  const webhookData: ContactFormData = {
    type: 'contact_form',
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    timestamp: new Date().toISOString(),
    source: 'contact_form',
  };

  return sendToN8N(webhookData);
}

/**
 * Schedule a meeting via n8n workflow
 * This sends data to the meeting scheduler workflow which creates Google Calendar events
 * and sends confirmation emails
 */
export async function scheduleMeeting(data: MeetingScheduleData): Promise<{
  success: boolean;
  message?: string;
  details?: any;
}> {
  try {
    console.log('Sending meeting schedule request to n8n:', data);
    
    const response = await fetch(N8N_MEETING_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error('n8n meeting webhook error:', response.status, response.statusText);
      return {
        success: false,
        message: `Failed to schedule meeting: ${response.statusText}`,
      };
    }

    const result = await response.json().catch(() => ({}));
    console.log('n8n meeting webhook success:', result);
    
    return {
      success: true,
      message: result.message || 'Meeting scheduled successfully',
      details: result.details || result,
    };
  } catch (error) {
    console.error('Failed to send to n8n meeting webhook:', error);
    return {
      success: false,
      message: 'Failed to connect to meeting scheduler',
    };
  }
}

