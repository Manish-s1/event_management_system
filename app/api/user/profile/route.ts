import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { compare, hash } from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: token.userId as string },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { username, email } = body;

    if (!username && !email) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: token.userId as string },
      data: {
        ...(username && { username }),
        ...(email && { email }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isVerified: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('Error updating profile:', error);
    const err = error as Record<string, unknown>;
    if (err?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Both old and new passwords required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: token.userId as string },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Old password is incorrect' },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(newPassword, 10);

    await prisma.user.update({
      where: { id: token.userId as string },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
}
