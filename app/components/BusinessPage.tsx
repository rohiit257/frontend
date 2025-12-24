'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { useRef } from 'react';

interface BusinessPageProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  stats: Array<{ label: string; value: string }>;
}

export default function BusinessPage({
  title,
  subtitle,
  description,
  features,
  stats,
}: BusinessPageProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

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
    hidden: { opacity: 0, y: 20 },
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
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)] relative overflow-hidden">
        {/* Pattern background */}
        <div className="absolute inset-0 diagonal-pattern opacity-50" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] mb-8 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full text-[var(--accent)] text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-[var(--accent)] rounded-full" />
              {subtitle}
            </motion.span>
            <h1 className="text-4xl lg:text-6xl font-bold text-[var(--foreground)] mb-6">
              {title}
            </h1>
            <p className="text-lg lg:text-xl text-[var(--muted)] max-w-3xl leading-relaxed">
              {description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b border-[var(--border)] bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center p-6 bg-[var(--surface)] rounded-2xl border border-[var(--border)]"
              >
                <motion.div 
                  className="text-4xl lg:text-5xl font-bold text-[var(--accent)] mb-2"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-[var(--muted)]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--foreground)] mb-4">
            Our Services
          </h2>
          <p className="text-[var(--muted)] text-lg">
            Comprehensive solutions tailored to your needs
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <motion.div
                className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 h-full card-hover"
                whileHover={{ borderColor: 'var(--accent)' }}
              >
                <div className="flex items-start gap-4">
                  <motion.div 
                    className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Check className="w-5 h-5 text-[var(--accent)]" />
                  </motion.div>
                  <p className="text-[var(--foreground)] font-medium leading-relaxed">
                    {feature}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--foreground)] mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-[var(--muted)] text-lg mb-8 max-w-2xl mx-auto">
              Contact us today to learn more about our services and how we can help your business grow.
            </p>
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/#contact"
                className="inline-flex items-center px-8 py-4 bg-[var(--accent)] text-[var(--background)] font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-all shadow-lg shadow-[var(--accent)]/20"
              >
                Get in Touch
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
