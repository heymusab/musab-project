'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ur';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedLang) setLang(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const dir = lang === 'ur' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
