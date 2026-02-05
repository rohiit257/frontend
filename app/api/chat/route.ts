import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  getKnowledgeChunks,
  findRelevantChunks,
  isBusinessRelated,
  buildContext,
} from '@/app/lib/rag';
import { sendCallBooking, scheduleMeeting } from '@/app/lib/n8n-webhook';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// Use gemini-2.5-flash for better performance
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// In-memory conversation storage (in production, use a database)
const conversations = new Map<string, {
  history: Array<{ role: string; content: string }>;
  bookingState?: {
    step: 'name' | 'email' | 'phone' | 'date' | 'time' | 'timezone' | 'purpose' | 'complete';
    name?: string;
    email?: string;
    phone?: string;
    date?: string;
    time?: string;
    timezone?: string;
    purpose?: string;
  };
}>();

const SYSTEM_PROMPT = `You are an expert executive assistant representing Prakash Bhambhani and Wings9 Management Consultancies. You ONLY answer questions using information from the provided knowledge base.

CRITICAL RULES - FOLLOW STRICTLY:
1. **ONLY use information from the KNOWLEDGE BASE provided below**
2. **NEVER make up information or answer from general knowledge**
3. **If the knowledge base doesn't contain the answer, politely say you don't have that information**
4. **Stay strictly within Wings9's domain**: business setup, immigration, tax compliance, corporate services in UAE/Middle East/India

YOUR IDENTITY:
- You represent Wings9, a professional services firm specializing in business setup, immigration, tax compliance, and corporate services
- You have access to a comprehensive knowledge base about Wings9's services
- You ONLY provide information that exists in your knowledge base

WHAT YOU CAN ANSWER:
- Questions about Wings9 services (business setup, immigration, golden visa, PRO services, tax, etc.)
- Questions about UAE/Dubai business processes that are in your knowledge base
- Questions about Prakash Bhambhani and Wings9's portfolio
- How to contact Wings9 or schedule consultations

WHAT YOU CANNOT ANSWER:
- General questions not related to Wings9 or its services
- Questions outside your knowledge base scope
- Personal advice not covered in your knowledge base
- Topics unrelated to business setup, immigration, or corporate services

HOW TO RESPOND:

**When you HAVE the information:**
- Provide a complete, detailed answer from the knowledge base
- Include specific details: processes, requirements, benefits, timelines
- Be professional, warm, and helpful
- Structure longer answers clearly
- End with a relevant next step or consultation offer

**When you DON'T HAVE the information:**
- Be honest and direct: "I don't have specific information about that in my knowledge base."
- Offer to connect them: "However, I can schedule a consultation with Prakash or our team who can help you with that. Would you like to book a call?"
- NEVER make up or guess information

RESPONSE STYLE:
- Professional yet conversational
- Complete and informative (use the full knowledge base)
- Natural language (avoid "Based on the information available")
- Specific and detailed when you have the information
- Honest when you don't have the information

EXAMPLES:

✅ GOOD (Knowledge base has info):
User: "What is the UAE Golden Visa?"
You: "The UAE Golden Visa is a 10-year renewable residence visa offering self-sponsored residency. Wings9 can help you qualify through several pathways: as an investor (projects valued at AED 500,000+), as an entrepreneur with high-growth potential, or through specialized talents. The process involves document preparation, application submission, and coordination with immigration authorities. Would you like to schedule a consultation to discuss your eligibility?"

✅ GOOD (Knowledge base doesn't have info):
User: "What's the weather like in Dubai?"
You: "I don't have information about weather in my knowledge base. I specialize in Wings9's business setup, immigration, and corporate services. Is there anything related to these services I can help you with?"

❌ BAD (Making up info):
User: "What are the best restaurants in Dubai?"
You: "Dubai has many great restaurants like..." [NEVER DO THIS]

BOOKING CONSULTATIONS:
- Proactively suggest consultations for complex questions or when you don't have specific details
- Guide through the 7-step booking process professionally
- Make it easy: "Would you like to schedule a consultation with Prakash to discuss this?"

REMEMBER:
- Your knowledge is LIMITED to the provided knowledge base
- NEVER answer from general knowledge or make assumptions
- Be helpful within your scope, honest about your limitations
- Guide users to consultations when needed`;

const OUT_OF_SCOPE_RESPONSE =
  "I apologize, but I don't have information about that in my knowledge base. I specialize in Wings9's services including business setup, immigration, golden visa, tax compliance, and corporate services in UAE and Middle East. Is there anything related to these services I can help you with? Or would you like to schedule a consultation with our team?";

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

