'use client'
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { FiMenu, FiSearch, FiUser, FiX } from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";

interface NavItem {
  name: string;
  href: string;
  subItems?: NavItem[];
  icon?: JSX.Element;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems: NavItem[] = [
    { name: "Home", href: "/" },
    { 
      name: "Courses", 
      href: "/courses",
      icon: <FaGraduationCap className="mr-1" />,
      subItems: [
        { name: "AutoCAD Professional", href: "/courses/autocad", icon: <FaGraduationCap className="mr-2" /> },
        { name: "SolidWorks Certification", href: "/courses/solidworks", icon: <FaGraduationCap className="mr-2" /> },
        { name: "Python Programming", href: "/courses/python", icon: <FaGraduationCap className="mr-2" /> },
        { name: "PLC Automation", href: "/courses/plc", icon: <FaGraduationCap className="mr-2" /> },
      ]
    },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Verify Certificate", href: "/certificate" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSubmenu = (itemName: string) => {
    setOpenSubmenu(openSubmenu === itemName ? null : itemName);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", searchQuery);
    setSearchOpen(false);
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-blue-900 shadow-xl" : "bg-blue-900/90 backdrop-blur-sm"}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <span className="text-2xl font-bold text-white tracking-tight">
                <span className="text-blue-300 group-hover:text-blue-200 transition-colors">NKB</span>
                <span className="group-hover:text-blue-100 transition-colors">INFINITY</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-white hover:text-blue-200 transition-colors flex items-center"
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.name}
                  </Link>
                  {item.subItems && (
                    <button 
                      onClick={() => toggleSubmenu(item.name)}
                      className="p-1 text-white hover:text-blue-200 transition-colors"
                      aria-label={`Toggle ${item.name} menu`}
                    >
                      <RiArrowDropDownLine className={`text-xl transition-transform ${openSubmenu === item.name ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Submenu Dropdown */}
                {item.subItems && (
                  <AnimatePresence>
                    {openSubmenu === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
                      >
                        <div className="py-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              onClick={() => setOpenSubmenu(null)}
                            >
                              {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}

            {/* Search Button */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 text-white hover:text-blue-200 transition-colors"
              aria-label="Search"
            >
              <FiSearch className="text-lg" />
            </button>

            {/* Login/Profile */}
            <Link
              href="/login"
              className="p-2 text-white hover:text-blue-200 transition-colors"
              aria-label="Account"
            >
              <FiUser className="text-lg" />
            </Link>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="ml-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-full transition-all shadow-md hover:shadow-lg flex items-center"
            >
              <span>Enquire Now</span>
              <RiArrowDropDownLine className="ml-1 transform rotate-90" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-white"
              aria-label="Search"
            >
              <FiSearch className="text-lg" />
            </button>
            <button
              className="p-2 text-white focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
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
              <div className="px-2 pt-2 pb-4 space-y-1 bg-blue-800 rounded-lg mt-2">
                {navItems.map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        className="flex items-center px-3 py-2 text-base font-medium text-white hover:bg-blue-700 rounded-md w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.name}
                      </Link>
                      {item.subItems && (
                        <button 
                          onClick={() => toggleSubmenu(item.name)}
                          className="p-2 text-white"
                          aria-label={`Toggle ${item.name} menu`}
                        >
                          <RiArrowDropDownLine className={`text-xl transition-transform ${openSubmenu === item.name ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                    {item.subItems && openSubmenu === item.name && (
                      <div className="pl-4 mt-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="flex items-center px-3 py-2 text-sm font-medium text-blue-100 hover:bg-blue-700/50 rounded-md"
                            onClick={() => {
                              setIsOpen(false);
                              setOpenSubmenu(null);
                            }}
                          >
                            {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-2">
                  <Link
                    href="/login"
                    className="flex items-center justify-center w-full px-4 py-2 text-white font-medium rounded-full border border-white/30 hover:bg-white/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiUser className="mr-2" />
                    Login / Register
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center justify-center w-full mt-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-xl bg-white rounded-lg shadow-2xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search courses, resources..."
                  className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                >
                  <FiSearch className="text-xl" />
                </button>
              </form>
              <div className="mt-2 text-right">
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Press ESC to close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}