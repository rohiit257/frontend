'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, MenuItem, HoveredLink } from '@/components/ui/navbar-menu';
import { useTheme } from './ThemeProvider';
import Typewriter from './Typewriter';

export default function HeroSection() {
  const [active, setActive] = useState<string | null>(null);
  const { colorScheme } = useTheme();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  const isLightBackground = colorScheme === 'blue' || colorScheme === 'green' || colorScheme === 'rose';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, x: 60 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="relative h-screen hero-bg flex flex-col overflow-hidden">
      {/* Animated geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className={`absolute top-20 right-20 w-64 h-64 border rounded-full ${
            isLightBackground 
              ? (colorScheme === 'blue' ? 'border-[#0b2545]/20' : colorScheme === 'green' ? 'border-[#2d3526]/20' : 'border-[#4a3a3a]/20')
              : 'border-[var(--border)]'
          }`}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className={`absolute bottom-20 left-20 w-48 h-48 border rotate-45 ${
            isLightBackground 
              ? (colorScheme === 'blue' ? 'border-[#0b2545]/20' : colorScheme === 'green' ? 'border-[#2d3526]/20' : 'border-[#4a3a3a]/20')
              : 'border-[var(--border)]'
          }`}
          animate={{ rotate: [45, 135, 45] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute top-1/3 left-1/4 w-4 h-4 rounded-full opacity-40 ${
            isLightBackground 
              ? (colorScheme === 'blue' ? 'bg-[#0b2545]' : colorScheme === 'green' ? 'bg-[#2d3526]' : 'bg-[#4a3a3a]')
              : 'bg-[var(--accent)]'
          }`}
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className={`absolute bottom-1/3 right-1/3 w-6 h-6 rounded-full opacity-30 ${
            isLightBackground 
              ? (colorScheme === 'blue' ? 'bg-[#0b2545]' : colorScheme === 'green' ? 'bg-[#2d3526]' : 'bg-[#4a3a3a]')
              : 'bg-[var(--accent)]'
          }`}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Fixed Header - Logo + Menu */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-none border-b border-transparent">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-1 sm:py-1.5 lg:py-2">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* PB Logo - Always visible */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="flex-shrink-0"
            >
              <a href="/" className="flex items-center">
                <div className="relative w-10 h-10 sm:w-14 sm:h-14 lg:w-20 lg:h-20">
                  <Image
                    src="/logo-light.e2baf542.png"
                    alt="Wings9 Logo"
                    fill
                    className="object-contain transition-all duration-300"
                    style={{
                      filter: colorScheme === 'dark-green' 
                        ? 'brightness(0) invert(1)' // Light logo for dark background
                        : 'brightness(0)' // Dark logo for light background
                    }}
                    priority
                  />
                </div>
              </a>
            </motion.div>

            {/* Desktop Menu - Centered */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2"
            >
              <Menu setActive={setActive}>
                <MenuItem setActive={setActive} active={active} item="Services">
                  <div className="flex flex-col space-y-3 sm:space-y-4 text-sm">
                    <HoveredLink href="#services">All Services</HoveredLink>
                    <HoveredLink href="#services">Business Consulting</HoveredLink>
                    <HoveredLink href="#services">Real Estate</HoveredLink>
                    <HoveredLink href="#services">Marketing</HoveredLink>
                  </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Companies">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full sm:w-[500px]">
                    {[
                      { name: 'Wings9 Consultancy', icon: '/Consultancies.9aeac236.svg' },
                      { name: 'Wings9 Properties', icon: '/Properties.2d31dc8a.svg' },
                      { name: 'Wings9 Technology', icon: '/Technologies.4c178217.svg' },
                      { name: 'Wings9 Vacation Homes', icon: '/VacationHomes.afaed650.svg' },
                      { name: 'Wings9 Fashion', icon: '/Fashions.124cf041.svg' },
                    ].map((company, i) => (
                      <a 
                        key={i}
                        href="#companies" 
                        className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-[var(--surface)] transition-all group touch-manipulation"
                        onClick={() => setActive(null)}
                      >
                        <Image src={company.icon} alt={company.name} width={32} height={32} className="flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent)]">
                          {company.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Contact">
                  <div className="flex flex-col space-y-3 sm:space-y-4 text-sm">
                    <HoveredLink href="#contact">Get in Touch</HoveredLink>
                    <HoveredLink href="#contact">Book Consultation</HoveredLink>
                  </div>
                </MenuItem>
              </Menu>
            </motion.div>


            {/* Mobile Menu - Scrollable */}
            <div className="md:hidden flex items-center gap-2 sm:gap-3 w-full justify-end">
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide flex-1 justify-end">
                <Menu setActive={setActive}>
                  <MenuItem setActive={setActive} active={active} item="Services">
                    <div className="flex flex-col space-y-3 text-sm">
                      <HoveredLink href="#services" onClick={() => setActive(null)}>All Services</HoveredLink>
                      <HoveredLink href="#services" onClick={() => setActive(null)}>Business Consulting</HoveredLink>
                      <HoveredLink href="#services" onClick={() => setActive(null)}>Real Estate</HoveredLink>
                      <HoveredLink href="#services" onClick={() => setActive(null)}>Marketing</HoveredLink>
                    </div>
                  </MenuItem>
                  <MenuItem setActive={setActive} active={active} item="Companies">
                    <div className="flex flex-col gap-3 w-full">
                      {[
                        { name: 'Wings9 Consultancy', icon: '/Consultancies.9aeac236.svg' },
                        { name: 'Wings9 Properties', icon: '/Properties.2d31dc8a.svg' },
                        { name: 'Wings9 Technology', icon: '/Technologies.4c178217.svg' },
                        { name: 'Wings9 Vacation Homes', icon: '/VacationHomes.afaed650.svg' },
                        { name: 'Wings9 Fashion', icon: '/Fashions.124cf041.svg' },
                      ].map((company, i) => (
                        <a 
                          key={i}
                          href="#companies" 
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--surface)] transition-all group touch-manipulation"
                          onClick={() => setActive(null)}
                        >
                          <Image src={company.icon} alt={company.name} width={32} height={32} className="flex-shrink-0" />
                          <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent)]">
                            {company.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  </MenuItem>
                  <MenuItem setActive={setActive} active={active} item="Contact">
                    <div className="flex flex-col space-y-3 text-sm">
                      <HoveredLink href="#contact" onClick={() => setActive(null)}>Get in Touch</HoveredLink>
                      <HoveredLink href="#contact" onClick={() => setActive(null)}>Book Consultation</HoveredLink>
                    </div>
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Content - Centered */}
      <div className="flex-1 flex items-center justify-center pt-12 sm:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
            {/* Profile Image with Parallax - First on Mobile */}
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              className="relative flex justify-center lg:justify-end z-10 order-1 lg:order-2 w-full"
              style={{ y }}
            >
              <div className="relative w-full max-w-[280px] sm:max-w-sm lg:max-w-md mx-auto lg:mx-0">
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  {/* Decorative frame - hidden on mobile */}
                  <div className="hidden sm:block absolute -inset-4 border-2 border-[var(--accent)]/20 rounded-2xl rotate-3" />
                  <div className="hidden sm:block absolute -inset-4 border-2 border-[var(--accent)]/10 rounded-2xl -rotate-3" />
                  
                  {/* Main image container */}
                  <motion.div
                    className="relative bg-[var(--surface)] rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border border-[var(--border)] overflow-hidden"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden">
                      <Image
                        src="/profile-image.c30a6137.png"
                        alt="Prakash Bhambhani"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 400px"
                      />
                    </div>
                    
                    {/* Name badge */}
                    <motion.div 
                      className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-[var(--background)]/95 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-[var(--border)]"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)]">Prakash Bhambhani</h3>
                      <p className="text-xs text-[var(--muted)]">CEO, Wings9 Enterprises</p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Text Content - Second on Mobile */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left space-y-4 sm:space-y-6 z-10 order-2 lg:order-1 w-full"
              style={{ opacity }}
            >
              <motion.div variants={itemVariants}>
                <motion.span 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-full text-[var(--accent)] text-sm font-medium tracking-wide"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
                  Prakash Bhambhani
                </motion.span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-[var(--foreground)] leading-[1.1] tracking-tight"
              >
                <Typewriter 
                  text="Helping Businesses Scale with Strategic Leadership"
                  speed={25}
                />
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-sm sm:text-base lg:text-xl text-[var(--muted)] leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                20+ years of experience driving business growth, strategy, and execution across multiple industries.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 justify-center lg:justify-start"
              >
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-[var(--accent)] text-[var(--background)] font-semibold text-sm sm:text-base rounded-lg hover:bg-[var(--accent-hover)] transition-all shadow-lg shadow-[var(--accent)]/20 w-full sm:w-auto"
                >
                  Book a Free Consultation
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.a>
                <motion.a
                  href="#services"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-[var(--border)] text-[var(--foreground)] font-semibold text-sm sm:text-base rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all w-full sm:w-auto"
                >
                  View Services
                </motion.a>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4 border-t border-[var(--border)]"
              >
                {[
                  { value: '20+', label: 'Years' },
                  { value: '5', label: 'Companies' },
                  { value: '100+', label: 'Clients' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <motion.div 
                      className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--accent)]"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + i * 0.1 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-xs text-[var(--muted)]">{stat.label}</div>
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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        style={{ opacity }}
      >
        <motion.div
          className="w-5 h-8 border-2 border-[var(--border)] rounded-full flex justify-center"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 bg-[var(--accent)] rounded-full mt-1.5"
            animate={{ opacity: [1, 0.3, 1], y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