// Helper function to validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to validate date (YYYY-MM-DD)
function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime()) && parsedDate > new Date();
}

// Helper function to validate time (HH:mm)
function isValidTime(time: string): boolean {
  const timeRegex = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
}

// Helper function to extract timezone
function extractTimezone(message: string): string | null {
  const timezoneRegex = /\b(IST|EST|PST|MST|CST|GMT|UTC|PDT|EDT|CDT|MDT|PST|EST|CST|MST|PST|JST|CET|EET|WET|BST|AEST|AEDT|ACST|ACDT|AWST|NZST|NZDT|GST|AST)\b/i;
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
      
      // Step 1: Collect name
      if (step === 'name') {
        const name = message.trim();
        if (name.length >= 2) {
          conversation.bookingState.name = name;
          conversation.bookingState.step = 'email';
          conversation.history.push(
            { role: 'user', content: message },
            { role: 'assistant', content: `Thank you, ${name}! What's your email address?` }
          );
          return NextResponse.json({
            response: `Thank you, ${name}! What's your email address?`,
            bookingState: conversation.bookingState,
            sessionId: currentSessionId,
          });
        } else {
          return NextResponse.json({
            response: "Please provide your full name.",
            bookingState: conversation.bookingState,
            sessionId: currentSessionId,
          });
        }
      }
      
      // Step 2: Collect email
      if (step === 'email') {
        const email = message.trim();
        if (isValidEmail(email)) {
          conversation.bookingState.email = email;
          conversation.bookingState.step = 'phone';
          conversation.history.push(
            { role: 'user', content: message },
            { role: 'assistant', content: "Great! What's your phone number? (Include country code, e.g., +971 50 123 4567)" }
          );
          return NextResponse.json({
            response: "Great! What's your phone number? (Include country code, e.g., +971 50 123 4567)",
            bookingState: conversation.bookingState,
            sessionId: currentSessionId,
          });
        } else {
          return NextResponse.json({
            response: "Please provide a valid email address.",
            bookingState: conversation.bookingState,
            sessionId: currentSessionId,
          });
        }
      }
      
      // Step 3: Collect phone
      if (step === 'phone') {
        const phoneNumber = extractPhoneNumber(message) || message.trim();
        if (phoneNumber.length >= 10) {
          conversation.bookingState.phone = phoneNumber;
          conversation.bookingState.step = 'date';
          conversation.history.push(
            { role: 'user', content: message },
            { role: 'assistant', content: "Perfect! What date would you prefer for the consultation? (Format: YYYY-MM-DD, e.g., 2026-02-10)" }
          );
          return NextResponse.json({
            response: "Perfect! What date would you prefer for the consultation? (Format: YYYY-MM-DD, e.g., 2026-02-10)",
            bookingState: conversation.bookingState,
            sessionId: currentSessionId,
          });
        } else {
          return NextResponse.json({
            response: "Please provide a valid phone number with country code (e.g., +971 50 123 4567).",
            bookingState: conversation.bookingState,
            sessionId: currentSessionId,
          });
        }
      }
      
      // Step 4: Collect date
      if (step === 'date') {
        const date = message.trim();
        if (isValidDate(date)) {
          conversation.bookingState.date = date;
          conversation.bookingState.step = 'time';
          conversation.history.push(
            { role: 'user', content: message },
            { role: 'assistant', content: "Excellent! What time would work best for you? (Format: HH:mm in 24-hour, e.g., 14:00 for 2 PM)" }
          );
          return NextResponse.json({
            response: "Excellent! What time would work best for you? (Format: HH:mm in 24-hour, e.g., 14:00 for 2 PM)",
            bookingState: conversation.bookingState,
            sessionId: currentSessionId,
          });
        } else {
          return NextResponse.json({
            response: "Please provide a valid future date in YYYY-MM-DD format (e.g., 2026-02-10).",
            bookingState: conversation.bookingState,
            sessionId: currentSessionId,
          });
        }
      }
      
      // Step 5: Collect time
      if (step === 'time') {
        const time = message.trim();
        if (isValidTime(time)) {
          conversation.bookingState.time = time;
          conversation.bookingState.step = 'timezone';
          conversation.history.push(
            { role: 'user', content: message },
            { role: 'assistant', content: "Great! What's your timezone? (e.g., GST, IST, EST, PST, GMT)" }
          );
          return NextResponse.json({
            response: "Great! What's your timezone? (e.g., GST, IST, EST, PST, GMT)",
            bookingState: conversation.bookingState,
            sessionId: currentSessionId,
          });
        } else {
          return NextResponse.json({
            response: "Please provide a valid time in HH:mm format (e.g., 14:00 for 2 PM, 09:30 for 9:30 AM).",
            bookingState: conversation.bookingState,
            sessionId: currentSessionId,
          });
        }
      }
      
      // Step 6: Collect timezone
      if (step === 'timezone') {
        const extractedTimezone = extractTimezone(message);
        const timezone = extractedTimezone || message.trim().toUpperCase();
        
        if (!timezone || timezone.length < 2) {
          return NextResponse.json({
            response: "Please provide a valid timezone (e.g., GST, IST, EST, PST, GMT, UTC).",
            bookingState: conversation.bookingState,
            sessionId: currentSessionId,
          });
        }
        
        conversation.bookingState.timezone = timezone;
        conversation.bookingState.step = 'purpose';
        conversation.history.push(
          { role: 'user', content: message },
          { role: 'assistant', content: "Almost done! What's the purpose of this consultation? (Optional - press Enter to skip)" }
        );
        return NextResponse.json({
          response: "Almost done! What's the purpose of this consultation? (Optional - press Enter to skip)",
          bookingState: conversation.bookingState,
          sessionId: currentSessionId,
        });
      }
      
      // Step 7: Collect purpose (optional) and complete
      if (step === 'purpose') {
        const purpose = message.trim();
        if (purpose && purpose.toLowerCase() !== 'skip') {
          conversation.bookingState.purpose = purpose;
        }
        
        conversation.bookingState.step = 'complete';
        
        // Send to n8n meeting scheduler webhook
        try {
          const result = await scheduleMeeting({
            name: conversation.bookingState.name!,
            email: conversation.bookingState.email!,
            phone: conversation.bookingState.phone!,
            date: conversation.bookingState.date!,
            time: conversation.bookingState.time!,
            timezone: conversation.bookingState.timezone!,
            purpose: conversation.bookingState.purpose,
          });
          
          if (result.success) {
            const confirmationMessage = `Perfect! Your consultation has been scheduled:\n\n📅 Date: ${conversation.bookingState.date}\n🕐 Time: ${conversation.bookingState.time} ${conversation.bookingState.timezone}\n👤 Name: ${conversation.bookingState.name}\n📧 Email: ${conversation.bookingState.email}\n📱 Phone: ${conversation.bookingState.phone}${conversation.bookingState.purpose ? `\n📝 Purpose: ${conversation.bookingState.purpose}` : ''}\n\nYou'll receive a confirmation email shortly with the meeting details and calendar invite. Is there anything else I can help you with?`;
            
            conversation.history.push(
              { role: 'user', content: message },
              { role: 'assistant', content: confirmationMessage }
            );
            
            return NextResponse.json({
              response: confirmationMessage,
              bookingState: conversation.bookingState,
              sessionId: currentSessionId,
            });
          } else {
            const errorMessage = `I've collected your details, but there was an issue scheduling the meeting. Our team will contact you shortly at ${conversation.bookingState.phone} to confirm the consultation.`;
            conversation.history.push(
              { role: 'user', content: message },
              { role: 'assistant', content: errorMessage }
            );
            return NextResponse.json({
              response: errorMessage,
              bookingState: conversation.bookingState,
              sessionId: currentSessionId,
            });
          }
        } catch (error) {
          console.error('Failed to schedule meeting:', error);
          const errorMessage = `I've collected your details. Our team will contact you shortly at ${conversation.bookingState.phone} to confirm the consultation.`;
          conversation.history.push(
            { role: 'user', content: message },
            { role: 'assistant', content: errorMessage }
          );
          return NextResponse.json({
            response: errorMessage,
            bookingState: conversation.bookingState,
            sessionId: currentSessionId,
          });
        }
      }
    }

    // Check if user wants to book a call
    if (wantsToBookCall(message) && !conversation.bookingState) {
      conversation.bookingState = { step: 'name' };
      conversation.history.push(
        { role: 'user', content: message },
        { role: 'assistant', content: "I'd be happy to schedule a consultation with Prakash! Let's get started. What's your name?" }
      );
      return NextResponse.json({
        response: "I'd be happy to schedule a consultation with Prakash! Let's get started. What's your name?",
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
            maxOutputTokens: 1000,  // Increased for comprehensive responses
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
        const alternativeModels = ['gemini-2.5-flash-latest', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.5-pro-latest'];
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
                  maxOutputTokens: 1000,  // Increased for comprehensive responses
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

