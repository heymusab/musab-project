import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import { Stethoscope, ShieldAlert, Clock, CheckCircle } from 'lucide-react';
import { prisma } from '@/lib/db';

export default async function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');
  const role = (session.user as { role?: string }).role;
  if (role !== 'DOCTOR') redirect(role === 'PATIENT' ? '/dashboard/patient' : role === 'ADMIN' ? '/dashboard/admin' : '/');

  const profile = await prisma.doctorProfile.findUnique({
    where: { userId: (session.user as any).id },
    select: { approved: true }
  });

  const isApproved = profile?.approved;

  return (
    <div className="min-h-screen bg-mesh text-gray-100 font-sans">
      <nav className="backdrop-blur-xl bg-black/20 border-b border-white/5 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard/doctor" className="flex items-center gap-2 group transition-all hover:scale-105">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_10px_rgba(56,189,248,0.3)] group-hover:rotate-12 transition-transform">
                <Stethoscope className="text-white w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
                MediConnect <span className="text-cyan-400 text-sm font-medium ml-1">Doctor</span>
              </span>
            </Link>

            {isApproved && (
              <div className="hidden md:flex items-center gap-6">
                <Link href="/dashboard/doctor" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors">
                  Dashboard
                </Link>
                <Link href="/dashboard/doctor/profile" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors">
                  Profile
                </Link>
                <Link href="/dashboard/doctor/availability" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors">
                  Availability
                </Link>
                <Link href="/dashboard/doctor/appointments" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors">
                  Appointments
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:block">{session.user.email}</span>
            <SignOutButton
              className="px-4 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors border border-white/5 hover:border-red-500/30"
            >
              Sign out
            </SignOutButton>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 relative z-10">
        {!isApproved ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-20 h-20 bg-orange-500/10 border border-orange-500/20 rounded-3xl flex items-center justify-center mb-8 animate-pulse">
              <ShieldAlert className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Account Pending Approval</h1>
            <p className="text-gray-400 max-w-md mx-auto leading-relaxed mb-10 italic">
              "Thank you for joining MediConnect. Our administrative team is currently verifying your medical credentials. This usually takes 24-48 hours."
            </p>

            <div className="grid sm:grid-cols-3 gap-6 w-full max-w-2xl">
              {[
                { icon: Clock, title: "Verification", desc: "Checking medical ID", status: "In Progress" },
                { icon: CheckCircle, title: "Database", desc: "Profile setup", status: "Done" },
                { icon: Stethoscope, title: "Access", desc: "Patient bridge", status: "Pending" }
              ].map((step, i) => (
                <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl text-left">
                  <step.icon className={`w-6 h-6 mb-4 ${step.status === 'Done' ? 'text-green-500' : step.status === 'In Progress' ? 'text-cyan-400' : 'text-gray-600'}`} />
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{step.desc}</p>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${step.status === 'Done' ? 'bg-green-500/10 text-green-500' :
                      step.status === 'In Progress' ? 'bg-cyan-500/10 text-cyan-400' :
                        'bg-white/5 text-gray-600'
                    }`}>
                    {step.status}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-12 text-gray-500 text-sm">
              Need help? Contact support at <span className="text-white">support@mediconnect.com</span>
            </p>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
