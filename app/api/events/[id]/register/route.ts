import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if event exists and has enough seats
    const event = await prisma.event.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    if (event.availableSlots < 1) {
      return NextResponse.json(
        { error: 'Not enough slots available' },
        { status: 400 }
      );
    }

    // Check if event is in the past
    if (new Date(event.date) < new Date()) {
      return NextResponse.json(
        { error: 'Cannot register for past events' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const paymentScreenshot = body?.paymentScreenshot as string | undefined;
    const fullNameInput = typeof body?.fullName === 'string' ? body.fullName : undefined;
    const emailInput = typeof body?.email === 'string' ? body.email : undefined;
    const phoneInput = typeof body?.phone === 'string' ? body.phone : undefined;
    const addressInput = typeof body?.address === 'string' ? body.address : undefined;

    // Validate for paid events: screenshot required
    if (event.isPaid && !paymentScreenshot) {
      return NextResponse.json(
        { error: 'Payment screenshot is required for paid events' },
        { status: 400 }
      );
    }

    // Prevent duplicate registrations
    const existing = await prisma.registration.findFirst({
      where: { userId: token.userId as string, eventId: resolvedParams.id }
    });
    if (existing) {
      return NextResponse.json(
        { error: 'You are already registered for this event' },
        { status: 409 }
      );
    }

    // Create registration (using session details) and update available slots
    const registrationData: Record<string, unknown> = {
      user: { connect: { id: token.userId as string } },
      event: { connect: { id: resolvedParams.id } },
      fullName: fullNameInput ?? ((token?.name as string) || 'N/A'),
      email: emailInput ?? ((token?.email as string) || 'N/A'),
      phone: phoneInput ?? 'N/A',
      address: addressInput ?? 'N/A',
      isVerified: false,
      ticketIssued: false,
    };

    if (paymentScreenshot) {
      registrationData.paymentScreenshot = paymentScreenshot;
    }

    let registration;
    try {
      registration = await prisma.registration.create({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: registrationData as any,
        include: {
          event: {
            include: {
              category: true,
            },
          },
          user: { select: { id: true, username: true, email: true } },
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        return NextResponse.json(
          { error: 'You are already registered for this event' },
          { status: 409 }
        );
      }
      throw error;
    }

    await prisma.event.update({
      where: { id: resolvedParams.id },
      data: {
        availableSlots: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error: any) {
    console.error('Error creating registration:', error?.message || error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create registration' },
      { status: 500 }
    );
  }
}
