import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const specialization = searchParams.get('specialization');
    const search = searchParams.get('search');
    const minFee = searchParams.get('minFee');
    const maxFee = searchParams.get('maxFee');

    const doctors = await prisma.user.findMany({
      where: {
        role: 'DOCTOR',
        blocked: false,
        doctorProfile: {
          approved: true,
          ...(minFee ? { fee: { gte: Number(minFee) } } : {}),
          ...(maxFee ? { fee: { lte: Number(maxFee) } } : {}),
        },
      },
      include: { doctorProfile: true },
    });

    let filtered = doctors;

    // SQLite case-insensitive filtering in JS
    if (specialization) {
      const spec = specialization.toLowerCase();
      filtered = filtered.filter((d) =>
        d.doctorProfile?.specialization?.toLowerCase().includes(spec)
      );
    }

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(s) ||
          d.doctorProfile?.specialization?.toLowerCase().includes(s)
      );
    }

    const withRatings = await Promise.all(
      filtered.map(async (d) => {
        const reviews = await prisma.review.findMany({
          where: { doctorId: d.doctorProfile!.id },
        });
        const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
        return {
          id: d.doctorProfile!.id,
          userId: d.id,
          name: d.name,
          image: d.image,
          specialization: d.doctorProfile!.specialization,
          experience: d.doctorProfile!.experience,
          fee: d.doctorProfile!.fee,
          bio: d.doctorProfile!.bio,
          rating: Math.round(avg * 10) / 10,
          reviewCount: reviews.length,
        };
      })
    );

    return NextResponse.json(withRatings);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}
