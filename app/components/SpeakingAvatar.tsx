'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SpeakingAvatarProps {
  isSpeaking: boolean;
  avatarImage?: string;
  videoUrl?: string | null;
  isVideoMode?: boolean;
  onVideoEnd?: () => void;
}

export default function SpeakingAvatar({ 
  isSpeaking, 
  avatarImage = '/profile-image.c30a6137.png',
  videoUrl,
  isVideoMode = false,
  onVideoEnd,
}: SpeakingAvatarProps) {
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video playback
  useEffect(() => {
    if (videoUrl && videoRef.current && isVideoMode) {
      const video = videoRef.current;
      
      video.onended = () => {
        if (onVideoEnd) {
          onVideoEnd();
        }
      };

      video.onerror = () => {
        console.error('Video playback error');
        if (onVideoEnd) {
          onVideoEnd();
        }
      };
    }
  }, [videoUrl, isVideoMode, onVideoEnd]);

  // Sync mute state with video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);
  return (
    <div className="flex justify-center mb-4">
      <div className="relative">
        {/* Outer gold glow ring - pulses when speaking or video playing */}
        <motion.div
          className="absolute -inset-2 rounded-full"
          animate={{
            boxShadow: (isSpeaking || isVideoMode)
              ? [
                  '0 0 20px rgba(234, 179, 8, 0.3)',
                  '0 0 30px rgba(234, 179, 8, 0.5)',
                  '0 0 20px rgba(234, 179, 8, 0.3)',
                ]
              : '0 0 0px rgba(234, 179, 8, 0)',
          }}
          transition={{
            duration: 2,
            repeat: (isSpeaking || isVideoMode) ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-600/20 via-yellow-500/10 to-transparent blur-sm"></div>
        </motion.div>

        {/* Gold ring border */}
        <motion.div
          className="absolute -inset-1 rounded-full border-2 border-yellow-600/60"
          animate={{
            borderColor: (isSpeaking || isVideoMode)
              ? [
                  'rgba(234, 179, 8, 0.6)',
                  'rgba(234, 179, 8, 0.9)',
                  'rgba(234, 179, 8, 0.6)',
                ]
              : 'rgba(234, 179, 8, 0.6)',
          }}
          transition={{
            duration: 2,
            repeat: (isSpeaking || isVideoMode) ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />

        {/* Video or Image container */}
        <motion.div
          className="relative w-20 h-20 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700"
          animate={{
            scale: (isSpeaking || isVideoMode) ? [1, 1.02, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: (isSpeaking || isVideoMode) ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          {isVideoMode && videoUrl ? (
            <>
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover"
                playsInline
                autoPlay
                muted={isMuted}
                loop={false}
              />
              {/* Mute toggle button */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-1 right-1 w-6 h-6 bg-zinc-900/80 rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-3 h-3 text-zinc-300" />
                ) : (
                  <Volume2 className="w-3 h-3 text-zinc-300" />
                )}
              </button>
            </>
          ) : (
            <>
              <Image
                src={avatarImage}
                alt="AI Assistant Avatar"
                fill
                className="object-cover"
                sizes="80px"
              />
              
              {/* Subtle overlay when speaking */}
              {isSpeaking && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 to-transparent"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </>
          )}
        </motion.div>

        {/* Speaking indicator dot */}
        {(isSpeaking || isVideoMode) && (
          <motion.div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-500 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>
    </div>
  );
}

