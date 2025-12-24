'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Bot } from 'lucide-react';
import Image from 'next/image';

interface LiveAvatarProps {
  videoUrl?: string | null;
  isGenerating?: boolean;
  onVideoEnd?: () => void;
  isSpeaking?: boolean;
}

export default function LiveAvatar({ 
  videoUrl,
  isGenerating = false,
  onVideoEnd,
  isSpeaking = false,
}: LiveAvatarProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video playback
  useEffect(() => {
    if (videoUrl && videoRef.current) {
      const video = videoRef.current;
      setVideoError(false);
      
      video.onended = () => {
        onVideoEnd?.();
      };

      video.onerror = () => {
        console.error('Video playback error');
        setVideoError(true);
        onVideoEnd?.();
      };

      video.onloadeddata = () => {
        video.play().catch(console.error);
      };
    }
  }, [videoUrl, onVideoEnd]);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const isVideoPlaying = videoUrl && !isGenerating && !videoError;
  const showAnimation = isSpeaking || isVideoPlaying;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Animated outer rings */}
        <AnimatePresence>
          {(showAnimation || isGenerating) && (
            <>
              <motion.div
                className="absolute -inset-6 rounded-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ 
                  border: `2px solid ${isGenerating ? 'var(--muted)' : 'var(--accent)'}`,
                  borderRadius: '50%',
                }}
              />
              <motion.div
                className="absolute -inset-4 rounded-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                style={{ 
                  border: `2px solid ${isGenerating ? 'var(--muted)' : 'var(--accent)'}`,
                  borderRadius: '50%',
                }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Static ring when idle */}
        {!showAnimation && !isGenerating && (
          <div 
            className="absolute -inset-3 rounded-full border-2 border-[var(--border)] opacity-50"
          />
        )}

        {/* Main avatar container */}
        <motion.div
          className="relative w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden bg-[var(--surface)] border-4 shadow-xl"
          animate={{
            scale: showAnimation ? [1, 1.02, 1] : 1,
            borderColor: isGenerating 
              ? 'var(--muted)' 
              : showAnimation 
                ? 'var(--accent)' 
                : 'var(--border)',
          }}
          transition={{
            duration: showAnimation ? 1.5 : 0.3,
            repeat: showAnimation ? Infinity : 0,
          }}
        >
          {/* Video player - shows when video is ready */}
          {isVideoPlaying && (
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover"
              playsInline
              autoPlay
              muted={isMuted}
              loop={false}
            />
          )}

          {/* Avatar placeholder - shows when no video or generating */}
          {!isVideoPlaying && (
            <div className="w-full h-full flex items-center justify-center bg-[var(--surface)] overflow-hidden">
              {/* Agent Image */}
              <motion.div
                className="relative w-full h-full"
                animate={isGenerating ? { 
                  scale: [1, 1.02, 1],
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Image
                  src="/agent.png"
                  alt="AI Agent"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 176px, 208px"
                />
                
                {/* Overlay when generating */}
                {isGenerating && (
                  <motion.div
                    className="absolute inset-0 bg-[var(--background)]/20"
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                {/* Thinking indicator */}
                {isGenerating && (
                  <motion.div 
                    className="absolute -top-2 -right-2 flex gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-[var(--accent)]"
                        animate={{ 
                          y: [0, -8, 0],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{ 
                          duration: 0.6, 
                          repeat: Infinity, 
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>
          )}

          {/* Thinking overlay text */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-[var(--background)]/90 backdrop-blur-sm py-3 px-4"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
              >
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.span 
                    className="text-[var(--foreground)] text-sm font-medium"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Thinking...
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mute toggle - only when video playing */}
          {isVideoPlaying && (
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
        </motion.div>

        {/* Speaking indicator dots */}
        <AnimatePresence>
          {showAnimation && !isGenerating && (
            <motion.div
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[var(--surface)] px-3 py-1.5 rounded-full border border-[var(--border)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-[var(--accent)] rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI badge */}
        <motion.div
          className="absolute -top-1 -right-1 w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center shadow-lg border-2 border-[var(--background)]"
          animate={showAnimation || isGenerating ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 2, repeat: (showAnimation || isGenerating) ? Infinity : 0 }}
        >
          <Bot className="w-5 h-5 text-[var(--background)]" />
        </motion.div>
      </div>

      {/* Name label */}
      <motion.div 
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="text-[var(--foreground)] font-semibold">AI Assistant</h4>
        <p className="text-[var(--muted)] text-xs mt-0.5">Powered by Wings9</p>
      </motion.div>
    </div>
  );
}
