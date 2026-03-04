import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard/admin" className="font-semibold text-gray-800">
              MediConnect Admin
            </Link>
            <Link href="/dashboard/admin" className="text-gray-600 hover:text-blue-600">
              Overview
            </Link>
            <Link href="/dashboard/admin/users" className="text-gray-600 hover:text-blue-600">
              Users
            </Link>
            <Link href="/dashboard/admin/doctors" className="text-gray-600 hover:text-blue-600">
              Doctors
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{session.user.email}</span>
            <Link href="/api/auth/signout" className="text-sm text-red-600 hover:underline">
              Sign out
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}
