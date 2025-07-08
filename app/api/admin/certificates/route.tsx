import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const authMiddleware = (request: Request) => {
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

export async function GET(request: Request) {
  try {
    authMiddleware(request);
    const certificates = await prisma.certificate.findMany({
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
    return NextResponse.json(certificates);
  } catch (error: any) {
    console.error("Get certificates error:", {
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

export async function POST(request: Request) {
  try {
    authMiddleware(request);
    const data = await request.json();
    const certificate = await prisma.certificate.create({
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
    console.error("Create certificate error:", {
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