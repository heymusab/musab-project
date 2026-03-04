import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { LayoutDashboard, Users, UserCog, LogOut } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');
  const role = (session.user as { role?: string }).role;
  if (role !== 'ADMIN') redirect(role === 'DOCTOR' ? '/dashboard/doctor' : '/dashboard/patient');

  return (
    <div className="min-h-screen bg-mesh text-white">
      {/* Navigation Overlay */}
      <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/dashboard/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform">
                <span className="text-white font-black text-xl">M</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-white hidden md:block">
                Medi<span className="text-cyan-400">Connect</span> Admin
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              {[
                { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
                { name: 'Users', href: '/dashboard/admin/users', icon: UserCog },
                { name: 'Doctors', href: '/dashboard/admin/doctors', icon: Users },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors py-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-white leading-tight">{session.user.name}</span>
              <span className="text-[10px] text-cyan-500 uppercase tracking-widest font-black opacity-80">Administrator</span>
            </div>
            <Link
              href="/api/auth/signout"
              className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        {children}
      </main>
    </div>
  );
}
