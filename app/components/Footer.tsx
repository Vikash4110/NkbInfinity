'use client'
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Our Team", href: "/team" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Courses",
      links: [
        { name: "AutoCAD", href: "/courses/autocad" },
        { name: "SolidWorks", href: "/courses/solidworks" },
        { name: "Python", href: "/courses/python" },
        { name: "PLC", href: "/courses/plc" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "FAQ", href: "/faq" },
        { name: "Help Center", href: "/help" },
        { name: "Verify Certificate", href: "/certificate" },
        { name: "Privacy Policy", href: "/privacy" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, href: "#" },
    { icon: <FaTwitter />, href: "#" },
    { icon: <FaLinkedin />, href: "#" },
    { icon: <FaInstagram />, href: "#" },
    { icon: <FaYoutube />, href: "#" },
  ];

  return (
    <footer className="bg-blue-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div>
            <Link href="/" className="text-2xl font-bold mb-4 inline-block">
              <span className="text-blue-300">NKB</span>INFINITY
            </Link>
            <p className="text-blue-100 mb-4">
              Empowering students with industry-ready skills through comprehensive training programs.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="text-white hover:text-blue-300 text-xl transition-colors"
                  aria-label={social.icon.type.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4 text-blue-300">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-blue-100 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MdLocationOn className="text-xl mr-3 mt-1 text-blue-300" />
                <span className="text-blue-100">
                  123 Training Street, Tech City, TC 12345
                </span>
              </li>
              <li className="flex items-center">
                <MdPhone className="text-xl mr-3 text-blue-300" />
                <Link href="tel:+918404859796" className="text-blue-100 hover:text-white">
                  +91 84048 59796
                </Link>
              </li>
              <li className="flex items-center">
                <MdEmail className="text-xl mr-3 text-blue-300" />
                <Link href="mailto:nkbiinfinty.bihar@gmail.com" className="text-blue-100 hover:text-white">
                  nkbiinfinty.bihar@gmail.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-800 mb-6"></div>

        {/* Copyright and Bottom Links */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-blue-200 mb-4 md:mb-0">
            © {currentYear} NKB I Infinity (OPC) Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="/terms" className="text-sm text-blue-200 hover:text-white">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-blue-200 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/sitemap" className="text-sm text-blue-200 hover:text-white">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}