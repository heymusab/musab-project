'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'day' | 'night';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isAuto: boolean;
  setIsAuto: (auto: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('night');
  const [isAuto, setIsAuto] = useState(true);

  useEffect(() => {
    if (!isAuto) return;

    const checkTime = () => {
      const hour = new Date().getHours();
      // Day: 6am to 6pm
      const newTheme = hour >= 6 && hour < 18 ? 'day' : 'night';
      setTheme(newTheme);
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [isAuto]);

  useEffect(() => {
    document.body.classList.remove('day', 'night');
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setIsAuto(false);
    setTheme(prev => (prev === 'day' ? 'night' : 'day'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isAuto, setIsAuto }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
