import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendAppointmentBooked } from '@/lib/email';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role?: string }).role;
  const id = session.user.id;

  try {
    if (role === 'PATIENT') {
      const list = await prisma.appointment.findMany({
        where: { patientId: id },
        include: { doctor: { include: { user: true } } },
        orderBy: [{ date: 'asc' }, { time: 'asc' }],
      });
      return NextResponse.json(list);
    }
    if (role === 'DOCTOR') {
      const profile = await prisma.doctorProfile.findUnique({ where: { userId: id } });
      if (!profile) return NextResponse.json([]);
      const list = await prisma.appointment.findMany({
        where: { doctorId: profile.id },
        include: { patient: true, doctor: true },
        orderBy: [{ date: 'asc' }, { time: 'asc' }],
      });
      return NextResponse.json(list);
    }
    if (role === 'ADMIN') {
      const list = await prisma.appointment.findMany({
        include: {
          doctor: { include: { user: true } },
          patient: true,
        },
        orderBy: [{ date: 'desc' }, { time: 'asc' }],
      });
      return NextResponse.json(list);
    }
    return NextResponse.json([]);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const role = (session.user as { role?: string }).role;
  if (role !== 'PATIENT') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await req.json();
    const { doctorId, date, time } = body;
    if (!doctorId || !date || !time) {
      return NextResponse.json({ error: 'doctorId, date, time required' }, { status: 400 });
    }

    const existing = await prisma.appointment.findFirst({
      where: { doctorId, date, time, status: { not: 'CANCELLED' } },
    });
    if (existing) {
      return NextResponse.json({ error: 'Slot no longer available' }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        doctorId,
        patientId: session.user.id,
        date,
        time,
        status: 'PENDING',
      },
      include: { doctor: { include: { user: true } } },
    });

    const doctorEmail = appointment.doctor.user.email;
    await sendAppointmentBooked(
      doctorEmail,
      session.user.name || 'Patient',
      date,
      time
    );
    const patientEmail = session.user.email;
    if (patientEmail) {
      await sendAppointmentBooked(
        patientEmail,
        appointment.doctor.user.name,
        date,
        time
      );
    }

    return NextResponse.json(appointment);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
