import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  getKnowledgeChunks,
  findRelevantChunks,
  isBusinessRelated,
  buildContext,
} from '@/app/lib/rag';
import { sendCallBooking } from '@/app/lib/n8n-webhook';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyAMjLJo-FfujPSH5ZSQFIxzb6FmW9LbK4E');
// Try gemini-pro first, fallback to gemini-1.5-pro if needed
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// In-memory conversation storage (in production, use a database)
const conversations = new Map<string, {
  history: Array<{ role: string; content: string }>;
  bookingState?: {
    step: 'mobile' | 'timezone' | 'complete';
    mobile?: string;
    timezone?: string;
  };
}>();

const SYSTEM_PROMPT = `You are a formal, professional executive assistant representing Prakash Bhambhani and Wings9 Enterprises. You conduct yourself with professionalism, clarity, and courtesy.

YOUR ROLE:
- Act as a formal executive assistant, not an information database
- Engage in professional, clear communication
- Help users understand how Wings9 can assist them
- Guide users toward booking consultations when appropriate
- Maintain a professional yet approachable tone

COMMUNICATION STYLE:
- Speak formally but naturally, like a professional assistant
- Use clear, direct language without being robotic
- Never start responses with phrases like "Based on the information available" or "According to the data"
- Never dump information in brackets like "[FIRM] Wings9 (Wings9 Enterprises) is..."
- Integrate information naturally into your responses
- Keep responses concise and professional (2-3 sentences ideal)
- Sound like you're speaking directly to the user, not reading from a document

RESPONSE FORMAT:
- Never use phrases like "Based on the information available" or "According to the context"
- Never show raw data or information in brackets
- Never say "I'd be happy to help you with more details" as a generic fallback
- Instead, provide a direct, helpful answer to their specific question
- If you don't have specific information, say "I can help you get that information" or "Let me connect you with the right person"

WHEN TO USE CONTEXT INFORMATION:
- Use context to provide accurate answers, but integrate it naturally into your response
- Don't quote information verbatim - paraphrase and make it conversational
- Only mention specific details when directly relevant to the user's question
- If the user asks "What is Wings9?", answer naturally: "Wings9 is a multi-domain professional services firm operating across UAE, Middle East, India, and international markets. We help entrepreneurs, SMEs, and corporates with business expansion and growth."
- Never say "Wings9 (Wings9 Enterprises) is..." - just say "Wings9 is..."

INTELLIGENCE & UNDERSTANDING:
- Understand what the user is really trying to achieve
- Identify their needs and goals through conversation
- Provide direct, helpful answers to their questions
- Connect their needs to relevant services naturally
- Be proactive but maintain professionalism

CALL BOOKING:
- When user wants to book a call/consultation/appointment, guide them through:
  1. First ask: "I'd be happy to schedule a consultation. May I have your mobile number?"
  2. After getting mobile number, ask: "Thank you. What timezone are you in? (e.g., IST, EST, PST, GMT)"
  3. After getting both, confirm: "Perfect. I've noted your details. Prakash's team will contact you shortly to confirm the consultation time."

GENERAL ASSISTANCE:
- Answer questions directly and professionally
- If you don't know something specific, say "I can help you get that information" or "Let me connect you with someone who can assist with that"
- Be helpful and solution-oriented
- Maintain a formal, professional tone throughout

PERSONALITY:
- Formal and professional executive assistant
- Clear and direct in communication
- Helpful and solution-oriented
- Courteous and respectful
- Never robotic or database-like`;

const OUT_OF_SCOPE_RESPONSE =
  "How may I assist you today? I can provide information about our services or help you schedule a consultation with Prakash.";

// In-memory store for chunks (embeddings are generated on-demand)
const knowledgeChunks = getKnowledgeChunks();

// Helper function to detect if user wants to book a call
function wantsToBookCall(message: string): boolean {
  const bookingKeywords = [
    'book', 'schedule', 'appointment', 'consultation', 'call', 'meeting',
    'talk', 'discuss', 'connect', 'reach out', 'contact me'
  ];
  const lowerMessage = message.toLowerCase();
  return bookingKeywords.some(keyword => lowerMessage.includes(keyword));
}

