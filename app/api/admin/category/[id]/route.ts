import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { Prisma } from "@/src/generated/client";

type RouteParams = { id?: string }

async function resolveId(params: unknown): Promise<string | undefined> {
  const resolved = (await Promise.resolve(params as RouteParams | Promise<RouteParams>)) as RouteParams
  return resolved?.id
}

// GET single user by id
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = await resolveId(params)
    if (!id) {
      return NextResponse.json(
        { error: "Must provide id" },
        { status: 400 }
      )
    }

    const category = await prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true,
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { data: { ...category, name: category.name } },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
  const id = await resolveId(params);

        if(!id)
        {
            return NextResponse.json(
                { error: "Must provide id" },
                { status: 400 }
            )
        }

    const category = await prisma.category.delete({
            where:{
                id: id
            },
            select: {
              id: true,
              name: true,
              isActive: true,
              createdAt: true,
            }
        })

        return NextResponse.json(
          {
            message: "Category deleted successfully",
            data: { ...category, name: category.name },
          },
          { status: 200 }
        );


    } catch (error: unknown) {
      console.error("Error deleting user:", error)
      const prismaError = error as { code?: string }
      if (prismaError?.code === "P2025") {
        return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
        )
      }
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      )
        
    }
}
//put lay sabii change garxa existing field haru
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = await resolveId(params);
    const data = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Must provide id" },
        { status: 400 }
      );
    }

    const updateData: Prisma.CategoryUpdateInput = {};

    if (typeof data.name === "string") {
      updateData.name = data.name;
    }

    if (typeof data.isActive !== "undefined") {
      updateData.isActive = Boolean(data.isActive);
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "Category updated successfully", data: updatedCategory },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating category:", error);

    const prismaError = error as { code?: string };

    if (prismaError.code === "P2002") {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 }
      );
    }

    if (prismaError.code === "P2025") {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
