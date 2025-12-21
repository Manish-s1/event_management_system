import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [totalUsers, totalOrganizers, totalEvents, totalCategories] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          role: "ORGANIZER"
        }
      }),
      prisma.event.count(),
      prisma.category.count()
    ]);

    return NextResponse.json({
      users: totalUsers,
      organizers: totalOrganizers,
      events: totalEvents,
      categories: totalCategories
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
