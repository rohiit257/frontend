const RESEND_API_URL = 'https://api.resend.com/emails';

export interface ContactEmailPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ConsultationBookingPayload {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  timezone: string;
  purpose?: string;
  source?: 'ai_chat' | 'voice_agent' | 'booking_api' | 'website';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendEmail(payload: {
  to: string[];
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return {
      success: false,
      error: 'Missing Resend configuration',
    };
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: payload.to,
      reply_to: payload.replyTo,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    return {
      success: false,
      error: errorBody || `Resend request failed with status ${response.status}`,
    };
  }

  return { success: true };
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<{
  success: boolean;
  error?: string;
}> {
  const to = process.env.RESEND_CONTACT_TO_EMAIL;

  if (!to) {
    return {
      success: false,
      error: 'Missing Resend recipient configuration',
    };
  }

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safePhone = escapeHtml(payload.phone);
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, '<br />');

  return sendEmail({
    to: [to],
    replyTo: payload.email,
    subject: `New contact form submission from ${payload.name}`,
    text: [
      'New contact form submission',
      '',
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      '',
      'Message:',
      payload.message,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 16px;">New contact form submission</h2>
        <p style="margin: 0 0 8px;"><strong>Name:</strong> ${safeName}</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> ${safeEmail}</p>
        <p style="margin: 0 0 8px;"><strong>Phone:</strong> ${safePhone}</p>
        <p style="margin: 16px 0 8px;"><strong>Message:</strong></p>
        <p style="margin: 0;">${safeMessage}</p>
      </div>
    `,
  });
}

export async function sendConsultationBookingEmails(
  payload: ConsultationBookingPayload
): Promise<{
  success: boolean;
  error?: string;
}> {
  const to = process.env.RESEND_CONTACT_TO_EMAIL;

  if (!to) {
    return {
      success: false,
      error: 'Missing Resend recipient configuration',
    };
  }

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safePhone = escapeHtml(payload.phone);
  const safeDate = escapeHtml(payload.date);
  const safeTime = escapeHtml(payload.time);
  const safeTimezone = escapeHtml(payload.timezone);
  const safePurpose = escapeHtml(payload.purpose || 'Not provided');
  const safeSource = escapeHtml(payload.source || 'website');

  const internalEmail = await sendEmail({
    to: [to],
    replyTo: payload.email,
    subject: `New consultation booking from ${payload.name}`,
    text: [
      'New consultation booking request',
      '',
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      `Date: ${payload.date}`,
      `Time: ${payload.time}`,
      `Timezone: ${payload.timezone}`,
      `Purpose: ${payload.purpose || 'Not provided'}`,
      `Source: ${payload.source || 'website'}`,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 16px;">New consultation booking request</h2>
        <p style="margin: 0 0 8px;"><strong>Name:</strong> ${safeName}</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> ${safeEmail}</p>
        <p style="margin: 0 0 8px;"><strong>Phone:</strong> ${safePhone}</p>
        <p style="margin: 0 0 8px;"><strong>Date:</strong> ${safeDate}</p>
        <p style="margin: 0 0 8px;"><strong>Time:</strong> ${safeTime}</p>
        <p style="margin: 0 0 8px;"><strong>Timezone:</strong> ${safeTimezone}</p>
        <p style="margin: 0 0 8px;"><strong>Purpose:</strong> ${safePurpose}</p>
        <p style="margin: 0 0 8px;"><strong>Source:</strong> ${safeSource}</p>
      </div>
    `,
  });

  if (!internalEmail.success) {
    return internalEmail;
  }

  const confirmationText = [
    `Hi ${payload.name},`,
    '',
    'We received your consultation request.',
    `Preferred date: ${payload.date}`,
    `Preferred time: ${payload.time} ${payload.timezone}`,
    `Phone: ${payload.phone}`,
    `Purpose: ${payload.purpose || 'Not provided'}`,
    '',
    'Our team will review the request and contact you shortly to confirm the consultation.',
    '',
    'Wings9 Management Consultancies',
  ].join('\n');

  const confirmationHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin: 0 0 16px;">Consultation request received</h2>
      <p style="margin: 0 0 12px;">Hi ${safeName},</p>
      <p style="margin: 0 0 12px;">We received your consultation request with the following details:</p>
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <p style="margin: 0 0 8px;"><strong>Date:</strong> ${safeDate}</p>
        <p style="margin: 0 0 8px;"><strong>Time:</strong> ${safeTime} ${safeTimezone}</p>
        <p style="margin: 0 0 8px;"><strong>Phone:</strong> ${safePhone}</p>
        <p style="margin: 0;"><strong>Purpose:</strong> ${safePurpose}</p>
      </div>
      <p style="margin: 0 0 12px;">Our team will review the request and contact you shortly to confirm the consultation.</p>
      <p style="margin: 0;">Wings9 Management Consultancies</p>
    </div>
  `;

  const confirmationEmail = await sendEmail({
    to: [payload.email],
    subject: 'We received your consultation request',
    text: confirmationText,
    html: confirmationHtml,
  });

  if (!confirmationEmail.success) {
    console.error('Failed to send consultation confirmation email:', confirmationEmail.error);
  }

  return { success: true };
}
