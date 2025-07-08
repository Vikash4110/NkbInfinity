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
  issuedAt: string | Date;
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

const validateCertificateData = (data: any): CertificateData => {
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

  for (const field of requiredFields) {
    if (!data[field]?.toString().trim()) {
      throw new Error(`${field} is required`);
    }
  }

  const issuedDate = new Date(data.issuedAt);
  if (isNaN(issuedDate.getTime())) {
    throw new Error("Invalid issued date");
  }

  return {
    ...data,
    issuedAt: issuedDate
  };
};

export async function GET(request: NextRequest) {
  try {
    authenticate(request);
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) throw new Error("Certificate ID is required");
    
    const certificate = await prisma.certificate.findUnique({
      where: { id },
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

    if (!certificate) {
      throw new Error("Certificate not found");
    }

    return NextResponse.json(certificate);
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
      // Enhanced bulk create with better error handling
      const results = await prisma.$transaction(async (prisma) => {
        const createdCertificates = [];
        const errors = [];
        
        for (const cert of data.certificates) {
          try {
            // Validate and format each certificate
            const issuedDate = new Date(cert.issuedAt);
            if (isNaN(issuedDate.getTime())) {
              throw new Error(`Invalid date: ${cert.issuedAt}`);
            }

            const certificate = await prisma.certificate.create({
              data: {
                studentName: String(cert.studentName).trim(),
                courseName: String(cert.courseName).trim(),
                duration: String(cert.duration).trim(),
                certificateNo: String(cert.certificateNo).trim(),
                fathersName: String(cert.fathersName).trim(),
                institute: String(cert.institute).trim(),
                registrationNo: String(cert.registrationNo).trim(),
                issuedAt: issuedDate,
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
              }
            });
            createdCertificates.push(certificate);
          } catch (error: any) {
            errors.push({
              certificateNo: cert.certificateNo,
              error: error.message.includes('Unique constraint') 
                ? 'Duplicate certificate or registration number' 
                : error.message
            });
          }
        }

        return { createdCertificates, errors };
      });

      if (results.errors.length > 0) {
        return NextResponse.json({
          success: results.createdCertificates.length,
          failed: results.errors.length,
          errors: results.errors.slice(0, 5), // Return first 5 errors
          certificates: results.createdCertificates
        }, { status: 207 }); // Multi-status
      }

      return NextResponse.json(results.createdCertificates);
    } else {
      // Single create (existing implementation)
      const validatedData = validateCertificateData(data);
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
        },
      });
      return NextResponse.json(certificate);
    }
  } catch (error: any) {
    console.error("Certificate creation error:", error);
    return NextResponse.json(
      { error: error.message.includes("Unique constraint") 
        ? "Certificate number or registration number already exists" 
        : "Failed to create certificate: " + error.message },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }
}