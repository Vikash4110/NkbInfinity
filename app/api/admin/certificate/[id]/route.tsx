/* eslint-disable */
// api/admin/certificate/[id]/route.tsx
import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface CertificateData {
  studentName: string;
  courseName: string;
  duration: string;
  certificateNo: string;
  fathersName: string;
  institute: string;
  registrationNo: string;
  issuedAt: Date;
}

interface DecodedToken extends JwtPayload {
  role?: string;
}

const authenticate = (request: NextRequest): DecodedToken => {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) throw new Error("No token provided");
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (decoded.role !== "admin") throw new Error("Admin access required");
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

const validateCertificate = (data: any): CertificateData => {
  const requiredFields = [
    "studentName",
    "courseName",
    "duration",
    "certificateNo",
    "fathersName",
    "institute",
    "registrationNo",
    "issuedAt"
  ];

  // Check for missing fields
  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Validate and parse date
  const issuedDate = new Date(data.issuedAt);
  if (isNaN(issuedDate.getTime())) {
    throw new Error("Invalid issued date format. Use YYYY-MM-DD");
  }

  // Validate string fields
  const stringFields = [
    "studentName",
    "courseName",
    "duration",
    "certificateNo",
    "fathersName",
    "institute",
    "registrationNo"
  ];

  for (const field of stringFields) {
    if (typeof data[field] !== 'string') {
      throw new Error(`${field} must be a string`);
    }
  }

  return {
    studentName: data.studentName.trim(),
    courseName: data.courseName.trim(),
    duration: data.duration.trim(),
    certificateNo: data.certificateNo.trim(),
    fathersName: data.fathersName.trim(),
    institute: data.institute.trim(),
    registrationNo: data.registrationNo.trim(),
    issuedAt: issuedDate
  };
};

export async function GET(request: NextRequest) {
  try {
    authenticate(request);
    
    const certificates = await prisma.certificate.findMany({
      orderBy: { issuedAt: 'desc' },
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
    return NextResponse.json(
      { error: error.message === "Invalid token" ? "Unauthorized" : error.message },
      { status: error.message === "Invalid token" ? 401 : 400 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    authenticate(request);
    const data = await request.json();

    if (Array.isArray(data.certificates)) {
      // Process bulk upload
      const results = await prisma.$transaction(async (tx) => {
        const created = [];
        const errors = [];

        for (const [index, cert] of data.certificates.entries()) {
          try {
            const validated = validateCertificate(cert);
            const newCert = await tx.certificate.create({
              data: validated,
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
              }
            });
            created.push(newCert);
          } catch (error: any) {
            errors.push({
              row: index + 1,
              certificateNo: cert.certificateNo || 'N/A',
              error: error.message
            });
          }
        }

        return { created, errors };
      });

      if (results.errors.length > 0) {
        return NextResponse.json({
          success: results.created.length,
          failed: results.errors.length,
          errors: results.errors.slice(0, 10),
          certificates: results.created
        }, { status: 207 });
      }

      return NextResponse.json(results.created);
    } else {
      // Process single certificate
      const validatedData = validateCertificate(data);
      const certificate = await prisma.certificate.create({
        data: validatedData,
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
        }
      });

      return NextResponse.json(certificate);
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message.includes("Unique constraint") 
        ? "Certificate number or registration number already exists" 
        : error.message },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  try {
    authenticate(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) throw new Error("Certificate ID is required");
    
    const data = await request.json();
    const validatedData = validateCertificate(data);
    
    const certificate = await prisma.certificate.update({
      where: { id },
      data: validatedData,
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
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    authenticate(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) throw new Error("Certificate ID is required");
    
    await prisma.certificate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }
}