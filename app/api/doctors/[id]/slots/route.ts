import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET available slots for a doctor on a given date
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const date = req.nextUrl.searchParams.get('date'); // YYYY-MM-DD
    if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 });

    const profile = await prisma.doctorProfile.findUnique({
      where: { id },
      include: { availability: true },
    });
    if (!profile) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });

    const [year, month, day] = date.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    const dayOfWeek = d.getDay();
    const daySlots = profile.availability.filter((a) => a.dayOfWeek === dayOfWeek);
    if (daySlots.length === 0) return NextResponse.json({ slots: [] });

    const booked = await prisma.appointment.findMany({
      where: { doctorId: id, date, status: { not: 'CANCELLED' } },
      select: { time: true },
    });
    const bookedSet = new Set(booked.map((b) => b.time));

    const toMins = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const slots: string[] = [];
    for (const av of daySlots) {
      let start = toMins(av.startTime);
      const end = toMins(av.endTime);
      while (start < end) {
        const h = Math.floor(start / 60);
        const m = start % 60;
        const t = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        if (!bookedSet.has(t)) slots.push(t);
        start += 30;
      }
    }
    slots.sort();
    return NextResponse.json({ slots });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to get slots' }, { status: 500 });
  }
}
