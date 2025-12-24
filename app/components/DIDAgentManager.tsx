'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';

interface DIDAgentManagerProps {
  agentId?: string;
  clientKey?: string;
  isSpeaking?: boolean;
  onSpeakingChange?: (speaking: boolean) => void;
  onReady?: (speakFn: (text: string) => void) => void;
}

export default function DIDAgentManager({
  agentId,
  clientKey,
  isSpeaking = false,
  onSpeakingChange,
  onReady,
}: DIDAgentManagerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<string>('disconnected');
  const [videoState, setVideoState] = useState<string>('idle');
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const agentManagerRef = useRef<any>(null);
  const srcObjectRef = useRef<MediaStream | null>(null);

  // Initialize agent manager
  const initializeAgent = useCallback(async () => {
    if (!agentId || !clientKey || agentManagerRef.current || typeof window === 'undefined') return;

    try {
      // Dynamically import D-ID SDK only on client side
      const sdk = await import('@d-id/client-sdk');
      const { ChatMode } = await import('@d-id/client-sdk');

      // Define auth
      const auth = { type: 'key' as const, clientKey };

      // Define callbacks
      const callbacks = {
        onSrcObjectReady(value: MediaStream) {
          if (videoRef.current) {
            videoRef.current.srcObject = value;
            srcObjectRef.current = value;
            setIsConnected(true);
            setError(null);
          }
          return value;
        },
        onVideoStateChange(state: string) {
          setVideoState(state);
          if (state === 'talking' || state === 'speaking') {
            onSpeakingChange?.(true);
          } else if (state === 'idle') {
            onSpeakingChange?.(false);
          }
        },
        onConnectionStateChange(state: string) {
          setConnectionState(state);
          setIsConnected(state === 'connected' || state === 'ready');
          if (state === 'disconnected' || state === 'failed') {
            setIsConnected(false);
          }
        },
        onNewMessage(messages: any[], type: string) {
          console.log('New message from agent:', messages, type);
          // Handle agent's LLM responses
          // The agent will automatically stream the video response
          if (messages && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.content) {
              // Agent is speaking, update speaking state
              onSpeakingChange?.(true);
              // Estimate duration
              const duration = lastMessage.content.length * 50;
              setTimeout(() => {
                onSpeakingChange?.(false);
              }, duration);
            }
          }
        },
        onError(error: Error, errorData: any) {
          console.error('Agent SDK error:', error, errorData);
          setError(error.message || 'Connection error');
          setIsConnected(false);
        },
      };

      // Define stream options
      const streamOptions = {
        compatibilityMode: 'auto' as const,
        streamWarmup: true,
      };

      // Create agent manager
      const agentManager = await sdk.createAgentManager(agentId, {
        auth,
        callbacks,
        streamOptions,
        mode: ChatMode.Functional, // Required by SDK - use Functional mode for full features
      });

      agentManagerRef.current = agentManager;

      // Connect to agent
      await agentManager.connect();
    } catch (err: any) {
      console.error('Agent initialization error:', err);
      setError(err.message || 'Failed to initialize agent');
      setIsConnected(false);
    }
  }, [agentId, clientKey, onSpeakingChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (agentManagerRef.current) {
        try {
          agentManagerRef.current.disconnect();
        } catch (err) {
          console.error('Disconnect error:', err);
        }
      }
      if (srcObjectRef.current) {
        srcObjectRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Initialize when agentId and clientKey are available
  useEffect(() => {
    if (agentId && clientKey && !agentManagerRef.current) {
      initializeAgent();
    }
  }, [agentId, clientKey, initializeAgent]);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current && srcObjectRef.current) {
      srcObjectRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted]);

  // Expose speak and chat methods to parent when ready
  useEffect(() => {
    if (agentManagerRef.current && isConnected && onReady) {
      const speakFn = (text: string) => {
        if (agentManagerRef.current) {
          agentManagerRef.current.speak({
            type: 'text',
            input: text,
          });
        }
      };
      
      const chatFn = (message: string) => {
        if (agentManagerRef.current) {
          agentManagerRef.current.chat(message);
        }
      };
      
      // Expose both methods
      onReady(speakFn);
      (window as any).__agentChat = chatFn;
    }
  }, [isConnected, onReady]);

  const showAnimation = isSpeaking || videoState === 'talking' || videoState === 'speaking';

  return (
    <div className="relative w-full h-full">
      {/* Animated rings when speaking */}
      {showAnimation && (
        <>
          <motion.div
            className="absolute -inset-6 rounded-full border-2 border-[var(--accent)]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute -inset-4 rounded-full border-2 border-[var(--accent)]"
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
        </>
      )}

      {/* Main avatar container */}
      <motion.div
        className="relative w-full h-full rounded-full overflow-hidden bg-[var(--surface)] border-4 shadow-xl"
        animate={{
          scale: showAnimation ? [1, 1.02, 1] : 1,
          borderColor: isConnected 
            ? (showAnimation ? 'var(--accent)' : 'var(--border)')
            : 'var(--muted)',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* WebRTC video stream */}
        {isConnected && (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            autoPlay
            muted={false}
          />
        )}

        {/* Fallback image when not connected */}
        {!isConnected && (
          <div className="w-full h-full flex items-center justify-center bg-[var(--surface)]">
            <Image
              src="/agent.png"
              alt="AI Agent"
              fill
              className="object-cover opacity-50"
              priority
            />
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)]/80">
                <p className="text-xs text-[var(--muted)] text-center px-2">
                  {error}
                </p>
              </div>
            )}
            {!error && connectionState === 'connecting' && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)]/50">
                <motion.div
                  className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            )}
          </div>
        )}

        {/* Mute toggle */}
        {isConnected && (
          <motion.button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-3 right-3 w-10 h-10 bg-[var(--background)]/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-[var(--border)] hover:bg-[var(--surface)] transition-colors z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-[var(--muted)]" />
            ) : (
              <Volume2 className="w-5 h-5 text-[var(--accent)]" />
            )}
          </motion.button>
        )}

        {/* Connection status */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-[var(--background)]/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-[var(--muted)]'
            }`}
          />
          <span className="text-xs text-[var(--muted)]">
            {isConnected ? 'Live' : connectionState === 'connecting' ? 'Connecting...' : 'Disconnected'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

