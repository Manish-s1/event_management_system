import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; registrationId: string }> }
) {
  try {
    const resolvedParams = await params;
    const token = await getToken({ req: request });

    if (!token || token.role !== 'ORGANIZER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const event = await prisma.event.findUnique({
      where: { id: resolvedParams.eventId },
    });

    if (!event || event.organizerId !== token.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const registration = await prisma.registration.findUnique({
      where: { id: resolvedParams.registrationId },
      include: { user: { select: { id: true, username: true, email: true } } },
    });

    if (!registration || registration.eventId !== resolvedParams.eventId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(registration);
  } catch (error) {
    console.error('Error fetching registration:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registration' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; registrationId: string }> }
) {
  try {
    const resolvedParams = await params;
    const token = await getToken({ req: request });

    if (!token || token.role !== 'ORGANIZER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const event = await prisma.event.findUnique({
      where: { id: resolvedParams.eventId },
    });

    if (!event || event.organizerId !== token.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { isVerified, ticketIssued } = body;

    const updateData: Record<string, boolean> = {};
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    if (ticketIssued !== undefined) updateData.ticketIssued = ticketIssued;

    const updated = await prisma.registration.update({
      where: { id: resolvedParams.registrationId },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    );
  }
}
