'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Phone, Mail, Linkedin, MapPin } from 'lucide-react';
import ContactForm from './ContactForm';

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: '+971 56 760 9898', href: 'tel:+971567609898' },
    { icon: Mail, label: 'Email', value: 'me.prakash.ae', href: 'mailto:me.prakash.ae' },
    { icon: Linkedin, label: 'LinkedIn', value: 'Connect with me', href: 'https://linkedin.com' },
    { icon: MapPin, label: 'Location', value: 'Dubai, UAE', href: null },
  ];

  return (
    <footer id="contact" className="bg-[var(--surface)] border-t border-[var(--border)] py-16 lg:py-24 relative overflow-hidden scroll-mt-20">
      {/* Background pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 mb-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full text-[var(--accent)] text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
              Get in Touch
            </motion.span>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--foreground)] mb-5">
              Let's Work Together
            </h2>
            <p className="text-[var(--muted)] mb-8 text-base leading-relaxed max-w-lg">
              Ready to scale your business? Let's discuss how we can help you achieve your goals.
            </p>
            
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="group"
                >
                  {item.href ? (
                    <a 
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-4 p-4 bg-[var(--background)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-all group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center group-hover:bg-[var(--accent)]/20 transition-colors">
                        <item.icon className="w-5 h-5 text-[var(--accent)]" />
                      </div>
                      <div>
                        <p className="text-sm text-[var(--muted)]">{item.label}</p>
                        <p className="text-[var(--foreground)] font-medium group-hover:text-[var(--accent)] transition-colors">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-[var(--background)] border border-[var(--border)] rounded-xl">
                      <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-[var(--accent)]" />
                      </div>
                      <div>
                        <p className="text-sm text-[var(--muted)]">{item.label}</p>
                        <p className="text-[var(--foreground)] font-medium">{item.value}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-[var(--foreground)] mb-6">Send us a message</h3>
            <ContactForm />
          </motion.div>
        </div>

        {/* Footer bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--border)]"
        >
          <p className="text-[var(--muted)] text-sm">
            © 2026 Wings9 Technologies. All rights reserved.
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
