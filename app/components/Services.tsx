'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
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
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
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
    <section id="services" ref={ref} className="py-20 lg:py-28 bg-[var(--surface)] relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23 11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23134074' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />
      </div>

      {/* Floating gradient orbs */}
      <motion.div
        className="absolute top-20 right-10 w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          y: y1,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-48 h-48 rounded-full blur-3xl opacity-15"
        style={{
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          y: y2,
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Parallax decorations */}
      <motion.div 
        className="absolute top-20 right-10 w-32 h-32 border border-[var(--border)] rounded-full opacity-30"
        style={{ y: y1 }}
      />
      <motion.div 
        className="absolute bottom-20 left-10 w-24 h-24 border border-[var(--border)] opacity-30"
        style={{ y: y2, rotate: 45 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full text-[var(--accent)] text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 bg-[var(--accent)] rounded-full" />
            What We Offer
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-4">
            Our Services
          </h2>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
            Comprehensive solutions tailored to your business needs
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
            >
              <motion.div
                className="group bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 h-full relative overflow-hidden"
                whileHover={{ 
                  y: -4,
                  borderColor: 'var(--accent)',
                  transition: { duration: 0.2 }
                }}
              >
                {/* Top accent line */}
                <motion.div 
                  className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                <motion.div 
                  className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--accent)]/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <service.Icon className="w-5 h-5 text-[var(--accent)]" />
                </motion.div>
                <h3 className="text-base lg:text-lg font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--accent)] transition-colors">
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
