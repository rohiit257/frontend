'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import LiveAvatar from './LiveAvatar';
import VoiceInput from './VoiceInput';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Greeting message on first open
  const [hasGreeted, setHasGreeted] = useState(false);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current && !isListening) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isListening]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show greeting when first opened
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true);
      setCurrentResponse("Hello! I'm Prakash's AI assistant. How can I help you today? You can type your question or click the microphone to speak.");
    }
  }, [isOpen, hasGreeted]);

  // Generate D-ID video avatar with lip sync
  const generateVideoAvatar = async (text: string) => {
    setIsGeneratingVideo(true);
    setCurrentVideoUrl(null);
    setIsSpeaking(true);

    try {
      const response = await fetch('/api/did/talk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language: 'en',
          voiceGender: 'male',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Video generation failed');
      }

      const data = await response.json();
      if (data.videoUrl) {
        setCurrentVideoUrl(data.videoUrl);
      } else {
        throw new Error('No video URL returned');
      }
    } catch (error: any) {
      console.error('Video generation error:', error);
      // Fallback to Web Speech API for text-to-speech
      speakWithWebSpeech(text);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  // Fallback TTS using Web Speech API
  const speakWithWebSpeech = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Try to find a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.name.includes('Google') || 
        v.name.includes('Microsoft') ||
        v.name.includes('Male')
      ) || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Handle video end
  const handleVideoEnd = useCallback(() => {
    setCurrentVideoUrl(null);
    setIsSpeaking(false);
  }, []);

  // Stop everything when chat closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentVideoUrl(null);
      setCurrentResponse('');
      setIsSpeaking(false);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen]);

  // Handle voice input transcript
  const handleVoiceTranscript = useCallback((transcript: string) => {
    setInputValue(transcript);
    // Auto-send after voice input
    setTimeout(() => {
      handleSend(transcript);
    }, 500);
  }, []);

  // Send message
  const handleSend = async (overrideMessage?: string) => {
    const messageToSend = overrideMessage || inputValue.trim();
    if (!messageToSend || isLoading || isGeneratingVideo) return;

    setInputValue('');
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: messageToSend,
      timestamp: new Date()
    }]);
    setIsLoading(true);
    setCurrentResponse('');

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

      // Generate lip-sync video
      await generateVideoAvatar(assistantResponse);
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
  };

  // Handle enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative rounded-full w-16 h-16 bg-[var(--accent)] text-[var(--background)] shadow-2xl hover:shadow-[var(--accent)]/30 transition-all flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Animated ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[var(--accent)]"
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="w-7 h-7" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <Sparkles className="w-7 h-7" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[440px] max-w-[calc(100vw-3rem)] bg-[var(--surface)] rounded-3xl shadow-2xl border border-[var(--border)] overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 150px)' }}
          >
            {/* Header */}
            <div className="bg-[var(--background)] p-4 flex items-center justify-between border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="relative w-12 h-12 rounded-full bg-[var(--accent)]/20 flex items-center justify-center overflow-hidden"
                  animate={isSpeaking ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
                >
                  <Sparkles className="w-6 h-6 text-[var(--accent)]" />
                  {isSpeaking && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[var(--accent)]"
                      animate={{ scale: [1, 1.2], opacity: [1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                <div>
                  <h3 className="font-bold text-[var(--foreground)]">AI Executive Assistant</h3>
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className={`w-2 h-2 rounded-full ${isSpeaking || isLoading ? 'bg-green-500' : 'bg-[var(--accent)]'}`}
                      animate={isSpeaking ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
                    />
                    <p className="text-xs text-[var(--muted)]">
                      {isLoading ? 'Thinking...' : isSpeaking ? 'Speaking...' : 'Online'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Avatar Section */}
            <div className="bg-[var(--background)]/50 px-6 pt-6 pb-4">
              <LiveAvatar 
                videoUrl={currentVideoUrl}
                isGenerating={isGeneratingVideo || isLoading}
                onVideoEnd={handleVideoEnd}
                isSpeaking={isSpeaking}
              />
              
              {/* Response text display */}
              {currentResponse && !currentVideoUrl && !isGeneratingVideo && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <div className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)]">
                    <div className="text-[var(--foreground)] text-sm leading-relaxed react-markdown">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {currentResponse}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Messages */}
            {messages.length > 0 && (
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 max-h-[180px] bg-[var(--background)]/30">
                {messages.slice(-6).map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                        msg.role === 'user'
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

            {/* Input Area */}
            <div className="p-4 border-t border-[var(--border)] bg-[var(--background)]">
              <div className="flex items-center gap-3">
                {/* Voice Input */}
                <VoiceInput
                  onTranscript={handleVoiceTranscript}
                  onListeningChange={setIsListening}
                  disabled={isLoading || isGeneratingVideo || isSpeaking}
                />
                
                {/* Text Input */}
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isListening ? "Listening..." : "Type or speak your question..."}
                    disabled={isLoading || isGeneratingVideo || isListening}
                    className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] text-[var(--foreground)] placeholder:text-[var(--muted)] disabled:opacity-50 transition-all text-sm"
                  />
                </div>
                
                {/* Send Button */}
                <motion.button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isLoading || isGeneratingVideo}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-xl bg-[var(--accent)] text-[var(--background)] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[var(--accent)]/20"
                >
                  {isLoading || isGeneratingVideo ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
              
              {/* Helper text */}
              <p className="text-xs text-[var(--muted)] mt-3 text-center">
                🎤 Click mic to speak • 💬 Type your question • 🎯 Ask about services
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
