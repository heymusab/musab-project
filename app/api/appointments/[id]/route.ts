import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendAppointmentConfirmed } from '@/lib/email';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  if (!['CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { doctor: { include: { user: true } }, patient: true },
    });
    if (!appointment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const role = (session.user as { role?: string }).role;
    const profile = role === 'DOCTOR' ? await prisma.doctorProfile.findUnique({ where: { userId: session.user.id } }) : null;

    if (role === 'PATIENT') {
      if (appointment.patientId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      if (status !== 'CANCELLED') return NextResponse.json({ error: 'Patients can only cancel' }, { status: 403 });
    } else if (role === 'DOCTOR') {
      if (profile?.id !== appointment.doctorId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    } else if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: { doctor: { include: { user: true } }, patient: true },
    });

    if (status === 'CONFIRMED' && appointment.patient?.email) {
      await sendAppointmentConfirmed(
        appointment.patient.email,
        appointment.doctor.user.name,
        appointment.date,
        appointment.time
      );
    }

    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
