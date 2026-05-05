'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';

const companies = [
  {
    name: 'Wings9 Consultancy',
    description: 'Strategic consulting for international business expansion and growth.',
    href: '/business/consultancy',
    logo: '/Consultancies.9aeac236.svg',
    focus: 'Business setup',
    useLogoFilter: true,
  },
  {
    name: 'Wings9 Properties',
    description: 'Premium real estate services and investment consulting.',
    href: '/business/properties',
    logo: '/Properties.2d31dc8a.svg',
    focus: 'Real estate',
    useLogoFilter: true,
  },
  {
    name: 'Wings9 Technology',
    description: 'Leading technology solutions and digital transformation.',
    href: '/business/technology',
    logo: '/Technologies.4c178217.svg',
    focus: 'Technology',
    useLogoFilter: true,
  },
  {
    name: 'Wings9 Vacation Homes',
    description: 'Luxury vacation rentals and property management.',
    href: '/business/vacation-homes',
    logo: '/VacationHomes.afaed650.svg',
    focus: 'Hospitality',
    useLogoFilter: true,
  },
  {
    name: 'Wings9 Fashion',
    description: 'Contemporary fashion and lifestyle brand development.',
    href: '/business/fashion',
    logo: '/Fashions.124cf041.svg',
    focus: 'Lifestyle',
    useLogoFilter: true,
  },
  {
    name: 'Wings9 Global Trading',
    description: 'Food export, sourcing, logistics, and GCC distribution solutions.',
    href: '/business/global-trading',
    logo: '/GlobalTrading.png',
    focus: 'Trade',
    useLogoFilter: false,
  },
  {
    name: 'Yalla Makhana',
    description: 'Flavored makhana snacks and FMCG distribution for UAE consumers.',
    href: '/business/yalla-makhana',
    logo: '/YallaMakhana.png',
    focus: 'FMCG',
    useLogoFilter: false,
  },
];

export default function Companies() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const yOrb1 = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const yOrb2 = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 36 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut' as const },
    },
  };

  return (
    <section id="companies" ref={ref} className="relative overflow-hidden bg-[var(--background)] py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-70"
        style={{ background: 'linear-gradient(180deg, rgba(224,184,83,0.08) 0%, transparent 100%)' }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute -right-16 top-10 h-80 w-80 rounded-full border border-[var(--border)] opacity-20"
        style={{ y: yOrb1 }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute -left-12 bottom-16 h-56 w-56 rounded-full border border-[var(--border)] opacity-20"
        style={{ y: yOrb2 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full blur-3xl opacity-[0.08]"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 72%)' }}
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
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--accent)]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              Companies
            </span>
            <h2 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-[var(--foreground)] lg:text-5xl">
              The Wings9 portfolio
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">
              Seven brands across consulting, property, technology, hospitality, and consumer products.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
        >
          {companies.map((company, index) => (
            <motion.div key={company.name} variants={itemVariants}>
              <Link href={company.href} className="block h-full">
                <motion.article
                  whileHover={{ y: -6, transition: { duration: 0.22 } }}
                  className="group relative flex h-full flex-col rounded-[26px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,20,0.96),rgba(12,12,12,0.96))] p-7 shadow-[0_16px_50px_rgba(0,0,0,0.2)]"
                >
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[26px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: 'radial-gradient(circle at top right, rgba(224,184,83,0.1), transparent 42%)' }}
                  />
                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-[20px] border border-[var(--border)] bg-[var(--surface)]/90 px-4 py-3">
                      <Image
                        src={company.logo}
                        alt={company.name}
                        width={88}
                        height={48}
                        className="max-h-12 w-auto max-w-full object-contain"
                        style={company.useLogoFilter ? { filter: 'var(--logo-filter)' } : undefined}
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="mt-2 inline-flex rounded-full bg-[var(--accent)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--accent)]">
                        {company.focus}
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 flex flex-1 flex-col">
                    <h3 className="text-xl font-semibold tracking-tight text-[var(--foreground)] transition-colors duration-200 group-hover:text-[var(--accent)]">
                      {company.name}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                      {company.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-6 flex items-center justify-between border-t border-[var(--border)]/60 pt-4">
                    <span className="text-sm text-[var(--foreground)]">View company</span>
                    <ArrowUpRight className="h-4 w-4 text-[var(--accent)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </motion.article>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
