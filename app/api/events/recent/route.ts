import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: new Date(), // Only future events
        },
      },
      orderBy: {
        date: 'asc',
      },
      take: 10, // Get 10 recent events
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching recent events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
