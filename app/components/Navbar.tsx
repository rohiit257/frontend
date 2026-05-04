'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle, useTheme } from './ThemeProvider';

const navLinks = [
  { label: 'Home',         href: '#home',         icon: '⌂' },
  { label: 'Companies',   href: '#companies',    icon: '🏢' },
  { label: 'Services',     href: '#services',     icon: '⚡' },
  { label: 'Testimonials', href: '#testimonials', icon: '★' },
  { label: 'Contact',      href: '#contact',      icon: '✉' },
];

function smoothScroll(e: React.MouseEvent<HTMLAnchorElement>, href: string, callback?: () => void) {
  if (!href.startsWith('#')) return;
  e.preventDefault();
  const id = href.replace('#', '');
  const el = document.getElementById(id);
  if (el) {
    const navbarHeight = 72;
    const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }
  callback?.();
}

export default function Navbar() {
  const [scrolled, setScrolled]    = useState(false);
  const [menuOpen, setMenuOpen]    = useState(false);
  const [activeSection, setActive] = useState('home');
  const { colorScheme }            = useTheme();
  const isDark                     = colorScheme === 'dark-green';
  const menuRef                    = useRef<HTMLDivElement>(null);
  const closeMenu                  = useCallback(() => setMenuOpen(false), []);

  /* ── scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── active section via IntersectionObserver ── */
  useEffect(() => {
    const ids = navLinks.map(l => l.href.replace('#', ''));
    const targets = ids
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (targets.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        // Pick the section that is intersecting and closest to top
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    targets.forEach(t => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  /* ── close menu when clicking outside ── */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen, closeMenu]);

  /* ── lock body scroll while mobile menu open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* ── close menu on resize above md breakpoint ── */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) closeMenu(); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [closeMenu]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--border)] shadow-[0_2px_20px_rgba(0,0,0,0.08)]'
          : 'bg-transparent'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] lg:h-[76px]">

          {/* ── Logo ── */}
          <motion.a
            href="#home"
            onClick={(e) => { smoothScroll(e, '#home'); closeMenu(); }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex-shrink-0 flex items-center gap-3 group"
            aria-label="Wings9 — back to top"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16">
              <Image
                src="/logo-light.e2baf542.png"
                alt="Wings9 Logo"
                fill
                className="object-contain transition-all duration-300"
                style={{ filter: isDark ? 'brightness(0) invert(1)' : 'brightness(0)' }}
                priority
                sizes="(max-width: 640px) 48px, (max-width: 1024px) 56px, 64px"
              />
            </div>
          </motion.a>

          {/* ── Desktop Nav ── */}
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center"
            aria-label="Main navigation"
          >
            <div className="flex items-center gap-1 bg-[var(--surface)]/60 backdrop-blur-sm border border-[var(--border)] rounded-full px-2 py-1.5">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => smoothScroll(e, link.href)}
                    className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'text-[var(--background)] bg-[var(--accent)]'
                        : 'text-[var(--foreground)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </motion.nav>

          {/* ── Right side: ThemeToggle + CTA + Hamburger ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <ThemeToggle />

            {/* Desktop CTA */}
            <motion.a
              href="#contact"
              onClick={(e) => smoothScroll(e, '#contact')}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[var(--accent)] text-[var(--background)] rounded-full hover:bg-[var(--accent-hover)] transition-all duration-200 shadow-md shadow-[var(--accent)]/20"
            >
              Book Consultation
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>

            {/* Hamburger — mobile only */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="block w-5 h-0.5 bg-[var(--foreground)] rounded-full origin-center"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.18 }}
                className="block w-5 h-0.5 bg-[var(--foreground)] rounded-full"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="block w-5 h-0.5 bg-[var(--foreground)] rounded-full origin-center"
              />
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-[68px] bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              id="mobile-nav"
              ref={menuRef}
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-[68px] right-0 bottom-0 w-[min(320px,90vw)] bg-[var(--background)] border-l border-[var(--border)] z-50 md:hidden flex flex-col shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {navLinks.map((link, i) => {
                  const isActive = activeSection === link.href.replace('#', '');
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => smoothScroll(e, link.href, closeMenu)}
                      initial={{ opacity: 0, x: 32 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.25, ease: 'easeOut' }}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        isActive
                          ? 'bg-[var(--accent)] text-[var(--background)]'
                          : 'text-[var(--foreground)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className="flex-1">{link.label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="mobile-active-dot"
                          className="w-1.5 h-1.5 rounded-full bg-[var(--background)]/70"
                        />
                      )}
                    </motion.a>
                  );
                })}
              </nav>

              {/* CTA inside drawer */}
              <div className="px-4 py-5 border-t border-[var(--border)] space-y-3">
                <motion.a
                  href="#contact"
                  onClick={(e) => smoothScroll(e, '#contact', closeMenu)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3.5 text-sm font-semibold bg-[var(--accent)] text-[var(--background)] rounded-xl hover:bg-[var(--accent-hover)] transition-all duration-200 shadow-lg shadow-[var(--accent)]/20"
                >
                  Book a Free Consultation
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.a>
                <p className="text-center text-xs text-[var(--muted)]">Dubai, UAE · +971 56 760 9898</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
