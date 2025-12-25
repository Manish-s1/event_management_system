import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || undefined;
    const isPaidParam = searchParams.get('isPaid'); // 'true' | 'false' | null
    const sort = searchParams.get('sort') || 'upcoming'; // 'newest' | 'oldest' | 'upcoming'
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const includePast = searchParams.get('includePast') === 'true'; // Option to include past events

    // Build WHERE conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // Only filter by future date if not explicitly including past events
    if (!includePast) {
      where.date = { gte: new Date() };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isPaidParam === 'true') {
      where.isPaid = true;
    } else if (isPaidParam === 'false') {
      where.isPaid = false;
    }

    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price.gte = Number(priceMin);
      if (priceMax) where.price.lte = Number(priceMax);
    }

    const orderBy: Record<string, 'asc' | 'desc'> =
      sort === 'newest'
        ? { createdAt: 'desc' }
        : sort === 'oldest'
        ? { createdAt: 'asc' }
        : { date: 'asc' };

    const events = await prisma.event.findMany({
      where,
      include: {
        category: true,
        organizer: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
