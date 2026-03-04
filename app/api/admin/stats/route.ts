import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const role = (session.user as { role?: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const [totalUsers, totalDoctors, totalAppointments, pendingDoctors] = await Promise.all([
    prisma.user.count(),
    prisma.doctorProfile.count({ where: { approved: true } }),
    prisma.appointment.count(),
    prisma.doctorProfile.count({ where: { approved: false } }),
  ]);

  return NextResponse.json({
    totalUsers,
    totalDoctors,
    totalAppointments,
    pendingDoctors,
  });
}
