

import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Fetch all users (no password field exposed)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const data = users.map((u) => ({ ...u, name: u.username }));

    return NextResponse.json(
      { message: "Users fetched successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = body.username || body.name;
    const { email, password } = body;
    const isVerified = Boolean(body.isVerified);
    // Normalize and validate role
    const roleInput = (body.role ?? "").toString().toUpperCase();
    const allowedRoles = ["ADMIN", "ORGANIZER", "USER"] as const;
    if (!allowedRoles.includes(roleInput as any)) {
      return NextResponse.json(
        { error: "Invalid role. Allowed: ADMIN, ORGANIZER, USER" },
        { status: 400 }
      );
    }

    if (!username || !email || !password || !roleInput) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: roleInput as any,
        isVerified,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", data: { ...user, name: user.username } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
