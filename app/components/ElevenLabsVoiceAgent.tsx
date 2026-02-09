'use client';

import { useState, useCallback, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX, Loader2 } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isFinal: boolean;
}

interface ElevenLabsVoiceAgentProps {
    onClose?: () => void;
    className?: string;
}

export default function ElevenLabsVoiceAgent({ onClose, className }: ElevenLabsVoiceAgentProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.8);

    const conversation = useConversation({
        onConnect: () => {
            console.log('ElevenLabs conversation connected');
            setIsConnecting(false);
            setError(null);
        },
        onDisconnect: () => {
            console.log('ElevenLabs conversation disconnected');
            setIsConnecting(false);
        },
        onMessage: (message) => {
            console.log('Message received:', message);

            // Handle different message types
            if (message.source === 'user' || message.source === 'ai') {
                setMessages(prev => {
                    // Check if this is an update to a tentative message
                    const existingIndex = prev.findIndex(
                        m => m.role === (message.source === 'user' ? 'user' : 'assistant') && !m.isFinal
                    );

                    const newMessage: Message = {
                        role: message.source === 'user' ? 'user' : 'assistant',
                        content: message.message,
                        timestamp: new Date(),
                        isFinal: message.source === 'ai' ? true : !message.message.endsWith('...'),
                    };

                    if (existingIndex >= 0 && message.source === 'user') {
                        // Update existing tentative message
                        const updated = [...prev];
                        updated[existingIndex] = newMessage;
                        return updated;
                    }

                    return [...prev, newMessage];
                });
            }
        },
        onError: (error) => {
            console.error('ElevenLabs conversation error:', error);
            // Handle both string errors and error objects
            const errorMessage = typeof error === 'string'
                ? error
                : (error as any)?.message || 'Connection error occurred';
            setError(errorMessage);
            setIsConnecting(false);
        },
        onModeChange: (mode) => {
            console.log('Mode changed:', mode);
        },
        clientTools: {
            // Client tool to schedule a meeting - called by AI when booking is complete
            scheduleMeeting: async (params: { 
                name: string; 
                email: string; 
                phone: string;
                date: string;
                time: string;
                timezone: string;
                purpose?: string;
            }) => {
                console.log('Scheduling meeting:', params);
                try {
                    const response = await fetch('/api/schedule-meeting', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: params.name,
                            email: params.email,
                            phone: params.phone,
                            date: params.date,
                            time: params.time,
                            timezone: params.timezone || 'IST',
                            purpose: params.purpose || 'Consultation',
                        }),
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        console.log('Meeting scheduled successfully:', result);
                        return `Meeting scheduled successfully for ${params.name} on ${params.date} at ${params.time} ${params.timezone || 'IST'}. A confirmation email will be sent to ${params.email}.`;
                    } else {
                        console.error('Failed to schedule meeting');
                        return `I've noted your booking request. Our team will contact you at ${params.phone} to confirm the meeting.`;
                    }
                } catch (error) {
                    console.error('Error scheduling meeting:', error);
                    return `I've noted your booking request. Our team will contact you shortly to confirm.`;
                }
            },
            // Legacy confirmBooking for backward compatibility
            confirmBooking: (params: { name: string; datetime: string; email: string }) => {
                console.log('Booking confirmed:', params);
                return `Booking confirmed for ${params.name} at ${params.datetime}`;
            },
        },
    });

    const { status, isSpeaking } = conversation;
    const isConnected = status === 'connected';

    // Start the conversation
    const startConversation = useCallback(async () => {
        try {
            setIsConnecting(true);
            setError(null);

            // Request microphone permission
            await navigator.mediaDevices.getUserMedia({ audio: true });

            // Check if we should use signed URL (more secure) or public agent ID
            const agentId = "agent_7501kgn67r6zejpt9vkr1rnhmnv3";

            if (!agentId) {
                throw new Error('Agent ID not configured');
            }

            // Try to get a signed URL for more secure connection
            try {
                console.log('Fetching signed URL...');
                const response = await fetch('/api/elevenlabs/signed-url');
                if (response.ok) {
                    const data = await response.json();
                    console.log('Signed URL received');
                    await conversation.startSession({
                        signedUrl: data.signedUrl,
                    });
                    return;
                } else {
                    const errorText = await response.text();
                    console.error('Failed to get signed URL:', response.status, errorText);
                    throw new Error(`Failed to get signed URL: ${response.status}`);
                }
            } catch (signedUrlError: any) {
                console.warn('Signed URL fetch failed, falling back to public agent ID:', signedUrlError);
                // If signed URL fails, try direct connection with Agent ID (only works if agent is public)
                // But since we have hardcoded keys, signed URL *should* work if the key is correct.
                setError(`Connection failed: ${signedUrlError.message}`);
                setIsConnecting(false);
                return;
            }

            // removing fallback for now to force debugging of the signed URL route which uses the API key
            /*
            await conversation.startSession({
                agentId,
                connectionType: 'webrtc',
            });
            */
        } catch (error: any) {
            console.error('Failed to start conversation:', error);
            setError(error.message || 'Failed to start conversation');
            setIsConnecting(false);
        }
    }, [conversation]);

    // End the conversation
    const endConversation = useCallback(async () => {
        try {
            await conversation.endSession();
            setMessages([]);
        } catch (error) {
            console.error('Failed to end conversation:', error);
        }
    }, [conversation]);

    // Toggle mute
    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev);
        // Note: The SDK handles this via micMuted prop
    }, []);

    // Clean up on unmount
    // Clean up on unmount
    useEffect(() => {
        return () => {
            conversation.endSession();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={`flex flex-col h-full ${className || ''}`}>
            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--background)] border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                    <div
                        className={`w-2 h-2 rounded-full ${isConnected
                            ? isSpeaking
                                ? 'bg-green-500 animate-pulse'
                                : 'bg-green-500'
                            : isConnecting
                                ? 'bg-yellow-500 animate-pulse'
                                : 'bg-gray-400'
                            }`}
                    />
                    <span className="text-xs text-[var(--muted)]">
                        {isConnected
                            ? isSpeaking
                                ? 'Agent speaking...'
                                : 'Listening...'
                            : isConnecting
                                ? 'Connecting...'
                                : 'Disconnected'}
                    </span>
                </div>

                {/* Volume Control */}
                {isConnected && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setVolume(v => v > 0 ? 0 : 0.8)}
                            className="p-1 rounded hover:bg-[var(--surface)] transition-colors"
                        >
                            {volume > 0 ? (
                                <Volume2 className="w-4 h-4 text-[var(--muted)]" />
                            ) : (
                                <VolumeX className="w-4 h-4 text-[var(--muted)]" />
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[var(--background)]/30">
                {messages.length === 0 && !isConnected && !isConnecting && (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-16 h-16 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-4"
                        >
                            <Mic className="w-8 h-8 text-[var(--accent)]" />
                        </motion.div>
                        <h3 className="text-sm font-medium text-[var(--foreground)] mb-2">
                            Voice Assistant
                        </h3>
                        <p className="text-xs text-[var(--muted)] mb-4">
                            Click the microphone button to start a voice conversation with Prakash's AI assistant.
                        </p>
                    </div>
                )}

                {messages.length === 0 && isConnected && (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4"
                        >
                            <Mic className="w-8 h-8 text-green-500" />
                        </motion.div>
                        <p className="text-xs text-[var(--muted)]">
                            Start speaking to begin the conversation...
                        </p>
                    </div>
                )}

                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] px-3 py-2 rounded-xl text-xs ${msg.role === 'user'
                                    ? 'bg-[var(--accent)] text-[var(--background)] rounded-br-md'
                                    : 'bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] rounded-bl-md'
                                    } ${!msg.isFinal ? 'opacity-70' : ''}`}
                            >
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Speaking indicator */}
                {isConnected && isSpeaking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="flex items-center gap-1 px-3 py-2 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                                className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
                                className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
                                className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full"
                            />
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20">
                    <p className="text-xs text-red-500">{error}</p>
                </div>
            )}

            {/* Controls */}
            <div className="p-4 border-t border-[var(--border)] bg-[var(--background)]">
                <div className="flex items-center justify-center gap-4">
                    {/* Mute Button */}
                    {isConnected && (
                        <motion.button
                            onClick={toggleMute}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMuted
                                ? 'bg-red-500/20 text-red-500'
                                : 'bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)]'
                                }`}
                        >
                            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </motion.button>
                    )}

                    {/* Main Call Button */}
                    <motion.button
                        onClick={isConnected ? endConversation : startConversation}
                        disabled={isConnecting}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${isConnected
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : isConnecting
                                ? 'bg-yellow-500 text-white cursor-wait'
                                : 'bg-[var(--accent)] text-[var(--background)] hover:bg-[var(--accent-hover)]'
                            }`}
                    >
                        {isConnecting ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : isConnected ? (
                            <PhoneOff className="w-6 h-6" />
                        ) : (
                            <Phone className="w-6 h-6" />
                        )}
                    </motion.button>
                </div>

                {/* Instructions */}
                <p className="text-center text-xs text-[var(--muted)] mt-3">
                    {isConnected
                        ? 'Tap the red button to end the call'
                        : isConnecting
                            ? 'Connecting to voice assistant...'
                            : 'Tap to start a voice conversation'}
                </p>
            </div>
        </div>
    );
}
