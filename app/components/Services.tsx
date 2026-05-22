'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Globe,
  Home,
  BarChart3,
  Scale,
  Building2,
  Target,
  FileText,
  Landmark,
} from 'lucide-react';

const services = [
  {
    title: 'Global Business Advisors',
    description: 'Strategic support for market entry, expansion structure, and cross-border growth planning.',
    Icon: Globe,
    tag: 'Advisory',
  },
  {
    title: 'Prime Realty',
    description: 'Property sales, leasing, and investment consulting for residential and commercial opportunities.',
    Icon: Home,
    tag: 'Real estate',
  },
  {
    title: 'Innovative Marketing',
    description: 'Brand positioning and marketing systems built to improve visibility and drive measurable demand.',
    Icon: BarChart3,
    tag: 'Growth',
  },
  {
    title: 'Rental Dispute',
    description: 'Structured support for landlord-tenant conflicts with practical mediation and procedural guidance.',
    Icon: Scale,
    tag: 'Resolution',
  },
  {
    title: 'Swift Property Solutions',
    description: 'Faster property transactions with streamlined sales, rental, and leasing support.',
    Icon: Building2,
    tag: 'Operations',
  },
  {
    title: 'SEZ Vision Advisory',
    description: 'Guidance for SEZ opportunities, Make in India initiatives, and investment positioning.',
    Icon: Target,
    tag: 'Expansion',
  },
  {
    title: 'Accounting & Tax',
    description: 'Accounting operations, VAT registration, filing, and corporate tax compliance management.',
    Icon: FileText,
    tag: 'Compliance',
  },
  {
    title: 'Legal and Embassy Guidance',
    description: 'POA, embassy procedures, and supporting documentation for business and personal requirements.',
    Icon: Landmark,
    tag: 'Documentation',
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <section id="services" ref={ref} className="relative overflow-hidden bg-[var(--surface)] py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-80"
        style={{ background: 'linear-gradient(180deg, rgba(224,184,83,0.06) 0%, transparent 100%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-12 top-24 h-72 w-72 rounded-full blur-3xl opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 72%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-10 bottom-10 h-52 w-52 rounded-full border border-[var(--border)] opacity-20"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--accent)]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              Services
            </span>
            <h2 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-[var(--foreground)] lg:text-5xl">
              What we do
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[var(--muted)]">
              Focused support across setup, growth, property, and compliance.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {services.map((service, index) => (
            <motion.article key={service.title} variants={itemVariants} className="h-full">
              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group flex h-full flex-col rounded-[24px] border border-[var(--border)] bg-[var(--background)]/90 p-6 shadow-[0_14px_45px_rgba(0,0,0,0.18)]"
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                    <service.Icon className="h-5 w-5 text-[var(--accent)]" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                      {(index + 1).toString().padStart(2, '0')}
                    </div>
                    <div className="mt-2 inline-flex rounded-full bg-[var(--accent)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--accent)]">
                      {service.tag}
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col">
                  <h3 className="text-xl font-semibold tracking-tight text-[var(--foreground)] transition-colors duration-200 group-hover:text-[var(--accent)]">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-[var(--border)]/60 pt-4">
                  <div className="text-sm text-[var(--foreground)]">Structured support with a direct, execution-first approach.</div>
                </div>
              </motion.div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
