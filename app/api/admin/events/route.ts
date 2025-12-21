import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { title } from "process";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        category: { select: { name: true } },   // category name
        organizer: { select: { username: true } }, // organizer name
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const data = events.map((e) => ({
        id: e.id,
        title:e.title,
        category:e.category.name,
        organizer:e.organizer.username
    }));

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
