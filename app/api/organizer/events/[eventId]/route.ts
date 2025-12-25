import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const resolvedParams = await params;
    const token = await getToken({ req: request });

    if (!token || token.role !== 'ORGANIZER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: resolvedParams.eventId },
      include: {
        category: true,
        registrations: {
          include: { user: { select: { id: true, username: true, email: true } } },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.organizerId !== token.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const resolvedParams = await params;
    const token = await getToken({ req: request });

    if (!token || token.role !== 'ORGANIZER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: resolvedParams.eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.organizerId !== token.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
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
    } = body;

    const updated = await prisma.event.update({
      where: { id: resolvedParams.eventId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(date && { date: new Date(date) }),
        ...(location && { location }),
        ...(categoryId && { categoryId }),
        ...(totalSlots && { totalSlots, availableSlots: totalSlots }),
        ...(isPaid !== undefined && { isPaid }),
        ...(price !== undefined && { price: isPaid ? price : null }),
        ...(paymentQR !== undefined && { paymentQR: isPaid ? paymentQR : null }),
      },
      include: { category: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const resolvedParams = await params;
    const token = await getToken({ req: request });

    if (!token || token.role !== 'ORGANIZER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: resolvedParams.eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.organizerId !== token.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await prisma.event.delete({
      where: { id: resolvedParams.eventId },
    });

    return NextResponse.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
