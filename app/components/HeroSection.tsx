'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import Typewriter from './Typewriter';

export default function HeroSection() {
  const { colorScheme } = useTheme();

  const isDark = colorScheme === 'dark-green';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' as const },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.92, x: 48 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.9, ease: 'easeOut' as const },
    },
  };

  const companies = [
    { name: 'Wings9 Consultancy', icon: '/Consultancies.9aeac236.svg' },
    { name: 'Wings9 Properties', icon: '/Properties.2d31dc8a.svg' },
    { name: 'Wings9 Technology', icon: '/Technologies.4c178217.svg' },
    { name: 'Wings9 Vacation Homes', icon: '/VacationHomes.afaed650.svg' },
    { name: 'Wings9 Fashion', icon: '/Fashions.124cf041.svg' },
  ];

  return (
    <section id="home" className="relative min-h-screen hero-bg flex flex-col overflow-hidden">
      {/* Minimal static geometric accents — no heavy animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-16 right-16 w-72 h-72 border border-[var(--border)] rounded-full opacity-30" />
        <div className="absolute bottom-24 left-16 w-52 h-52 border border-[var(--border)] rotate-45 opacity-20" />
        {/* Subtle gradient glow */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-[var(--accent)] opacity-[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vh] bg-[var(--accent)] opacity-[0.04] rounded-full blur-3xl" />
      </div>

      {/* ─── Hero Content ─── */}
      <div className="flex-1 flex items-center justify-center pt-28 sm:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Profile Image — first on mobile */}
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              className="relative flex justify-center lg:justify-end z-10 order-1 lg:order-2 w-full"
            >
              <div className="relative w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[420px] mx-auto lg:mx-0">
                <motion.div
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                >
                  {/* Decorative frames */}
                  <div className="hidden sm:block absolute -inset-5 border-2 border-[var(--accent)]/20 rounded-2xl rotate-3" />
                  <div className="hidden sm:block absolute -inset-5 border-2 border-[var(--accent)]/10 rounded-2xl -rotate-3" />

                  {/* Image container */}
                  <motion.div
                    className="relative bg-[var(--surface)] rounded-2xl p-1.5 border border-[var(--border)] overflow-hidden shadow-2xl"
                    whileHover={{ scale: 1.015 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                      <Image
                        src="/profile-image.c30a6137.png"
                        alt="Prakash Bhambhani — CEO, Wings9 Enterprises"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, 420px"
                      />
                    </div>

                    {/* Name badge */}
                    <motion.div
                      className="absolute bottom-3 left-3 right-3 bg-[var(--background)]/95 backdrop-blur-sm rounded-xl p-3 border border-[var(--border)]"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)] leading-tight">Prakash Bhambhani</h3>
                      <p className="text-xs text-[var(--muted)] mt-0.5">CEO, Wings9 Enterprises</p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Text Content — second on mobile */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left space-y-5 sm:space-y-7 z-10 order-2 lg:order-1 w-full"
            >
              {/* Label pill */}
              <motion.div variants={itemVariants}>
                <motion.span
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-full text-[var(--accent)] text-sm font-medium tracking-wide"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
                  Prakash Bhambhani
                </motion.span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[var(--foreground)] leading-[1.1] tracking-tight"
              >
                <span className="hidden md:block">
                  <Typewriter
                    text="Helping Businesses Scale with Strategic Leadership"
                    speed={22}
                  />
                </span>
                <span className="md:hidden">
                  Helping Businesses Scale with Strategic Leadership
                </span>
              </motion.h1>

              {/* Body text */}
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg lg:text-xl text-[var(--muted)] leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                20+ years of experience driving business growth, strategy, and execution across multiple industries.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1 justify-center lg:justify-start"
              >
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent)] text-[var(--background)] font-semibold text-sm sm:text-base rounded-xl hover:bg-[var(--accent-hover)] transition-all duration-300 shadow-[0_4px_20px_var(--border-hover)] hover:shadow-[0_8px_30px_-5px_var(--accent)] w-full sm:w-auto"
                >
                  Book a Free Consultation
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.a>
                <motion.a
                  href="#services"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[var(--border)] text-[var(--foreground)] font-semibold text-sm sm:text-base rounded-xl hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300 hover:shadow-[0_0_15px_var(--border-hover)] w-full sm:w-auto"
                >
                  View Services
                </motion.a>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center lg:justify-start gap-8 sm:gap-10 pt-4 border-t border-[var(--border)]"
              >
                {[
                  { value: '20+', label: 'Years Experience' },
                  { value: '5', label: 'Companies' },
                  { value: '100+', label: 'Clients Served' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <motion.div
                      className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--accent)]"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + i * 0.1, type: 'spring', stiffness: 200 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-xs sm:text-sm text-[var(--muted)] mt-0.5 font-medium">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        aria-hidden="true"
      >
        <motion.div
          className="w-5 h-8 border-2 border-[var(--border)] rounded-full flex justify-center"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            className="w-1 h-2 bg-[var(--accent)] rounded-full mt-1.5"
            animate={{ opacity: [1, 0.3, 1], y: [0, 5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
