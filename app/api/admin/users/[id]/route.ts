import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { Prisma } from "@/src/generated/client";
import type { Role } from "@/src/generated/enums";

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

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { data: { ...user, name: user.username } },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching user:", error)
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

    const user = await prisma.user.delete({
            where:{
                id: id
            },
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
              isVerified: true,
              createdAt: true,
            }
        })

        return NextResponse.json(
          {
            message: "User deleted successfully",
            data: { ...user, name: user.username },
          },
          { status: 200 }
        );


    } catch (error: unknown) {
      console.error("Error deleting user:", error)
      const prismaError = error as { code?: string }
      if (prismaError?.code === "P2025") {
        return NextResponse.json(
        { error: "User not found" },
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

    const updateData: Prisma.UserUpdateInput = {};
    if (typeof data.name === "string") updateData.username = data.name;
    if (typeof data.username === "string") updateData.username = data.username;
    if (typeof data.email === "string") updateData.email = data.email;
    if (typeof data.role === "string") {
      const roleInput = data.role.toUpperCase();
      const allowedRoles: Role[] = ["ADMIN", "ORGANIZER", "USER"]; 
      if (!allowedRoles.includes(roleInput as Role)) {
        return NextResponse.json(
          { error: "Invalid role. Allowed: ADMIN, ORGANIZER, USER" },
          { status: 400 }
        );
      }
      updateData.role = roleInput as Role;
    }
    if (typeof data.isVerified !== "undefined") updateData.isVerified = Boolean(data.isVerified);
    if (typeof data.password === "string" && data.password.length > 0) {
      updateData.password = await hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
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
      { message: "User updated successfully", data: { ...updatedUser, name: updatedUser.username } },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    const prismaError = error as { code?: string }
    if (prismaError?.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      )
    }
    if (prismaError?.code === "P2025") {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



