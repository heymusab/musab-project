'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'day' | 'night';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isAuto: boolean;
  setIsAuto: (auto: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme: Theme = 'night';
  const isAuto = false;

  useEffect(() => {
    document.body.classList.remove('day', 'night');
    document.body.classList.add(theme);
  }, []);

  const toggleTheme = () => {
    // Theme shifting disabled per user request
  };

  const setIsAuto = () => {};

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
