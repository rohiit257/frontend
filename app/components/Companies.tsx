'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { useTheme } from './ThemeProvider';

const companies = [
  {
    name: 'Wings9 Consultancy',
    description: 'Strategic consulting for international business expansion and growth.',
    href: '/business/consultancy',
    logo: '/Consultancies.9aeac236.svg',
  },
  {
    name: 'Wings9 Properties',
    description: 'Premium real estate services and investment consulting.',
    href: '/business/properties',
    logo: '/Properties.2d31dc8a.svg',
  },
  {
    name: 'Wings9 Technology',
    description: 'Leading technology solutions and digital transformation.',
    href: '/business/technology',
    logo: '/Technologies.4c178217.svg',
  },
  {
    name: 'Wings9 Vacation Homes',
    description: 'Luxury vacation rentals and property management.',
    href: '/business/vacation-homes',
    logo: '/VacationHomes.afaed650.svg',
  },
  {
    name: 'Wings9 Fashion',
    description: 'Contemporary fashion and lifestyle brand development.',
    href: '/business/fashion',
    logo: '/Fashions.124cf041.svg',
  },
];

export default function Companies() {
  const { colorScheme } = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  
  const isLightBackground = colorScheme === 'blue' || colorScheme === 'green' || colorScheme === 'rose';
  const getDarkColor = () => {
    if (colorScheme === 'blue') return '#0b2545';
    if (colorScheme === 'green') return '#2d3526';
    if (colorScheme === 'rose') return '#4a3a3a';
    return '#0b2545';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section id="companies" ref={ref} className="relative py-20 lg:py-28 bg-[var(--background)] overflow-hidden">
      {/* Triangle design elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 opacity-20"
        style={{ 
          y, 
          rotate,
          color: isLightBackground ? getDarkColor() : 'var(--accent)'
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon
            points="50,10 90,90 10,90"
            fill="currentColor"
            style={{ opacity: 0.2 }}
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-40 right-20 w-24 h-24 opacity-15"
        style={{ 
          y: y2, 
          rotate: useTransform(scrollYProgress, [0, 1], [180, 0]),
          color: isLightBackground ? getDarkColor() : 'var(--accent)'
        }}
        animate={{ rotate: [180, 540] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon
            points="50,10 90,90 10,90"
            fill="currentColor"
            style={{ opacity: 0.15 }}
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-1/4 w-20 h-20 opacity-10"
        style={{ 
          y, 
          rotate: useTransform(scrollYProgress, [0, 1], [0, -180]),
          color: isLightBackground ? getDarkColor() : 'var(--accent)'
        }}
        animate={{ rotate: [0, -360] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon
            points="50,10 90,90 10,90"
            fill="currentColor"
            style={{ opacity: 0.1 }}
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-1/3 w-28 h-28 opacity-12"
        style={{ 
          y: y2,
          color: isLightBackground ? getDarkColor() : 'var(--accent)'
        }}
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon
            points="50,10 90,90 10,90"
            fill="currentColor"
            style={{ opacity: 0.12 }}
          />
        </svg>
      </motion.div>

      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='${
              colorScheme === 'blue' ? '%23134074' : 
              colorScheme === 'green' ? '%23A3B087' : 
              colorScheme === 'rose' ? '%23987070' : 
              '%23A3B087'
            }' stroke-width='1'%3E%3Cpath d='M60 10 L70 30 L90 30 L75 45 L80 65 L60 55 L40 65 L45 45 L30 30 L50 30 Z'/%3E%3C/g%3E%3Cg fill='${
              colorScheme === 'blue' ? '%23134074' : 
              colorScheme === 'green' ? '%23A3B087' : 
              colorScheme === 'rose' ? '%23987070' : 
              '%23A3B087'
            }' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3Ccircle cx='100' cy='100' r='3'/%3E%3Ccircle cx='100' cy='20' r='3'/%3E%3Ccircle cx='20' cy='100' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '150px 150px',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />
      </div>

      {/* Floating gradient orbs */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-15"
        style={{
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          y,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-10"
        style={{
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          y: useTransform(scrollYProgress, [0, 1], [-50, 50]),
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Parallax background elements */}
      <motion.div 
        className="absolute top-0 right-0 w-96 h-96 border border-[var(--border)] rounded-full opacity-20"
        style={{ y }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-64 h-64 border border-[var(--border)] rounded-full opacity-20"
        style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-full text-[var(--accent)] text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 bg-[var(--accent)] rounded-full" />
            Our Portfolio
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-4">
            Wings9 Enterprises
          </h2>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
            Five trailblazing enterprises shaping the future of their domains
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {companies.map((company, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}
            >
              <Link href={company.href}>
                <motion.div
                  className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 h-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  whileHover={{ 
                    y: -8,
                    borderColor: 'var(--accent)',
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Gradient background overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  {/* Corner accent triangles */}
                  <motion.div
                    className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ rotate: -45 }}
                    whileHover={{ rotate: 0 }}
                  >
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[16px] border-t-[var(--accent)] border-l-[16px] border-l-transparent rounded-tr-2xl" />
                  </motion.div>
                  <motion.div
                    className="absolute bottom-0 left-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ rotate: 45 }}
                    whileHover={{ rotate: 0 }}
                  >
                    <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[16px] border-b-[var(--accent)] border-r-[16px] border-r-transparent rounded-bl-2xl" />
                  </motion.div>

                  {/* Top accent line */}
                  <motion.div 
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Decorative dots */}
                  <div className="absolute top-4 left-4 w-2 h-2 bg-[var(--accent)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4 w-2 h-2 bg-[var(--accent)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-[var(--accent)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 right-4 w-2 h-2 bg-[var(--accent)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Large Logo with theme-aware styling and enhanced container */}
                    <motion.div
                      className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-br from-[var(--background)] to-[var(--surface)] border-2 border-[var(--border)] p-4 flex items-center justify-center mb-6 group-hover:border-[var(--accent)] group-hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Glow effect on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-[var(--accent)] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300"
                      />
                      <Image
                        src={company.logo}
                        alt={company.name}
                        width={80}
                        height={80}
                        className="relative z-10 w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-all duration-300"
                        style={{
                          filter: 'var(--logo-filter)'
                        }}
                      />
                    </motion.div>

                    <h3 className="text-xl font-bold text-[var(--foreground)] mb-3 group-hover:text-[var(--accent)] transition-colors duration-300">
                      {company.name}
                    </h3>
                    <p className="text-[var(--muted)] text-sm leading-relaxed mb-5 group-hover:text-[var(--foreground)] transition-colors duration-300">
                      {company.description}
                    </p>
                    
                    {/* Enhanced Learn more button */}
                    <motion.div 
                      className="flex items-center text-sm font-semibold text-[var(--accent)] px-4 py-2 rounded-lg bg-[var(--accent)]/10 group-hover:bg-[var(--accent)]/20 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      Explore
                      <motion.svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </motion.svg>
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