// Helper function to extract phone number
function extractPhoneNumber(message: string): string | null {
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const match = message.match(phoneRegex);
  return match ? match[0].replace(/[-.\s()]/g, '') : null;
}

// Helper function to extract timezone
function extractTimezone(message: string): string | null {
  const timezoneRegex = /\b(IST|EST|PST|MST|CST|GMT|UTC|PDT|EDT|CDT|MDT|PST|EST|CST|MST|PST|JST|CET|EET|WET|BST|AEST|AEDT|ACST|ACDT|AWST|NZST|NZDT)\b/i;
  const match = message.match(timezoneRegex);
  return match ? match[0].toUpperCase() : null;
}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const currentSessionId = sessionId || 'default';
    
    // Get or create conversation history
    if (!conversations.has(currentSessionId)) {
      conversations.set(currentSessionId, {
        history: [],
      });
    }
    const conversation = conversations.get(currentSessionId)!;

    // Handle call booking flow
    if (conversation.bookingState) {
      const { step } = conversation.bookingState;
      
      if (step === 'mobile') {
        const phoneNumber = extractPhoneNumber(message) || message.trim();
        if (phoneNumber.length >= 10) {
          conversation.bookingState.mobile = phoneNumber;
          conversation.bookingState.step = 'timezone';
          conversation.history.push(
            { role: 'user', content: message },
            { role: 'assistant', content: `Great! I've noted your number: ${phoneNumber}. What's your timezone? (e.g., IST, EST, PST, GMT)` }
          );
          return NextResponse.json({
            response: `Great! I've noted your number: ${phoneNumber}. What's your timezone? (e.g., IST, EST, PST, GMT)`,
            bookingState: conversation.bookingState,
            sessionId: currentSessionId,
          });
        } else {
          return NextResponse.json({
            response: "I need a valid mobile number to proceed. Please provide your mobile number with country code (e.g., +91 1234567890).",
            bookingState: conversation.bookingState,
            sessionId: currentSessionId,
          });
        }
      }
      
      if (step === 'timezone') {
        const extractedTimezone = extractTimezone(message);
        const timezone = extractedTimezone || message.trim().toUpperCase();
        
        if (!timezone || timezone.length < 2) {
          return NextResponse.json({
            response: "Please provide a valid timezone (e.g., IST, EST, PST, GMT, UTC).",
            bookingState: conversation.bookingState,
            sessionId: currentSessionId,
          });
        }
        
        conversation.bookingState.timezone = timezone;
        conversation.bookingState.step = 'complete';
        conversation.history.push(
          { role: 'user', content: message },
          { role: 'assistant', content: `Perfect! I've noted your details:\n- Mobile: ${conversation.bookingState.mobile}\n- Timezone: ${timezone}\n\nPrakash's team will contact you shortly to confirm the consultation time. Is there anything else I can help you with?` }
        );
        
        // Send to n8n webhook
        try {
          await sendCallBooking({
            mobile: conversation.bookingState.mobile!,
            timezone: timezone,
            sessionId: currentSessionId,
          });
          console.log('Call booking sent to n8n successfully');
        } catch (error) {
          console.error('Failed to send call booking to n8n:', error);
          // Don't fail the request if webhook fails
        }
        
        return NextResponse.json({
          response: `Perfect! I've noted your details:\n- Mobile: ${conversation.bookingState.mobile}\n- Timezone: ${timezone}\n\nPrakash's team will contact you shortly to confirm the consultation time. Is there anything else I can help you with?`,
          bookingState: conversation.bookingState,
          sessionId: currentSessionId,
        });
      }
    }

    // Check if user wants to book a call
    if (wantsToBookCall(message) && !conversation.bookingState) {
      conversation.bookingState = { step: 'mobile' };
      conversation.history.push(
        { role: 'user', content: message },
        { role: 'assistant', content: "I'd be happy to schedule a consultation! Could you please provide your mobile number?" }
      );
      return NextResponse.json({
        response: "I'd be happy to schedule a consultation! Could you please provide your mobile number?",
        bookingState: conversation.bookingState,
        sessionId: currentSessionId,
      });
    }

    // Perform RAG retrieval - get more chunks for richer context
    const relevantChunks = await findRelevantChunks(message, knowledgeChunks, 5);
    const context = relevantChunks.length > 0 ? buildContext(relevantChunks) : '';

    // Build conversation history for Gemini
    const history = conversation.history.slice(-10); // Keep last 10 messages for context
    
    // Construct the prompt - emphasize using the knowledge base to answer questions
    const contextSection = context ? `\n\nKNOWLEDGE BASE - USE THIS INFORMATION TO ANSWER THE USER'S QUESTION THOROUGHLY:\n${context}\n` : '';
    const fullPrompt = `${SYSTEM_PROMPT}${contextSection}\n\nUser Question: ${message}\n\nIMPORTANT: Answer the user's question directly and thoroughly using the knowledge base provided above. Do NOT give generic responses like "I can help you with that" or "Would you like to schedule a consultation?" - actually answer their question with detailed information from the knowledge base. Provide a comprehensive, helpful response.`;

    let assistantMessage: string = OUT_OF_SCOPE_RESPONSE;

    try {
      if (history.length > 0) {
        // Use chat with history
        const chat = model.startChat({
          history: history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          })),
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 300,
          },
        });

        const result = await chat.sendMessage(message);
        assistantMessage = result.response.text() || OUT_OF_SCOPE_RESPONSE;
      } else {
        // First message - use generateContent
        const result = await model.generateContent(fullPrompt);
        assistantMessage = result.response.text() || OUT_OF_SCOPE_RESPONSE;
      }
    } catch (modelError: any) {
      // If model not found, try alternative models
      if (modelError.message?.includes('not found') || modelError.message?.includes('404')) {
        console.warn('Primary model not available, trying alternatives...');
        const alternativeModels = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro-latest'];
        let modelFound = false;
        
        for (const modelName of alternativeModels) {
          try {
            const altModel = genAI.getGenerativeModel({ model: modelName });
            if (history.length > 0) {
              const chat = altModel.startChat({
                history: history.map(msg => ({
                  role: msg.role === 'assistant' ? 'model' : 'user',
                  parts: [{ text: msg.content }],
                })),
                generationConfig: {
                  temperature: 0.7,
                  topK: 40,
                  topP: 0.95,
                  maxOutputTokens: 300,
                },
              });
              const result = await chat.sendMessage(message);
              assistantMessage = result.response.text() || OUT_OF_SCOPE_RESPONSE;
            } else {
              const result = await altModel.generateContent(fullPrompt);
              assistantMessage = result.response.text() || OUT_OF_SCOPE_RESPONSE;
            }
            console.log(`Successfully used model: ${modelName}`);
            modelFound = true;
            break;
          } catch (altError) {
            console.warn(`Model ${modelName} also failed, trying next...`);
            continue;
          }
        }
        
        // If all models fail, use fallback response with context if available
        if (!modelFound) {
          if (context) {
            // Try to provide a helpful answer from context
            const contextSummary = context.substring(0, 500);
            assistantMessage = `${contextSummary}... How may I assist you further?`;
          } else {
            assistantMessage = OUT_OF_SCOPE_RESPONSE;
          }
        }
      } else {
        // For other errors, use fallback response with context if available
        if (context) {
          const contextSummary = context.substring(0, 500);
          assistantMessage = `${contextSummary}... How may I assist you further?`;
        } else {
          assistantMessage = OUT_OF_SCOPE_RESPONSE;
        }
        console.error('Model error (non-404):', modelError);
      }
    }

    // Update conversation history
    conversation.history.push(
      { role: 'user', content: message },
      { role: 'assistant', content: assistantMessage }
    );

    // Limit history size
    if (conversation.history.length > 20) {
      conversation.history = conversation.history.slice(-20);
    }

    return NextResponse.json({
      response: assistantMessage,
      relevantContext: relevantChunks.length > 0,
      bookingState: conversation.bookingState,
      sessionId: currentSessionId,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);

    return NextResponse.json(
      {
        error: 'An error occurred processing your request.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

