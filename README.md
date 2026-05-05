# Wings9 Portfolio Frontend

This is a [Next.js](https://nextjs.org) project for Wings9 Management Consultancies, featuring an AI-powered chat assistant with comprehensive Q&A capabilities and meeting scheduling.

## Features

- **AI Chat Assistant**: Powered by Google Gemini with RAG (Retrieval-Augmented Generation)
- **Wings9 Q&A Corpus**: 150+ questions covering business setup, immigration, golden visa, tax compliance, and services
- **Meeting Scheduler**: Consultation requests are sent via Resend email with visitor confirmation emails
- **Responsive Design**: Mobile-first design with optimized UI components

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key (for embeddings)
- Google Gemini API key
- Resend account and verified sender email

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

# Required: Resend API configuration for contact form emails
RESEND_API_KEY=re_your_resend_api_key_here
RESEND_FROM_EMAIL=Portfolio Contact <onboarding@resend.dev>
RESEND_CONTACT_TO_EMAIL=you@example.com

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

The scheduler collects consultation details and:
- Emails the Wings9 team via Resend
- Sends a confirmation email to the visitor
- Supports manual follow-up by the team

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
│   ├── resend.ts             # Resend email integration
│   └── knowledge-base.ts     # Base knowledge
public/
└── wings9_qna_corpus.json    # Q&A training data
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI responses |
| `OPENAI_API_KEY` | Yes | OpenAI API key for embeddings |
| `RESEND_API_KEY` | Yes | Resend API key used by contact and booking email routes |
| `RESEND_FROM_EMAIL` | Yes | Verified sender address/name for outgoing contact emails |
| `RESEND_CONTACT_TO_EMAIL` | Yes | Inbox that receives contact form and consultation booking submissions |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
