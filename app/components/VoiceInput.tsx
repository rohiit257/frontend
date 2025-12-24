'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onListeningChange?: (isListening: boolean) => void;
  disabled?: boolean;
  className?: string;
  pushToTalk?: boolean; // Enable push-to-talk mode
}

export default function VoiceInput({ 
  onTranscript, 
  onListeningChange,
  disabled = false,
  className = '',
  pushToTalk = true // Default to push-to-talk
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const isHoldingRef = useRef(false);
  const transcriptRef = useRef({ final: '', interim: '' });

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalText = '';
        let interimText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalText += transcript + ' ';
          } else {
            interimText += transcript;
          }
        }

        setInterimTranscript(interimText);
        transcriptRef.current.interim = interimText;
        
        if (finalText) {
          const updated = (transcriptRef.current.final + finalText).trim();
          setFinalTranscript(updated);
          transcriptRef.current.final = updated;
        }
      };

      recognitionRef.current.onend = () => {
        // Don't auto-stop in push-to-talk if still holding
        if (pushToTalk && isHoldingRef.current) {
          // Restart recognition if still holding
          try {
            recognitionRef.current.start();
          } catch (error) {
            // Already started or error, continue
          }
          return;
        }
        
        setIsListening(false);
        onListeningChange?.(false);
        
        // Get latest transcript values
        const currentFinal = transcriptRef.current.final;
        const currentInterim = transcriptRef.current.interim;
        const combined = (currentFinal + ' ' + currentInterim).trim();
        
        // Send transcript
        if (combined) {
          onTranscript(combined);
        }
        
        // Clear transcripts
        setFinalTranscript('');
        setInterimTranscript('');
        transcriptRef.current = { final: '', interim: '' };
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        onListeningChange?.(false);
        setInterimTranscript('');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript, onListeningChange]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || disabled || isListening) return;
    
    try {
      setFinalTranscript('');
      setInterimTranscript('');
      transcriptRef.current = { final: '', interim: '' };
      recognitionRef.current.start();
      setIsListening(true);
      onListeningChange?.(true);
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }
  }, [isListening, disabled, onListeningChange]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
      // State will be updated in onend handler
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
      setIsListening(false);
      onListeningChange?.(false);
    }
  }, [onListeningChange]);

  const toggleListening = useCallback(() => {
    if (!pushToTalk) {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    }
  }, [pushToTalk, isListening, startListening, stopListening]);

  // Push-to-talk handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (pushToTalk && !disabled) {
      e.preventDefault();
      isHoldingRef.current = true;
      startListening();
    }
  }, [pushToTalk, disabled, startListening]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (pushToTalk && isHoldingRef.current) {
      e.preventDefault();
      isHoldingRef.current = false;
      stopListening();
    }
  }, [pushToTalk, stopListening]);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    if (pushToTalk && isHoldingRef.current) {
      e.preventDefault();
      isHoldingRef.current = false;
      stopListening();
    }
  }, [pushToTalk, stopListening]);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (pushToTalk && !disabled) {
      e.preventDefault();
      isHoldingRef.current = true;
      startListening();
    }
  }, [pushToTalk, disabled, startListening]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (pushToTalk && isHoldingRef.current) {
      e.preventDefault();
      isHoldingRef.current = false;
      stopListening();
    }
  }, [pushToTalk, stopListening]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={!pushToTalk ? toggleListening : undefined}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        disabled={disabled}
        className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
          isListening 
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' 
            : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)]'
        } disabled:opacity-50 disabled:cursor-not-allowed ${pushToTalk ? 'cursor-pointer select-none' : ''}`}
        whileHover={!isListening ? { scale: 1.05 } : {}}
        whileTap={pushToTalk ? { scale: 0.9 } : { scale: 0.95 }}
        title={pushToTalk 
          ? (isListening ? 'Release to send' : 'Hold to talk') 
          : (isListening ? 'Stop listening' : 'Start voice input')}
      >
        {/* Pulse animation when listening */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-red-500"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.3, opacity: 0 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </AnimatePresence>
        
        {isListening ? (
          <MicOff className="w-5 h-5 relative z-10" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </motion.button>

      {/* Interim transcript display */}
      <AnimatePresence>
        {interimTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 left-0 right-0 min-w-[200px] p-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg z-20"
          >
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)]" />
              <p className="text-sm text-[var(--foreground)] italic">
                {interimTranscript}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Push-to-talk hint */}
      {pushToTalk && !isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-[var(--muted)]"
        >
          Hold to talk
        </motion.div>
      )}
    </div>
  );
}


