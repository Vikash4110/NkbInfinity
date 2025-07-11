/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, phone, courseId } = await request.json();

    const enrollment = await prisma.enrollment.create({
      data: {
        name,
        email,
        phone,
        courseId,
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process enrollment" },
      { status: 500 }
    );
  }
}
