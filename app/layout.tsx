import type { Metadata, Viewport } from "next";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Loader from './components/Loader';
import "./globals.css";

// ✅ Metadata export
export const metadata: Metadata = {
  title: "NKBI Infinity - Elevate Your Skills and Knowledge",
  description:
    "NKBI Infinity offers a comprehensive range of expert-led courses and services, empowering individuals to master new skills. Discover our offerings and take the first step towards growth.",
  keywords: [
    "NKBIINFINITY",
    "NKBI Infinity",
    "NKBI Infinity courses",
    "NKBI Infinity services",
    "NKBI Infinity training",
    "NKBI Infinity learning",
    "NKBI Infinity professional training",
    "NKBI Infinity corporate training",
    "nkbi infinity",
    "nkbi infinity courses",
    "nkbi infinity services",
    "nkbi infinity training",
    "nkbi infinity learning",
    "nkbi infinity professional training",
    "nkbi infinity corporate training",
    "courses",
    "services",
    "training",
    "courses and services",
    "courses in bihar",
    "tech institute",
    "training institute",
    "learning institute",
    "online training",
    "training in bihar",
    "training in india",
    "online learning in bihar",
    "online learning in india",
    "online courses in bihar",
    "online courses in india",
    "professional training in bihar",
    "professional training in india",
    "skill development in bihar",
    "skill development in india",
    "expert-led courses in bihar",
    "expert-led courses in india",
    "learning services in bihar",
    "learning services in india",
    "corporate training in bihar",
    "corporate training in india",
    "online learning in bihar",
    "online learning in india",
    "python courses",
    "java courses",
    "c++ courses",
    "c courses",
    "javascript courses",
    "react courses",
    "angular courses",
    "vue courses",
    "node courses",
    "express courses",
    "mongodb courses",
    "sql courses",
    "postgresql courses",
    "mysql courses",
    "oracle courses",
    "data science courses",
    "machine learning courses",
    "deep learning courses",

    "certification courses",
    "training courses",
    "online courses",

    "certification in bihar",
    "free certification",
    "free courses",
    "free training",
    "free learning",
    "free online courses",
    
    "courses",
    "autocad courses",
    "solidworks courses",
    "catia courses",
    "3d printing courses",
    "3d modeling courses",
    "3d scanning courses",
    "online courses",
    "professional training",
    "skill development",
    "expert-led courses",
    "learning services",
    "corporate training",
    "online learning",
    "industrial training",
  ],
  openGraph: {
    type: "website",
    url: "https://https://nkbiinfinity.in/",
    title: "NKBI Infinity - Elevate Your Skills and Knowledge",
    description:
      "Explore NNKBI Infinity's extensive selection of expert-led courses and services designed to help you unlock your potential. Learn more about our offerings today.",
    images: [
      {
        url: "https://res.cloudinary.com/dyumydxmc/image/upload/fl_preserve_transparency/v1731835366/Logo_jtj9yz.jpg?_s=public-apps",
        width: 1200,
        height: 630,
        alt: "NKBI Infinity - Unlock Your Potential",
      },
    ],
    siteName: "NKBI Infinity",
  },
  twitter: {
    card: "summary_large_image",
    title: "NKBI Infinity - Elevate Your Skills and Knowledge",
    description:
      "Discover a wide range of expert-led courses and services at NKBIINFINITY. Start your journey towards growth and skill enhancement today.",
    images: [
      "https://res.cloudinary.com/dyumydxmc/image/upload/fl_preserve_transparency/v1731835366/Logo_jtj9yz.jpg?_s=public-apps",
    ],
  },
  robots: "index, follow",
};


// ✅ Viewport export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Loader />
        <Header />
        <main className="flex-grow pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
