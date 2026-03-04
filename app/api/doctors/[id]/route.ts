import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profile = await prisma.doctorProfile.findUnique({
      where: { id },
      include: {
        user: true,
        reviews: { include: { patient: true } },
        availability: true,
      },
    });
    if (!profile) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    const avg =
      profile.reviews.length > 0
        ? profile.reviews.reduce((a, r) => a + r.rating, 0) / profile.reviews.length
        : 0;
    return NextResponse.json({
      ...profile,
      rating: Math.round(avg * 10) / 10,
      reviewCount: profile.reviews.length,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
  }
}
