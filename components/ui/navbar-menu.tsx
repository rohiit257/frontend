"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  const isActive = active === item;
  
  return (
    <div 
      onMouseEnter={() => setActive(item)}
      onTouchStart={() => setActive(isActive ? null : item)}
      className="relative"
    >
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-[var(--foreground)] hover:text-[var(--accent)] font-medium transition-colors text-sm sm:text-base whitespace-nowrap"
      >
        {item}
      </motion.p>
      <AnimatePresence>
        {active !== null && isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={transition}
            className="hidden md:block"
          >
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4 z-50">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-[var(--surface)] backdrop-blur-xl rounded-xl overflow-hidden border border-[var(--border)] shadow-2xl"
              >
                <motion.div
                  layout
                  className="w-max max-w-[90vw] sm:max-w-none h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Mobile dropdown - full width */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={transition}
            className="md:hidden absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[calc(100vw-2rem)] max-w-sm bg-[var(--surface)] backdrop-blur-xl rounded-xl border border-[var(--border)] shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-3 sm:p-4 max-h-[70vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl shadow-lg overflow-x-auto scroll-smooth"
      style={{
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
      }}
    >
      <style jsx>{`
        nav::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
      <div className="flex items-center justify-center space-x-3 sm:space-x-4 lg:space-x-6 px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2 lg:py-3 min-w-max">
        {children}
      </div>
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <a href={href} className="flex space-x-2">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-[var(--foreground)]">
          {title}
        </h4>
        <p className="text-[var(--muted)] text-sm max-w-[10rem]">
          {description}
        </p>
      </div>
    </a>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <a
      {...rest}
      className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors font-medium py-2 px-2 rounded-lg hover:bg-[var(--surface)]/50 touch-manipulation block"
    >
      {children}
    </a>
  );
};
