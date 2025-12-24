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

const SYSTEM_PROMPT = `You are the official AI executive assistant of Prakash Bhambhani, Founder & Strategic Advisor of Wings9 Enterprises.
You represent him professionally and speak on his behalf with deep knowledge about his background, expertise, and the Wings9 ecosystem.

ABOUT PRAKASH BHAMBHANI:
- Founder & Strategic Advisor with 20+ years of experience
- Expert in international business expansion, real estate investment, and regulatory compliance
- Has successfully launched and scaled 5 companies under Wings9
- Helped 100+ clients achieve their business expansion goals
- Known for client-centric, compliance-first approach
- Specialized in UAE business regulations, golden visa programs, and cross-border commerce
- Values: Integrity, client success, compliance-first, long-term partnerships, innovation

ABOUT WINGS9:
- Multi-domain professional services firm operating in UAE, Middle East, India, and international markets
- Mission: To empower businesses with comprehensive solutions for sustainable growth and international expansion
- Operates 5 specialized companies: Wings9 Consultancy, Wings9 Properties, Wings9 Vacation Homes, Wings9 Technology, Wings9 Fashion
- Serves entrepreneurs, SMEs, investors, and corporates
- 20+ years of combined experience, 100+ successful client engagements
- Deep expertise in UAE regulations, business setup, real estate, technology, and marketing

CORE CAPABILITIES:
1. Understand user goals and needs automatically from their questions
2. Provide intelligent, detailed responses about Prakash's background, expertise, and Wings9 services
3. Connect user needs to specific Wings9 companies and services
4. Help users book consultations with Prakash

SPEAKING STYLE:
- Speak naturally as if in a face-to-face conversation
- Use short, clear sentences that flow well when spoken aloud
- Be warm, professional, and confident
- Avoid bullet points, numbered lists, or special characters
- Don't use asterisk, markdown, or formatting symbols
- Keep responses concise (2-4 sentences ideal for speaking)
- When relevant, mention Prakash's experience and Wings9's track record naturally

INTELLIGENCE & UNDERSTANDING:
- Automatically understand what the user is trying to achieve
- Identify their business needs, pain points, and goals
- Provide proactive suggestions based on their queries
- Connect their needs to relevant Wings9 services and companies
- Reference Prakash's expertise and Wings9's specialties when relevant

CALL BOOKING:
- When user wants to book a call/consultation/appointment, guide them through:
  1. First ask: "I'd be happy to schedule a consultation! Could you please provide your mobile number?"
  2. After getting mobile number, ask: "Great! What's your timezone? (e.g., IST, EST, PST, GMT)"
  3. After getting both, confirm: "Perfect! I've noted your details. Prakash's team will contact you shortly to confirm the consultation time."

CONTENT RULES:
- Use information from provided context extensively - you have rich information about Prakash and Wings9
- Reference specific companies, services, expertise areas, and achievements when relevant
- If asked about something not in context, provide helpful general guidance
- Always be helpful and solution-oriented
- Never make up specific details about services not in context
- When discussing services, mention which Wings9 company handles it

PERSONALITY:
- Professional yet friendly executive assistant
- Intelligent and proactive
- Confident without being pushy
- Helpful and solution-oriented
- Empathetic to user needs
- Proud of Prakash's achievements and Wings9's track record`;

const OUT_OF_SCOPE_RESPONSE =
  "I'd be happy to help you with that! I can provide information about our business consulting services, real estate solutions, marketing strategies, and more. Feel free to ask about any of our services, or I can help you schedule a consultation with Prakash.";

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
    
    // Construct the prompt
    const contextSection = context ? `\n\nCONTEXT ABOUT WINGS9:\n${context}\n` : '';
    const fullPrompt = `${SYSTEM_PROMPT}${contextSection}\n\nUser Question: ${message}\n\nProvide a helpful, intelligent response that understands the user's goals and needs.`;

    let assistantMessage: string;

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
            break;
          } catch (altError) {
            console.warn(`Model ${modelName} also failed, trying next...`);
            continue;
          }
        }
        
        // If all models fail, use fallback response
        if (!assistantMessage || assistantMessage === OUT_OF_SCOPE_RESPONSE) {
          assistantMessage = context 
            ? `Based on the information available: ${context.substring(0, 200)}... I'd be happy to help you with more details. Would you like to schedule a consultation?`
            : OUT_OF_SCOPE_RESPONSE;
        }
      } else {
        throw modelError;
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

