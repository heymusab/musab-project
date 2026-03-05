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
    <div className="min-h-screen bg-mesh text-gray-100 font-sans">
      <nav className="backdrop-blur-xl bg-black/20 border-b border-white/5 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard/patient" className="flex items-center gap-2 group transition-all hover:scale-105">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_10px_rgba(56,189,248,0.3)] group-hover:rotate-12 transition-transform">
                <Stethoscope className="text-white w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
                MediConnect
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard/patient" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors">
                Find Doctors
              </Link>
              <Link href="/dashboard/patient/appointments" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors">
                My Appointments
              </Link>
              <Link href="/dashboard/patient/symptoms" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors">
                Symptom Checker
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:block">{session.user.email}</span>
            <SignOutButton
              className="px-4 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors border border-white/5 hover:border-red-500/30"
            >
              Sign Out
            </SignOutButton>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-6 relative z-10">{children}</main>
    </div>
  );
}
