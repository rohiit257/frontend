'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Globe, Home, BarChart3, Scale, Rocket, Building2, Target, FileText } from 'lucide-react';

const services = [
  {
    title: 'Global Business Advisors',
    description: 'Strategic support for businesses seeking international expansion with tailored market entry strategies.',
    Icon: Globe,
  },
  {
    title: 'Prime Realty',
    description: 'Comprehensive real estate services including property sales, leasing, and investment consulting.',
    Icon: Home,
  },
  {
    title: 'Innovative Marketing',
    description: 'Marketing strategies to enhance brand visibility and drive sustainable growth.',
    Icon: BarChart3,
  },
  {
    title: 'Rental Dispute',
    description: 'Resolving conflicts between landlords and tenants through mediation and legal processes.',
    Icon: Scale,
  },
  {
    title: 'Venture Launch Hub',
    description: 'Supporting entrepreneurs with business planning, funding solutions, and market strategies.',
    Icon: Rocket,
  },
  {
    title: 'Swift Property Solutions',
    description: 'Efficient property transactions with streamlined sales, rentals, and leasing services.',
    Icon: Building2,
  },
  {
    title: 'SEZ Vision Advisory',
    description: 'Expert guidance on Special Economic Zones including Make in India initiatives.',
    Icon: Target,
  },
  {
    title: 'Accounting & Tax',
    description: 'Accounting, VAT registration, filing, and corporate tax compliance services.',
    Icon: FileText,
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <section id="services" ref={ref} className="py-20 lg:py-28 bg-[var(--surface)] relative overflow-hidden">
      {/* Subtle static gradient orbs */}
      <div
        className="absolute top-16 right-8 w-64 h-64 rounded-full blur-3xl opacity-[0.07] pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-16 left-8 w-48 h-48 rounded-full blur-3xl opacity-[0.06] pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div className="absolute top-16 right-8 w-32 h-32 border border-[var(--border)] rounded-full opacity-25 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-16 left-8 w-24 h-24 border border-[var(--border)] rotate-45 opacity-20 pointer-events-none" aria-hidden="true" />

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
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full text-[var(--accent)] text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 bg-[var(--accent)] rounded-full" />
            What We Offer
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-4 tracking-tight">
            Our Services
          </h2>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto leading-relaxed">
            Comprehensive solutions tailored to your business needs
          </p>
        </motion.div>

        {/* Services grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <motion.div
                className="group bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 h-full relative overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                whileHover={{
                  y: -4,
                  borderColor: 'var(--accent)',
                  transition: { duration: 0.2 },
                }}
              >
                {/* Top accent line */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--accent)] origin-center"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.25 }}
                />

                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--accent)]/20 transition-colors duration-200">
                  <service.Icon className="w-5 h-5 text-[var(--accent)]" />
                </div>

                {/* Text */}
                <h3 className="text-base lg:text-lg font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--accent)] transition-colors duration-200 leading-snug">
                  {service.title}
                </h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
