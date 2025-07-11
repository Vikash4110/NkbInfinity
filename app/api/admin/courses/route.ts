/* eslint-disable */
import type { Course } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Get all courses
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        enrollments: true, // Include enrollments in the response
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// Create new course
export async function POST(request: Request) {
  try {
    const courseData: Omit<Course, "id" | "createdAt" | "updatedAt"> =
      await request.json();

    const newCourse = await prisma.course.create({
      data: courseData,
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
