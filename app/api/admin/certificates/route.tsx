import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Type Definitions
interface DecodedToken {
  role?: string;
}

interface CertificateData {
  studentName: string;
  courseName: string;
  duration: string;
  certificateNo: string;
  fathersName: string;
  institute: string;
  registrationNo: string;
  issuedAt: string;
}

interface BulkCertificateRequest {
  certificates: CertificateData[];
}

interface SingleCertificateRequest extends CertificateData {}

type CertificateResponse = Omit<CertificateData, "issuedAt"> & {
  id: number;
  issuedAt: string;
};

// Auth Middleware
const authMiddleware = (request: NextRequest): DecodedToken => {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (decoded.role !== "admin") {
      throw new Error("Admin access required");
    }
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// Validation Utility
const validateCertificate = (data: Partial<CertificateData>): string | null => {
  if (!data) {
    return "Request payload is empty";
  }

  const requiredFields: (keyof CertificateData)[] = [
    "studentName",
    "courseName",
    "duration",
    "certificateNo",
    "fathersName",
    "institute",
    "registrationNo",
    "issuedAt",
  ];

  const missingFields = requiredFields.filter(
    (field) => !data[field] || String(data[field]).trim() === ""
  );

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(", ")}`;
  }

  const issuedDate = new Date(data.issuedAt!);
  if (isNaN(issuedDate.getTime())) {
    return "Invalid issued date format. Use YYYY-MM-DD";
  }

  return null;
};

const normalizeCertificateData = (data: CertificateData): CertificateData => ({
  studentName: data.studentName.trim(),
  courseName: data.courseName.trim(),
  duration: data.duration.trim(),
  certificateNo: data.certificateNo.trim(),
  fathersName: data.fathersName.trim(),
  institute: data.institute.trim(),
  registrationNo: data.registrationNo.trim(),
  issuedAt: new Date(data.issuedAt).toISOString(),
});

// API Handlers
export async function GET(request: NextRequest) {
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
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("Unknown error occurred");
    
    console.error("Get certificates error:", {
      message: err.message,
      stack: err.stack,
    });

    return NextResponse.json(
      { error: err.message === "Invalid token" ? "Unauthorized" : "Internal server error" },
      { status: err.message === "Invalid token" ? 401 : 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    authMiddleware(request);
    const requestData = await request.json();

    if (Array.isArray(requestData.certificates)) {
      return await handleBulkCreate(requestData as BulkCertificateRequest);
    } else {
      return await handleSingleCreate(requestData as SingleCertificateRequest);
    }
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("Unknown error occurred");
    
    console.error("Create certificate error:", {
      message: err.message,
      stack: err.stack,
    });

    return NextResponse.json(
      {
        error: getErrorMessage(err),
      },
      { status: getErrorStatus(err) }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper Functions
async function handleBulkCreate(data: BulkCertificateRequest) {
  const errors: string[] = [];
  const certificates: CertificateData[] = [];

  data.certificates.forEach((cert, index) => {
    const validationError = validateCertificate(cert);
    if (validationError) {
      errors.push(`Row ${index + 1}: ${validationError}`);
      return;
    }
    certificates.push(normalizeCertificateData(cert));
  });

  if (errors.length > 0) {
    return NextResponse.json(
      { 
        error: `Invalid records:\n${errors.slice(0, 5).join("\n")}${errors.length > 5 ? "\n...and more" : ""}` 
      },
      { status: 400 }
    );
  }

  if (certificates.length === 0) {
    return NextResponse.json(
      { error: "No valid records provided" },
      { status: 400 }
    );
  }

  const { duplicates, uniqueCertificates } = await checkForDuplicates(certificates);
  if (duplicates.length > 0) {
    return NextResponse.json(
      { error: `Duplicate entries found: ${duplicates.join(", ")}` },
      { status: 400 }
    );
  }

  await prisma.certificate.createMany({
    data: uniqueCertificates,
  });

  const created = await fetchCreatedCertificates(uniqueCertificates);
  return NextResponse.json(created);
}

async function handleSingleCreate(data: SingleCertificateRequest) {
  const validationError = validateCertificate(data);
  if (validationError) {
    return NextResponse.json(
      { error: validationError },
      { status: 400 }
    );
  }

  const normalizedData = normalizeCertificateData(data);

  const existing = await prisma.certificate.findFirst({
    where: {
      OR: [
        { certificateNo: normalizedData.certificateNo },
        { registrationNo: normalizedData.registrationNo },
      ],
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Certificate number or registration number already exists" },
      { status: 400 }
    );
  }

  const certificate = await prisma.certificate.create({
    data: normalizedData,
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

async function checkForDuplicates(certificates: CertificateData[]) {
  const certificateNos = certificates.map((c) => c.certificateNo);
  const registrationNos = certificates.map((c) => c.registrationNo);

  const existing = await prisma.certificate.findMany({
    where: {
      OR: [
        { certificateNo: { in: certificateNos } },
        { registrationNo: { in: registrationNos } },
      ],
    },
    select: {
      certificateNo: true,
      registrationNo: true,
    },
  });

  const duplicateCertNos = existing.map((c) => c.certificateNo);
  const duplicateRegNos = existing.map((c) => c.registrationNo);

  const duplicates = [
    ...new Set([
      ...duplicateCertNos.filter((no) => certificateNos.includes(no)),
      ...duplicateRegNos.filter((no) => registrationNos.includes(no)),
    ]),
  ];

  const uniqueCertificates = certificates.filter(
    (cert) => 
      !duplicateCertNos.includes(cert.certificateNo) &&
      !duplicateRegNos.includes(cert.registrationNo)
  );

  return { duplicates, uniqueCertificates };
}

async function fetchCreatedCertificates(certificates: CertificateData[]) {
  const certificateNos = certificates.map((c) => c.certificateNo);
  const registrationNos = certificates.map((c) => c.registrationNo);

  return await prisma.certificate.findMany({
    where: {
      certificateNo: { in: certificateNos },
      registrationNo: { in: registrationNos },
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
}

function getErrorMessage(error: Error): string {
  if (error.message === "Invalid token") return "Unauthorized";
  if (error.message.includes("Invalid value for argument `issuedAt`")) {
    return "Invalid issued date provided (YYYY-MM-DD)";
  }
  if (error.message.includes("Unique constraint")) {
    return "Certificate number or registration number already exists";
  }
  return "Failed to create certificate. Ensure all fields are provided and unique.";
}

function getErrorStatus(error: Error): number {
  return error.message === "Invalid token" ? 401 : 400;
}