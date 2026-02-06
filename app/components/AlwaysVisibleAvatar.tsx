'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare, Video, Bot, User, Building2, Phone, Mic } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import LiveAvatar from './LiveAvatar';
import DIDAgentManager from './DIDAgentManager';
import VoiceInput from './VoiceInput';
import ElevenLabsVoiceAgent from './ElevenLabsVoiceAgent';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type Mode = 'chat' | 'voice';

const QUICK_ACTIONS = [
  { text: 'Who is Prakash?', icon: User },
  { text: 'What is Wings9?', icon: Building2 },
  { text: 'Book a call', icon: Phone },
];

export default function AlwaysVisibleAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('chat');
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [clientKey, setClientKey] = useState<string | null>(null);
  const [useRealtimeAgent, setUseRealtimeAgent] = useState(true);
  const agentSpeakRef = useRef<((text: string) => void) | null>(null);
  const agentChatRef = useRef<((message: string) => void) | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Fallback TTS using Web Speech API - Prefer Indian accent
  const speakWithWebSpeech = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0; // Natural rate
      utterance.pitch = 1.1; // Slightly higher pitch for Indian accent
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      // Prefer Indian English voices, then any Indian voice, then fallback
      const preferredVoice = voices.find(v =>
        v.lang.includes('en-IN') ||
        v.lang.includes('hi-IN') ||
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('indian')
      ) || voices.find(v =>
        v.name.includes('Google') ||
        v.name.includes('Microsoft') ||
        v.name.includes('Male')
      ) || voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
        utterance.lang = preferredVoice.lang || 'en-IN';
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Initialize D-ID agent - get agentId and clientKey from environment
  useEffect(() => {
    // To set up D-ID Agent:
    // 1. Go to D-ID Studio (https://studio.d-id.com)
    // 2. Create an Agent with image, voice, and instructions
    // 3. In Agents gallery, hover over your Agent and click [...]
    // 4. Click </> Embed button
    // 5. Set allowed domains (e.g., http://localhost:3000)
    // 6. Copy data-agent-id and data-client-key
    // 7. Add to .env.local:
    //    NEXT_PUBLIC_DID_AGENT_ID=agt_xxxxx
    //    NEXT_PUBLIC_DID_CLIENT_KEY=xxxxx

    // NEXT_PUBLIC_ variables are available at build time in client components
    const envAgentId = process.env.NEXT_PUBLIC_DID_AGENT_ID;
    const envClientKey = process.env.NEXT_PUBLIC_DID_CLIENT_KEY;

    if (envAgentId && envClientKey) {
      setAgentId(envAgentId);
      setClientKey(envClientKey);
      setUseRealtimeAgent(true);
    } else {
      console.warn('D-ID Agent credentials not found. Real-time agent will be disabled. Set NEXT_PUBLIC_DID_AGENT_ID and NEXT_PUBLIC_DID_CLIENT_KEY in environment variables.');
      setUseRealtimeAgent(false);
    }
  }, []);

  // Send text to real-time agent using SDK
  const sendToAgent = useCallback(async (text: string) => {
    if (!useRealtimeAgent || !agentSpeakRef.current) {
      return false;
    }

    try {
      setIsSpeaking(true);
      // Use the SDK's speak method
      agentSpeakRef.current(text);
      return true;
    } catch (error) {
      console.error('Send to agent error:', error);
      setIsSpeaking(false);
      return false;
    }
  }, [useRealtimeAgent]);

  // Generate D-ID video avatar with lip sync - No longer used since avatar mode removed
  const generateVideoAvatar = useCallback(async (text: string) => {
    // Just use web speech as fallback
    speakWithWebSpeech(text);
  }, [speakWithWebSpeech]);




  // Handle video end
  const handleVideoEnd = useCallback(() => {
    setCurrentVideoUrl(null);
    setIsSpeaking(false);
  }, []);

  // Send message
  const handleSend = useCallback(async (overrideMessage?: string) => {
    const messageToSend = overrideMessage || inputValue.trim();
    if (!messageToSend || isLoading) return;

    setInputValue('');
    setMessages(prev => [...prev, {
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    }]);
    setIsLoading(true);
    setCurrentResponse('');



    // Otherwise, use our chat API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantResponse = data.response || 'I apologize, but I encountered an error. Please try again.';

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      }]);
      setCurrentResponse(assistantResponse);

      // Use text-to-speech only in voice mode, not in chat mode
      if (mode === 'voice') {
        speakWithWebSpeech(assistantResponse);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = 'I apologize, but I encountered an error. Please try again.';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMsg,
        timestamp: new Date()
      }]);
      setCurrentResponse(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isGeneratingVideo, inputValue, isOpen, mode, sessionId, generateVideoAvatar, speakWithWebSpeech, useRealtimeAgent]);

  // Handle voice input transcript
  const handleVoiceTranscript = useCallback((transcript: string) => {
    setInputValue(transcript);
    setTimeout(() => {
      handleSend(transcript);
    }, 500);
  }, [handleSend]);

  // Handle enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50">
      {/* Small Button to Open Assistant */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 md:w-14 md:h-14 rounded-full bg-[var(--accent)] text-[var(--background)] shadow-2xl flex items-center justify-center border-2 border-[var(--background)] hover:bg-[var(--accent-hover)] transition-all hover:scale-110 active:scale-95"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Open AI Assistant"
          >
            <Bot className="w-7 h-7 md:w-6 md:h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Assistant Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-[calc(100vw-2rem)] md:w-[420px] max-w-[calc(100vw-2rem)] md:max-w-[420px] bg-[var(--surface)] rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Mode Toggle */}
            <div className="bg-[var(--background)] p-3 md:p-3 border-b border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isSpeaking || isLoading ? 'bg-green-500 animate-pulse' : 'bg-[var(--accent)]'}`} />
                  <h3 className="font-semibold text-sm md:text-sm text-[var(--foreground)]">AI Assistant</h3>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 md:w-7 md:h-7 rounded-lg bg-[var(--surface)] hover:bg-[var(--muted)]/20 flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 md:w-4 md:h-4 text-[var(--foreground)]" />
                </motion.button>
              </div>

              {/* Mode Toggle Buttons */}
              <div className="flex gap-1.5 md:gap-2">
                <motion.button
                  onClick={() => {
                    setMode('chat');
                    // Cancel any ongoing video generation when switching to chat mode
                    if (isGeneratingVideo) {
                      setIsGeneratingVideo(false);
                      setCurrentVideoUrl(null);
                    }
                  }}
                  className={`flex-1 px-2 md:px-3 py-2.5 md:py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 md:gap-2 ${mode === 'chat'
                    ? 'bg-[var(--accent)] text-[var(--background)] shadow-md'
                    : 'bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface)]/80'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Chat Mode</span>
                  <span className="sm:hidden">Chat</span>
                </motion.button>
                <motion.button
                  onClick={() => setMode('voice')}
                  className={`flex-1 px-2 md:px-3 py-2.5 md:py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 md:gap-2 ${mode === 'voice'
                    ? 'bg-[var(--accent)] text-[var(--background)] shadow-md'
                    : 'bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface)]/80'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Voice</span>
                  <span className="sm:hidden">Voice</span>
                </motion.button>
              </div>
            </div>

            {/* Voice Mode - ElevenLabs Voice Agent */}
            {mode === 'voice' && (
              <div className="flex-1 min-h-[300px] md:min-h-[400px]">
                <ElevenLabsVoiceAgent />
              </div>
            )}



            {/* Quick Actions - Show when no messages or in chat mode (not in voice mode) */}
            {messages.length === 0 && mode === 'chat' && (
              <div className="flex-1 overflow-y-auto px-3 md:px-4 py-3 md:py-4 bg-[var(--background)]/30">
                <div className="space-y-2">
                  <p className="text-xs text-[var(--muted)] mb-3 text-center">Quick Actions:</p>
                  {QUICK_ACTIONS.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleSend(action.text)}
                        disabled={isLoading || isGeneratingVideo}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-3 md:px-4 py-3 md:py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-left text-xs text-[var(--foreground)] hover:bg-[var(--surface)]/80 hover:border-[var(--accent)] transition-all flex items-center gap-2 md:gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Icon className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                        <span className="flex-1">{action.text}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Messages - Not shown in voice mode */}
            {messages.length > 0 && mode !== 'voice' && (
              <div className="flex-1 overflow-y-auto px-3 md:px-4 py-2 md:py-3 space-y-2 md:space-y-3 bg-[var(--background)]/30" style={{ maxHeight: '350px' }}>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[90%] md:max-w-[85%] px-3 py-2 rounded-xl text-xs ${msg.role === 'user'
                        ? 'bg-[var(--accent)] text-[var(--background)] rounded-br-md'
                        : 'bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] rounded-bl-md'
                        }`}
                    >
                      <div className="react-markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Quick Actions - Show below messages in chat mode when not loading */}
            {messages.length > 0 && mode === 'chat' && !isLoading && (
              <div className="px-4 py-2 bg-[var(--background)]/30 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--muted)] mb-2">Quick Actions:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_ACTIONS.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleSend(action.text)}
                        disabled={isLoading || isGeneratingVideo}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-2 md:px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] hover:bg-[var(--surface)]/80 hover:border-[var(--accent)] transition-all flex items-center gap-1 md:gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Icon className="w-3 h-3 text-[var(--accent)]" />
                        <span>{action.text}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Loading indicator - Not shown in voice mode */}
            {isLoading && mode !== 'voice' && (
              <div className="px-4 py-2 bg-[var(--background)]/50">
                <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <motion.div
                    className="w-3 h-3 border-2 border-[var(--accent)] border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <span>Thinking...</span>
                </div>
              </div>
            )}

            {/* Input Area - Not shown in voice mode */}
            {mode !== 'voice' && (
              <div className="p-3 md:p-4 border-t border-[var(--border)] bg-[var(--background)]">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything..."
                      disabled={isLoading || isGeneratingVideo || isListening}
                      className="w-full px-3 md:px-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] text-[var(--foreground)] placeholder:text-[var(--muted)] disabled:opacity-50 transition-all text-sm"
                      autoFocus
                    />
                  </div>

                  {/* Voice Input */}
                  <VoiceInput
                    onTranscript={handleVoiceTranscript}
                    onListeningChange={setIsListening}
                    disabled={isLoading || isGeneratingVideo || isSpeaking}
                    className="flex-shrink-0"
                  />

                  {/* Send Button */}
                  <motion.button
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim() || isLoading || isGeneratingVideo}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 md:w-10 md:h-10 rounded-xl bg-[var(--accent)] text-[var(--background)] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                  >
                    <Send className="w-5 h-5 md:w-4 md:h-4" />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

