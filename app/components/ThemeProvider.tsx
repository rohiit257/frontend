'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette } from 'lucide-react';

type ColorScheme = 'blue' | 'green' | 'dark-green' | 'rose' | 'creative';

interface ThemeContextType {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  cycleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('creative');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedScheme = localStorage.getItem('colorScheme') as ColorScheme;
    if (savedScheme && ['blue', 'green', 'dark-green', 'rose', 'creative'].includes(savedScheme)) {
      setColorSchemeState(savedScheme);
      document.documentElement.className = savedScheme;
    } else {
      // Set default color scheme to creative
      document.documentElement.className = 'creative';
    }
  }, []);

  const setColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    localStorage.setItem('colorScheme', scheme);
    document.documentElement.className = scheme;
  };

  const cycleColorScheme = () => {
    const schemes: ColorScheme[] = ['blue', 'green', 'dark-green', 'rose', 'creative'];
    const currentIndex = schemes.indexOf(colorScheme);
    const nextIndex = (currentIndex + 1) % schemes.length;
    const nextScheme = schemes[nextIndex];
    setColorScheme(nextScheme);
  };

  // Always provide the context, even during SSR/hydration
  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, cycleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const { colorScheme, cycleColorScheme } = useTheme();

  const getColorIndicator = () => {
    switch (colorScheme) {
      case 'blue':
        return 'bg-[#134074]';
      case 'green':
        return 'bg-[#A3B087]';
      case 'dark-green':
        return 'bg-[#1B211A]';
      case 'rose':
        return 'bg-[#987070]';
      case 'creative':
        return 'bg-[#ffffff] border border-gray-200';
      default:
        return 'bg-[#134074]';
    }
  };

  return (
    <motion.button
      onClick={cycleColorScheme}
      className="relative w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center hover:border-[var(--accent)] transition-all overflow-hidden group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Change color scheme"
      title={`Current: ${colorScheme === 'blue' ? 'Blue' : colorScheme === 'green' ? 'Green' : 'Dark Green'}. Click to cycle.`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={colorScheme}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ duration: 0.3 }}
          className="relative w-6 h-6"
        >
          {/* Color indicator circle */}
          <div className={`absolute inset-0 rounded-full ${getColorIndicator()} transition-colors duration-300`} />
          {/* Palette icon overlay */}
          <Palette className="absolute inset-0 w-4 h-4 m-auto text-white/80" />
        </motion.div>
      </AnimatePresence>
      
      {/* Tooltip showing current scheme */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {colorScheme === 'blue' ? 'Blue' : colorScheme === 'green' ? 'Green' : colorScheme === 'dark-green' ? 'Dark Green' : 'Rose'}
      </div>
    </motion.button>
  );
}

