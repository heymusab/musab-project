import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  bio: z.string().optional(),
  specialization: z.string().optional(),
  experience: z.coerce.number().optional(),
  fee: z.coerce.number().optional(),
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

  const { name, email, ...profileData } = parsed.data;

  const updated = await prisma.doctorProfile.update({
    where: { id: profile.id },
    data: {
      ...profileData,
      user: (name || email) ? {
        update: {
          ...(name ? { name } : {}),
          ...(email ? { email } : {}),
        },
      } : undefined,
    },
    include: { user: true, availability: true },
  });
  return NextResponse.json(updated);
}
