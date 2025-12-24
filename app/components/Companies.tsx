'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

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
                  className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 h-full overflow-hidden"
                  whileHover={{ 
                    y: -6,
                    borderColor: 'var(--accent)',
                    transition: { duration: 0.2 }
                  }}
                >
                  {/* Top accent line */}
                  <motion.div 
                    className="absolute top-0 left-0 right-0 h-1 bg-[var(--accent)]"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Large Logo with theme-aware styling */}
                    <motion.div
                      className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl bg-[var(--background)] border border-[var(--border)] p-4 flex items-center justify-center mb-6 group-hover:border-[var(--accent)] transition-colors"
                      whileHover={{ scale: 1.05, rotate: 3 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={company.logo}
                        alt={company.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-all"
                        style={{
                          filter: 'var(--logo-filter)'
                        }}
                      />
                    </motion.div>

                    <h3 className="text-xl font-bold text-[var(--foreground)] mb-3 group-hover:text-[var(--accent)] transition-colors">
                      {company.name}
                    </h3>
                    <p className="text-[var(--muted)] text-sm leading-relaxed mb-5">
                      {company.description}
                    </p>
                    
                    {/* Learn more */}
                    <div className="flex items-center text-sm font-semibold text-[var(--accent)]">
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
