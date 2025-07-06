import Link from "next/link";

export default function Header() {
  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Courses", href: "/courses" },
    { name: "Contact", href: "/contact" },
    { name: "Certificate", href: "/certificate" },
  ];

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="container py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          NKINFINITY
        </Link>
        <nav className="flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium hover:underline hover:text-gray-200 transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}