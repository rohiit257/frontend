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
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // All transforms at the top level — no hooks inside render loops
  const yOrb1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const yOrb2 = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  const isDark = colorScheme === 'dark-green';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut' as const },
    },
  };

  return (
    <section id="companies" ref={ref} className="relative py-20 lg:py-28 bg-[var(--background)] overflow-hidden">
      {/* Gradient orbs — static background, no heavy JS animation */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-[0.08] pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-[0.06] pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Subtle parallax ring */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 border border-[var(--border)] rounded-full opacity-20 pointer-events-none"
        style={{ y: yOrb1 }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-0 left-0 w-64 h-64 border border-[var(--border)] rounded-full opacity-20 pointer-events-none"
        style={{ y: yOrb2 }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-full text-[var(--accent)] text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 bg-[var(--accent)] rounded-full" />
            Our Portfolio
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-4 tracking-tight">
            Wings9 Enterprises
          </h2>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto leading-relaxed">
            Five trailblazing enterprises shaping the future of their domains
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {companies.map((company, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link href={company.href} className="block h-full">
                <motion.div
                  className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 h-full overflow-hidden transition-shadow duration-300 hover:shadow-2xl"
                  whileHover={{
                    y: -6,
                    borderColor: 'var(--accent)',
                    transition: { duration: 0.25 },
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

                  {/* Top accent line */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent origin-center"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Logo container */}
                    <motion.div
                      className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-br from-[var(--background)] to-[var(--surface)] border-2 border-[var(--border)] p-4 flex items-center justify-center mb-6 group-hover:border-[var(--accent)] group-hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.08, rotate: 3 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Image
                        src={company.logo}
                        alt={company.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ filter: isDark ? 'brightness(0) invert(1)' : 'brightness(0)' }}
                      />
                    </motion.div>

                    <h3 className="text-xl font-bold text-[var(--foreground)] mb-3 group-hover:text-[var(--accent)] transition-colors duration-300 leading-tight">
                      {company.name}
                    </h3>
                    <p className="text-[var(--muted)] text-sm leading-relaxed mb-6 group-hover:text-[var(--foreground)] transition-colors duration-300">
                      {company.description}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center text-sm font-semibold text-[var(--accent)] px-4 py-2 rounded-lg bg-[var(--accent)]/10 group-hover:bg-[var(--accent)]/20 transition-colors duration-300 gap-2">
                      Explore
                      <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
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
