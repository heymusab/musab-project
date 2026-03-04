import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { ChatBot } from '@/components/ChatBot';

export const metadata: Metadata = {
  title: 'MediConnect - Healthcare Made Simple',
  description: 'Connect with verified healthcare professionals and manage your health journey.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <ChatBot />
        </Providers>
      </body>
    </html>
  );
}
