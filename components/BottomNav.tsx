'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Stethoscope, User, MessageSquare, Beaker, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function BottomNav() {
  const pathname = usePathname();

  if (!pathname.startsWith('/dashboard/patient')) return null;

  const navItems = [
    { name: 'Home', href: '/dashboard/patient', icon: Home },
    { name: 'Labs', href: '/dashboard/patient/labs', icon: Beaker },
    { name: 'Messages', href: '/dashboard/patient/messages', icon: MessageSquare },
    { name: 'AI Assistant', href: '/dashboard/patient/symptoms', icon: MessageCircle },
    { name: 'Appts', href: '/dashboard/patient/appointments', icon: Calendar },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4">
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-around p-2 shadow-2xl"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href} className="relative flex flex-col items-center p-2 transition-colors">
              <Icon
                className={`w-6 h-6 transition-all duration-300 ${isActive ? 'text-blue-500 scale-110' : 'text-gray-400 opacity-70 hover:opacity-100'}`}
              />
              <span className={`text-[10px] font-bold mt-1 tracking-tight ${isActive ? 'text-white' : 'text-gray-500'}`}>
                {item.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-1 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,1)]"
                />
              )}
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
