import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { ChatBot } from '@/components/ChatBot';
import { BottomNav } from '@/components/BottomNav';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import ThreeDVisual from '@/components/ThreeDVisual';
import ThreeDTheme from '@/components/ThreeDTheme';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MediConnect - Healthcare Made Simple',
  description: 'Connect with verified healthcare professionals and manage your health journey.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className} selection:bg-blue-600/30`} suppressHydrationWarning>
      <body className="antialiased min-h-screen relative overflow-x-hidden bg-background text-foreground transition-colors duration-700">
        <Providers>
          <ThreeDVisual />
          <ThreeDTheme />
          <div className="bg-mesh" />
          <div className="bg-mesh-overlay" />
          {children}
          <ChatBot />
          <BottomNav />
          <Toaster position="top-right" expand={false} richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
