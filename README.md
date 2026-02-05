# Wings9 Portfolio Frontend

This is a [Next.js](https://nextjs.org) project for Wings9 Management Consultancies, featuring an AI-powered chat assistant with comprehensive Q&A capabilities and meeting scheduling.

## Features

- **AI Chat Assistant**: Powered by Google Gemini with RAG (Retrieval-Augmented Generation)
- **Wings9 Q&A Corpus**: 150+ questions covering business setup, immigration, golden visa, tax compliance, and services
- **Meeting Scheduler**: Integrated with n8n workflow for automated Google Calendar events and email confirmations
- **Responsive Design**: Mobile-first design with optimized UI components

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key (for embeddings)
- Google Gemini API key
- n8n instance with meeting scheduler workflow (optional)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:

```env
# Required: Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Required: OpenAI API Key (for embeddings)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: n8n Webhook URLs
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook-test/your-webhook-id
N8N_MEETING_WEBHOOK_URL=https://your-n8n-instance.com/webhook/schedule-meeting
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## AI Chat Features

### Wings9 Q&A Corpus

The AI assistant is trained on a comprehensive corpus of 150+ questions covering:

- **Business Setup**: Company formation, licenses, free zones, mainland setup
- **Immigration**: Golden visa, work permits, residence visas
- **Tax Compliance**: VAT, corporate tax, transfer pricing
- **Services**: PRO services, banking, attestation, notary
- **Company Overview**: About Wings9, leadership, portfolio

The corpus is located at `public/wings9_qna_corpus.json` and is automatically loaded when the application starts.

### Meeting Scheduler

The AI assistant can schedule consultations by collecting:

1. **Name**: Full name of the user
2. **Email**: Valid email address
3. **Phone**: Phone number with country code
4. **Date**: Preferred date (YYYY-MM-DD format)
5. **Time**: Preferred time (HH:mm 24-hour format)
6. **Timezone**: User's timezone (e.g., GST, IST, EST)
7. **Purpose**: Optional meeting purpose

The scheduler integrates with an n8n workflow that:
- Creates a Google Calendar event
- Sends confirmation email with meeting details
- Provides calendar invite link

## Project Structure

```
app/
├── api/
│   └── chat/
│       └── route.ts          # Chat API endpoint with booking flow
├── components/
│   └── AlwaysVisibleAvatar.tsx  # AI chat interface
├── lib/
│   ├── rag.ts                # RAG implementation
│   ├── wings9-corpus.ts      # Corpus loader
│   ├── n8n-webhook.ts        # Webhook integration
│   └── knowledge-base.ts     # Base knowledge
public/
└── wings9_qna_corpus.json    # Q&A training data
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI responses |
| `OPENAI_API_KEY` | Yes | OpenAI API key for embeddings |
| `N8N_WEBHOOK_URL` | No | General n8n webhook URL |
| `N8N_MEETING_WEBHOOK_URL` | No | Meeting scheduler webhook URL |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
