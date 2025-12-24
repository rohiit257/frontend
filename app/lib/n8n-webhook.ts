/**
 * n8n Webhook Integration
 * 
 * Sends data to n8n automation workflows via webhook
 * 
 * Configure the webhook URL via environment variable:
 * N8N_WEBHOOK_URL=https://n8n-lhkb.onrender.com/webhook-test/9327c71e-51c9-40bd-8c01-57e75595debe
 */

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 
  process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
  'https://n8n-lhkb.onrender.com/webhook-test/9327c71e-51c9-40bd-8c01-57e75595debe';

export interface CallBookingData {
  type: 'call_booking';
  mobile: string;
  timezone: string;
  sessionId?: string;
  timestamp: string;
  source: 'ai_chat';
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

