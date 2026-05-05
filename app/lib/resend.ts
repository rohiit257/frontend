const RESEND_API_URL = 'https://api.resend.com/emails';

export interface ContactEmailPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<{
  success: boolean;
  error?: string;
}> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.RESEND_CONTACT_TO_EMAIL;

  if (!apiKey || !from || !to) {
    return {
      success: false,
      error: 'Missing Resend configuration',
    };
  }

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safePhone = escapeHtml(payload.phone);
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, '<br />');

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
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
