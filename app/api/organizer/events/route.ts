import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token || token.role !== 'ORGANIZER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const events = await prisma.event.findMany({
      where: {
        organizerId: token.userId as string,
      },
      include: {
        category: true,
        _count: { select: { registrations: true } },
      },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching organizer events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token || token.role !== 'ORGANIZER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      date,
      location,
      categoryId,
      totalSlots,
      isPaid,
      price,
      paymentQR,
      imageUrl,
    } = body;

    if (!title || !description || !date || !location || !categoryId || !totalSlots) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        categoryId,
        totalSlots,
        availableSlots: totalSlots,
        organizerId: token.userId as string,
        isPaid: isPaid ?? false,
        price: isPaid ? price : null,
        paymentQR: isPaid ? paymentQR : null,
        imageUrl: imageUrl || null,
      },
      include: { category: true },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
