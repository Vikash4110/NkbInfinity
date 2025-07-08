/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

interface ContactData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const validateContactData = (data: any): ContactData => {
  const requiredFields = ["name", "email", "message"];
  const missingFields = requiredFields.filter(
    (field) => !data[field] || String(data[field]).trim() === ""
  );
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(data.email)) {
    throw new Error("Invalid email address");
  }

  if (data.phone && !/^\+?[1-9]\d{1,14}$/.test(data.phone)) {
    throw new Error("Invalid phone number");
  }

  return {
    name: String(data.name).trim(),
    email: String(data.email).trim(),
    phone: data.phone ? String(data.phone).trim() : undefined,
    message: String(data.message).trim(),
  };
};

const sendEmail = async (data: ContactData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"NKB I Infinity Contact" <${process.env.EMAIL_USER}>`,
    to: "nkbiinfinty.bihar@gmail.com",
    replyTo: data.email,
    subject: `New Contact Form Submission from ${data.name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, "<br>")}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export async function POST(request: NextRequest) {
  let data: any = null; // Declare data outside try block
  try {
    data = await request.json();
    console.log("Received contact form data:", data); // Debugging log

    const validatedData = validateContactData(data);

    // Optionally store in MongoDB
    await prisma.contactSubmission.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        message: validatedData.message,
      },
    });

    // Send email
    await sendEmail(validatedData);

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Contact form submission error:", {
      message: error.message,
      stack: error.stack,
      data: JSON.stringify(data ?? {}, null, 2), // Use ?? to handle null/undefined
    });
    return NextResponse.json(
      { error: error.message || "Failed to send message" },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
