

import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const data = categories.map((c) => ({ ...c, name: c.name }));

    return NextResponse.json(
      { message: "Categories fetched successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Create new category

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name: string | undefined = body.categoryname || body.name;
    const isActive: boolean = Boolean(body.isActive);

    if (!name) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        isActive,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "Category created successfully", data: category },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating category:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}