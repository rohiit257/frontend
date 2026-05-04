'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Phone, Mail, Linkedin, MapPin } from 'lucide-react';
import Image from 'next/image';
import ContactForm from './ContactForm';


export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });


  const contactInfo = [
    { icon: Phone, label: 'Phone', value: '+971 56 760 9898', href: 'tel:+971567609898' },
    { icon: Mail, label: 'Email', value: 'me.prakash.ae', href: 'mailto:me.prakash.ae' },
    { icon: Linkedin, label: 'LinkedIn', value: 'Connect on LinkedIn', href: 'https://linkedin.com' },
    { icon: MapPin, label: 'Location', value: 'Dubai, UAE', href: null },
  ];

  return (
    <footer id="contact" className="bg-[var(--surface)] border-t border-[var(--border)] py-16 lg:py-24 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" aria-hidden="true" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 mb-14">

          {/* ── Contact Info Column ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            {/* Logo */}
            <div className="mb-8">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <Image
                  src="/logo-light.e2baf542.png"
                  alt="Wings9 Logo"
                  fill
                  className="object-contain"
                  style={{ filter: 'var(--logo-filter)' }}
                  sizes="(max-width: 640px) 80px, 96px"
                />
              </div>
            </div>

            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full text-[var(--accent)] text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
              Get in Touch
            </motion.span>

            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--foreground)] mb-4 tracking-tight leading-tight">
              Let&apos;s Work Together
            </h2>
            <p className="text-[var(--muted)] mb-8 text-base leading-relaxed max-w-lg">
              Ready to scale your business? Let&apos;s discuss how we can help you achieve your goals and unlock new opportunities.
            </p>

            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.25 + index * 0.08 }}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-4 p-4 bg-[var(--background)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-colors group"
                    >
                      <div className="w-11 h-11 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center group-hover:bg-[var(--accent)]/20 transition-colors flex-shrink-0">
                        <item.icon className="w-5 h-5 text-[var(--accent)]" />
                      </div>
                      <div>
                        <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wide">{item.label}</p>
                        <p className="text-[var(--foreground)] font-semibold text-sm group-hover:text-[var(--accent)] transition-colors mt-0.5">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-[var(--background)] border border-[var(--border)] rounded-xl">
                      <div className="w-11 h-11 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-[var(--accent)]" />
                      </div>
                      <div>
                        <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wide">{item.label}</p>
                        <p className="text-[var(--foreground)] font-semibold text-sm mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Contact Form Column ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-6 sm:p-8"
          >
            <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">Send us a Message</h3>
            <p className="text-[var(--muted)] text-sm mb-6">We typically respond within 24 hours.</p>
            <ContactForm />
          </motion.div>
        </div>

        {/* ── Footer Bottom ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--border)]"
        >
          <p className="text-[var(--muted)] text-sm">
            © {new Date().getFullYear()} Wings9 Enterprises. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[var(--muted)] hover:text-[var(--accent)] text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-[var(--muted)] hover:text-[var(--accent)] text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
