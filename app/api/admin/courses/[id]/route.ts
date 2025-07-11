/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Extract ID from URL path
    const pathParts = request.nextUrl.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    if (id === "new") {
      return NextResponse.json({
        id: "",
        title: "",
        category: "",
        duration: "",
        description: "",
        detailedDescription: "",
        imageUrl: "",
        price: 0,
        rating: 4.5,
        enrollments: [],
      });
    }

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { error: "Invalid course ID format" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        enrollments: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Extract ID from URL path
    const pathParts = request.nextUrl.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    const courseData = await request.json();

    if (!courseData.title || !courseData.category) {
      return NextResponse.json(
        { error: "Title and category are required" },
        { status: 400 }
      );
    }

    const {
      id: _,
      createdAt,
      updatedAt,
      enrollments,
      ...updateData
    } = courseData;

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      {
        error: "Failed to update course",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Extract ID from URL path
    const pathParts = request.nextUrl.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    await prisma.enrollment.deleteMany({
      where: { courseId: id },
    });

    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Course and associated enrollments deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      {
        error: "Failed to delete course",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
