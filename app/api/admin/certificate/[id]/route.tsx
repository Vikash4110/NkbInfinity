import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const authMiddleware = (request: NextRequest) => {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new Error("No token provided");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== "admin") {
      throw new Error("Admin access required");
    }
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    authMiddleware(request);
    const { id } = await params; // Await params to resolve the dynamic route parameter
    const data = await request.json();
    const certificate = await prisma.certificate.update({
      where: { id },
      data: {
        studentName: data.studentName,
        courseName: data.courseName,
        duration: data.duration,
        certificateNo: data.certificateNo,
        fathersName: data.fathersName,
        institute: data.institute,
        registrationNo: data.registrationNo,
        issuedAt: new Date(data.issuedAt),
      },
      select: {
        id: true,
        studentName: true,
        courseName: true,
        duration: true,
        certificateNo: true,
        fathersName: true,
        institute: true,
        registrationNo: true,
        issuedAt: true,
      },
    });
    return NextResponse.json(certificate);
  } catch (error: any) {
    console.error("Update certificate error:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: error.message === "Invalid token" ? "Unauthorized" : "Internal server error" },
      { status: error.message === "Invalid token" ? 401 : 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    authMiddleware(request);
    const { id } = await params; // Await params to resolve the dynamic route parameter
    await prisma.certificate.delete({ where: { id } });
    return NextResponse.json({ message: "Certificate deleted successfully" });
  } catch (error: any) {
    console.error("Delete certificate error:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: error.message === "Invalid token" ? "Unauthorized" : "Internal server error" },
      { status: error.message === "Invalid token" ? 401 : 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}