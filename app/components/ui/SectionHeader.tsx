'use client';

import { motion } from 'framer-motion';
import { cn } from '@/app/lib/utils';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'mb-14',
        align === 'center' && 'text-center',
        className
      )}
    >
      <span className={cn('eyebrow mb-6', align === 'center' && 'mx-auto')}>
        <span className="eyebrow-dot" aria-hidden="true" />
        {eyebrow}
      </span>
      <h2
        className={cn(
          'heading-section text-3xl sm:text-4xl lg:text-5xl text-[var(--foreground)]',
          align === 'center' && 'mx-auto max-w-3xl'
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-5 text-base leading-relaxed text-[var(--muted)] max-w-xl',
            align === 'center' && 'mx-auto'
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
