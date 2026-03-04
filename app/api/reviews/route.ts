import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createSchema = z.object({
  doctorId: z.string(),
  appointmentId: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const role = (session.user as { role?: string }).role;
  if (role !== 'PATIENT') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 });
    }
    const { doctorId, appointmentId, rating, comment } = parsed.data;

    if (appointmentId) {
      const apt = await prisma.appointment.findFirst({
        where: { id: appointmentId, patientId: session.user.id, doctorId, status: 'COMPLETED' },
      });
      if (!apt) return NextResponse.json({ error: 'Appointment not found or not completed' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        doctorId,
        patientId: session.user.id,
        appointmentId: appointmentId || null,
        rating,
        comment: comment || null,
      },
      include: { doctor: true, patient: true },
    });
    return NextResponse.json(review);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
