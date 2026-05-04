'use client';

import { motion, useInView, Variants, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Check, ArrowRight, Phone, Mail, MapPin, Menu, X } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeProvider';

interface BusinessPageProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  stats: Array<{ label: string; value: string }>;
  icon?: string;
  accentColor?: string;
}

const allCompanies = [
  { name: 'Consultancy', href: '/business/consultancy', logo: '/Consultancies.9aeac236.svg' },
  { name: 'Properties',  href: '/business/properties',  logo: '/Properties.2d31dc8a.svg' },
  { name: 'Technology',  href: '/business/technology',  logo: '/Technologies.4c178217.svg' },
  { name: 'Vacation Homes', href: '/business/vacation-homes', logo: '/VacationHomes.afaed650.svg' },
  { name: 'Fashion',     href: '/business/fashion',     logo: '/Fashions.124cf041.svg' },
];

export default function BusinessPage({
  title,
  subtitle,
  description,
  features,
  stats,
}: BusinessPageProps) {
  const statsRef  = useRef(null);
  const featsRef  = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: '-60px' });
  const isFeatsInView = useInView(featsRef, { once: true, margin: '-60px' });
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const fade: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.55, ease: 'easeOut', delay: i * 0.08 },
    }),
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">

      {/* ── Business Navbar ── */}
      <header className="sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--border)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo → home */}
            <Link href="/" aria-label="Back to Wings9 home">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative w-12 h-12 lg:w-14 lg:h-14 flex-shrink-0"
              >
                <Image
                  src="/logo-light.e2baf542.png"
                  alt="Wings9"
                  fill
                  className="object-contain"
                  style={{ filter: 'var(--logo-filter)' }}
                  priority
                  sizes="56px"
                />
              </motion.div>
            </Link>

            {/* Company links — desktop */}
            <nav className="hidden lg:flex items-center gap-1 bg-[var(--surface)]/70 backdrop-blur-sm border border-[var(--border)] rounded-full px-2 py-1.5" aria-label="Wings9 companies">
              {allCompanies.map(c => (
                <Link
                  key={c.href}
                  href={c.href}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                    pathname === c.href
                      ? 'bg-[var(--accent)] text-[var(--background)]'
                      : 'text-[var(--foreground)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10'
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle Removed */}
              <Link
                href="/#contact"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[var(--accent)] text-[var(--background)] rounded-full hover:bg-[var(--accent-hover)] transition-all duration-300 shadow-[0_4px_15px_var(--border-hover)] hover:shadow-[0_8px_20px_-4px_var(--accent)]"
              >
                Contact Us
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all focus:outline-none z-50"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 top-[64px] bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-[64px] left-0 right-0 bg-[var(--background)] border-b border-[var(--border)] shadow-2xl z-50 lg:hidden"
              >
                <div className="p-4 flex flex-col gap-2 max-h-[calc(100vh-80px)] overflow-y-auto">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium rounded-xl text-[var(--foreground)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                  </Link>
                  <div className="h-px bg-[var(--border)] my-1 mx-2" />
                  <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Our Divisions</div>
                  {allCompanies.map(c => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                        pathname === c.href
                          ? 'bg-[var(--accent)] text-[var(--background)] shadow-md shadow-[var(--accent)]/20'
                          : 'text-[var(--foreground)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]'
                      }`}
                    >
                      {c.name}
                    </Link>
                  ))}
                  <div className="h-px bg-[var(--border)] my-1 mx-2" />
                  <Link
                    href="/#contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-2 px-4 py-3.5 text-sm font-medium rounded-xl text-[var(--background)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-colors text-center shadow-[0_4px_15px_var(--border-hover)]"
                  >
                    Contact Us
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* ── Hero Banner ── */}
      <section className="relative bg-[var(--surface)] border-b border-[var(--border)] overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[40vw] h-full bg-[var(--accent)]/5 rounded-bl-[80px]" />
          <div className="absolute top-8 right-8 w-48 h-48 border border-[var(--border)] rounded-full opacity-30" />
          <div className="absolute bottom-4 left-8 w-32 h-32 border border-[var(--border)] rotate-45 opacity-20" />
          <div className="absolute inset-0 diagonal-pattern opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6 sm:mb-8 flex-wrap">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1 group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Home
            </Link>
            <span>/</span>
            <span className="text-[var(--foreground)] font-medium">{title}</span>
          </div>

          <div className="max-w-3xl">
            {/* Pill */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full text-[var(--accent)] text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
              {subtitle}
            </motion.span>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15 }}
              className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[var(--foreground)] mb-5 leading-[1.1] tracking-tight"
            >
              {title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-base sm:text-lg lg:text-xl text-[var(--muted)] leading-relaxed max-w-2xl"
            >
              {description}
            </motion.p>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-3 mt-8"
            >
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent)] text-[var(--background)] font-semibold text-sm sm:text-base rounded-xl hover:bg-[var(--accent-hover)] transition-all duration-300 shadow-[0_4px_20px_var(--border-hover)] hover:shadow-[0_8px_25px_-5px_var(--accent)]"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#companies"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[var(--border)] text-[var(--foreground)] font-semibold text-sm sm:text-base rounded-xl hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300 hover:shadow-[0_0_15px_var(--border-hover)]"
              >
                All Companies
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-b border-[var(--border)] bg-[var(--background)]">
        <div ref={statsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fade}
                initial="hidden"
                animate={isStatsInView ? 'visible' : 'hidden'}
                className="text-center p-6 sm:p-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl hover:border-[var(--accent)] transition-colors group"
              >
                <motion.div
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--accent)] mb-2"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={isStatsInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 180 }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-[var(--muted)] text-sm sm:text-base font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="flex-1">
        <div ref={featsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          {/* Header */}
          <motion.div
            custom={0}
            variants={fade}
            initial="hidden"
            animate={isFeatsInView ? 'visible' : 'hidden'}
            className="mb-10 sm:mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-full text-[var(--accent)] text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
              What We Offer
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--foreground)] mb-3 tracking-tight">
              Our Services
            </h2>
            <p className="text-[var(--muted)] text-base sm:text-lg max-w-xl leading-relaxed">
              Comprehensive solutions tailored to your business needs
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                custom={i + 1}
                variants={fade}
                initial="hidden"
                animate={isFeatsInView ? 'visible' : 'hidden'}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 sm:p-6 hover:border-[var(--accent)] hover:shadow-lg transition-all duration-200 relative overflow-hidden"
              >
                {/* Top accent line */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--accent)] origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.25 }}
                />
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--accent)]/20 transition-colors">
                    <Check className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                  <p className="text-[var(--foreground)] font-medium text-sm sm:text-base leading-relaxed">
                    {feature}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Other Companies ── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-10"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-2">Explore Wings9 Companies</h2>
            <p className="text-[var(--muted)] text-sm sm:text-base">Five enterprises shaping the future</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {allCompanies.map((company, i) => (
              <motion.div
                key={company.href}
                custom={i}
                variants={fade}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Link href={company.href}>
                  <motion.div
                    whileHover={{ y: -4, borderColor: 'var(--accent)', transition: { duration: 0.2 } }}
                    className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-[var(--background)] border border-[var(--border)] rounded-xl hover:shadow-md transition-all duration-200 group h-full"
                  >
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                      <Image
                        src={company.logo}
                        alt={company.name}
                        fill
                        className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                        style={{ filter: 'var(--logo-filter)' }}
                        sizes="56px"
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors text-center leading-tight">
                      {company.name}
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="border-t border-[var(--border)] bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden p-8 sm:p-12 lg:p-16 text-center"
          >
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
              <div className="absolute inset-0 bg-[var(--accent)]/3 rounded-2xl" />
            </div>

            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full text-[var(--accent)] text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
                Ready to Start?
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--foreground)] mb-4 tracking-tight">
                Let&apos;s Work Together
              </h2>
              <p className="text-[var(--muted)] text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Contact us today to learn how we can help your business grow and scale globally.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--accent)] text-[var(--background)] font-semibold text-sm sm:text-base rounded-xl hover:bg-[var(--accent-hover)] transition-all duration-300 shadow-[0_4px_20px_var(--border-hover)] hover:shadow-[0_8px_25px_-5px_var(--accent)]"
                >
                  Book a Free Consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:+971567609898"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-[var(--border)] text-[var(--foreground)] font-semibold text-sm sm:text-base rounded-xl hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300 hover:shadow-[0_0_15px_var(--border-hover)]"
                >
                  <Phone className="w-4 h-4" />
                  +971 56 760 9898
                </a>
              </div>

              {/* Contact details row */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-8 pt-8 border-t border-[var(--border)]">
                <a href="mailto:me.prakash.ae" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                  <Mail className="w-4 h-4" />
                  me.prakash.ae
                </a>
                <span className="hidden sm:block w-px h-4 bg-[var(--border)]" />
                <span className="flex items-center gap-2 text-sm text-[var(--muted)]">
                  <MapPin className="w-4 h-4" />
                  Dubai, UAE
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8">
              <Image
                src="/logo-light.e2baf542.png"
                alt="Wings9"
                fill
                className="object-contain"
                style={{ filter: 'var(--logo-filter)' }}
                sizes="32px"
              />
            </div>
            <span className="text-sm text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">Wings9 Enterprises</span>
          </Link>
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} Wings9 Enterprises. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
