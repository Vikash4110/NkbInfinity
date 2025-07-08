'use client';
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";
import { FaCertificate, FaEnvelope, FaGraduationCap, FaHome } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";

interface NavItem {
  name: string;
  href: string;
  icon: JSX.Element;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { name: "Home", href: "/", icon: <FaHome className="text-lg" /> },
    { name: "Courses", href: "/courses", icon: <FaGraduationCap className="text-lg" /> },
    { name: "Verify Certificate", href: "/certificate", icon: <FaCertificate className="text-lg" /> },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-blue-900 shadow-lg"
          : "bg-gradient-to-r from-blue-900 to-blue-800/90 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <FaGraduationCap className="text-3xl text-blue-300 group-hover:text-blue-200 transition-colors" />
              <span className="text-2xl font-extrabold text-white tracking-tight">
                <span className="text-blue-300 group-hover:text-blue-200 transition-colors">NKB</span>
                <span className="group-hover:text-blue-100 transition-colors"> IInfinity</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-blue-700/50 hover:text-blue-100 rounded-md transition-all duration-200"
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            {/* CTA Button */}
            <Link
              href="/contact"
              className="ml-4 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
            >
              <FaEnvelope className="mr-2" />
              Enquire Now
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              className="p-2 text-white hover:bg-blue-700/50 rounded-md transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 pt-4 pb-6 space-y-2 bg-blue-800/95 rounded-lg mt-2 shadow-lg">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-4 py-3 text-base font-medium text-white hover:bg-blue-700/70 rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <FaEnvelope className="mr-2" />
                  Enquire Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}