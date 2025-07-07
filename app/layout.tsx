import type { Metadata, Viewport } from "next";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./globals.css";

// ✅ Metadata export
export const metadata: Metadata = {
  title: "NKINFINITY - Empowering Future Leaders",
  description:
    "Comprehensive training programs bridging academic learning and industry demands in IT, finance, healthcare, and engineering.",
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
        <Header />
        <main className="flex-grow pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
