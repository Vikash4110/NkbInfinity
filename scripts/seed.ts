import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  try {
    await prisma.certificate.deleteMany();
    await prisma.certificate.createMany({
      data: [
        {
          studentName: "Raju Kumar",
          courseName: "AutoCAD",
          duration: "02-06-25 to 30-06-2025",
          certificateNo: "A2025778",
          fathersName: "Manejar Mandal",
          institute: "Government Polytechnic Banka",
          registrationNo: "1401524057",
          issuedAt: new Date("2025-07-01T10:00:00Z"),
        },
        {
          studentName: "Priya Sharma",
          courseName: "Financial Analyst Program",
          duration: "01-04-25 to 30-07-2025",
          certificateNo: "F2025987",
          fathersName: "Ramesh Sharma",
          institute: "Delhi Institute of Management",
          registrationNo: "2301543098",
          issuedAt: new Date("2025-07-31T10:00:00Z"),
        },
      ],
    });
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
