'use client';

import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/components/LanguageContext';
import { ThemeProvider } from '@/components/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
