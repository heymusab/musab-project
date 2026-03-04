import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateSchema = z.object({
  bio: z.string().optional(),
  specialization: z.string().optional(),
  experience: z.number().optional(),
  fee: z.number().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await prisma.doctorProfile.findUnique({
    where: { userId: session.user.id },
    include: { user: true, availability: true },
  });
  if (!profile) return NextResponse.json({ error: 'Not a doctor' }, { status: 404 });
  return NextResponse.json(profile);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await prisma.doctorProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) return NextResponse.json({ error: 'Not a doctor' }, { status: 404 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 });

  const updated = await prisma.doctorProfile.update({
    where: { id: profile.id },
    data: parsed.data,
    include: { user: true, availability: true },
  });
  return NextResponse.json(updated);
}
