import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateNo = searchParams.get("certificateNo");

    if (!certificateNo) {
      return NextResponse.json(
        { error: "Certificate number is required" },
        { status: 400 }
      );
    }

    const certificate = await prisma.certificate.findUnique({
      where: { certificateNo },
      select: {
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

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(certificate);
  } catch (error: any) {
    console.error("Error fetching certificate:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
