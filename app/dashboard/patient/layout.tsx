import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import { Stethoscope } from 'lucide-react';

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');
  const role = (session.user as { role?: string }).role;
  if (role !== 'PATIENT') redirect(role === 'DOCTOR' ? '/dashboard/doctor' : role === 'ADMIN' ? '/dashboard/admin' : '/');

  return (
    <div className="min-h-screen selection:bg-blue-500/30">
      <nav className="glass-card sticky top-4 mx-4 z-50 rounded-3xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/dashboard/patient" className="flex items-center gap-2.5 group transition-all hover:scale-[1.02]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:rotate-6 transition-transform">
                <Stethoscope className="text-white w-5.5 h-5.5" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent tracking-tighter">
                MediConnect
              </span>
            </Link>
            <div className="hidden lg:flex items-center gap-10 xl:gap-14 overflow-x-auto no-scrollbar ml-8">
              <Link href="/dashboard/patient" className="shrink-0 text-[10px] font-black text-slate-400 hover:text-blue-400 transition-colors uppercase tracking-widest">
                Find Doctors
              </Link>
              <Link href="/dashboard/patient/appointments" className="shrink-0 text-[10px] font-black text-slate-400 hover:text-blue-400 transition-colors uppercase tracking-widest">
                Appointments
              </Link>
              <Link href="/dashboard/patient/labs" className="shrink-0 text-[10px] font-black text-slate-400 hover:text-blue-400 transition-colors uppercase tracking-widest">
                Labs
              </Link>
              <Link href="/dashboard/patient/messages" className="shrink-0 text-[10px] font-black text-slate-400 hover:text-blue-400 transition-colors uppercase tracking-widest">
                Messages
              </Link>
              <Link href="/dashboard/patient/symptoms" className="shrink-0 text-[10px] font-black text-slate-400 hover:text-blue-400 transition-colors uppercase tracking-widest">
                AI Health
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Link 
              href="/dashboard/doctor" 
              className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-500 hover:text-white transition-all hidden lg:block"
            >
              Switch to Doctor View
            </Link>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Patient</span>
              <span className="text-[10px] text-slate-500 font-medium">{session.user.email}</span>
            </div>
            <SignOutButton
              className="px-5 py-2 text-xs font-black uppercase tracking-widest text-white bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all border border-white/5 hover:border-red-500/20 active:scale-95"
            >
              Sign Out
            </SignOutButton>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10 relative z-10 pb-32 md:pb-8">{children}</main>
    </div>
  );
}
