'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';

const companies = [
  {
    name: 'Wings9 Consultancy',
    description: 'Strategic consulting for international business expansion.',
    href: '/business/consultancy',
    logo: '/Consultancies.9aeac236.svg',
    size: 'large',
  },
  {
    name: 'Wings9 Properties',
    description: 'Premium real estate services.',
    href: '/business/properties',
    logo: '/Properties.2d31dc8a.svg',
    size: 'small',
  },
  {
    name: 'Wings9 Technology',
    description: 'Digital transformation solutions.',
    href: '/business/technology',
    logo: '/Technologies.4c178217.svg',
    size: 'small',
  },
  {
    name: 'Wings9 Vacation Homes',
    description: 'Luxury vacation rentals.',
    href: '/business/vacation-homes',
    logo: '/VacationHomes.afaed650.svg',
    size: 'small',
  },
  {
    name: 'Wings9 Fashion',
    description: 'Contemporary fashion brand.',
    href: '/business/fashion',
    logo: '/Fashions.124cf041.svg',
    size: 'small',
  },
];

export default function BentoGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section ref={ref} className="py-16 lg:py-20 bg-[var(--surface)] relative overflow-hidden">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }} />
      </div>
      
      <motion.div 
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ scale }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-[var(--foreground)] mb-2">
            Quick Access
          </h2>
          <p className="text-[var(--muted)] text-sm">
            Navigate to our business divisions
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-5 gap-3"
        >
          {companies.map((company, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
            >
              <Link href={company.href} className="block h-full">
                <motion.div
                  className="group relative bg-[var(--background)] border border-[var(--border)] rounded-lg overflow-hidden h-full p-4 text-center"
                  whileHover={{ 
                    y: -3,
                    borderColor: 'var(--accent)',
                    transition: { duration: 0.2 }
                  }}
                >
                  {/* Logo */}
                  <motion.div
                    className="w-12 h-12 mx-auto mb-3"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xs lg:text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors leading-tight">
                    {company.name.replace('Wings9 ', '')}
                  </h3>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
