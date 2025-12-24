'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';

interface RealtimeAgentProps {
  agentId?: string;
  sessionId?: string;
  isSpeaking?: boolean;
  onSpeakingChange?: (speaking: boolean) => void;
}

export default function RealtimeAgent({
  agentId,
  sessionId,
  isSpeaking = false,
  onSpeakingChange,
}: RealtimeAgentProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize WebRTC connection
  const initializeWebRTC = useCallback(async () => {
    if (!sessionId || !agentId) return;

    try {
      // Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
        ],
      });

      peerConnectionRef.current = pc;

      // Handle incoming stream
      pc.ontrack = (event) => {
        if (videoRef.current && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
          setIsConnected(true);
          setError(null);
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
          setIsConnected(true);
        } else if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
          setIsConnected(false);
        }
      };

      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send offer to D-ID agent via WebSocket or API
      // Note: This is a simplified version - actual implementation depends on D-ID's WebRTC API
      const response = await fetch(`/api/did/agent/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          agentId,
          offer: offer.sdp,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to agent');
      }

      const data = await response.json();
      
      // Set remote description
      await pc.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp: data.answer,
      }));

    } catch (err: any) {
      console.error('WebRTC initialization error:', err);
      setError(err.message || 'Failed to connect to agent');
      setIsConnected(false);
    }
  }, [sessionId, agentId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Initialize connection when session is available
  useEffect(() => {
    if (sessionId && agentId && !isConnected) {
      initializeWebRTC();
    }
  }, [sessionId, agentId, isConnected, initializeWebRTC]);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div className="relative w-full h-full">
      {/* Animated rings when speaking */}
      {isSpeaking && (
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
          scale: isSpeaking ? [1, 1.02, 1] : 1,
          borderColor: isConnected 
            ? (isSpeaking ? 'var(--accent)' : 'var(--border)')
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
              muted={isMuted}
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
              {isConnected ? 'Live' : 'Connecting...'}
            </span>
          </div>
        </motion.div>
    </div>
  );
}

