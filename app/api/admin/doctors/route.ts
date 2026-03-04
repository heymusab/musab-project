import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const role = (session.user as { role?: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const doctors = await prisma.doctorProfile.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(doctors);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const role = (session.user as { role?: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { doctorId, approved } = body;
  if (!doctorId || typeof approved !== 'boolean') {
    return NextResponse.json({ error: 'doctorId and approved required' }, { status: 400 });
  }

  const updated = await prisma.doctorProfile.update({
    where: { id: doctorId },
    data: { approved },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const role = (session.user as { role?: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get('id');

  if (!doctorId) return NextResponse.json({ error: 'doctorId required' }, { status: 400 });

  const profile = await prisma.doctorProfile.findUnique({
    where: { id: doctorId },
    select: { userId: true },
  });

  if (!profile) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });

  // Deleting the user will cascade to the doctor profile based on our schema
  await prisma.user.delete({
    where: { id: profile.userId },
  });

  return NextResponse.json({ success: true });
}
