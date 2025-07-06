export default function Footer() {
  return (
    <footer className="bg-primary text-white py-6">
      <div className="container text-center space-y-2">
        <p className="text-sm">
          © {new Date().getFullYear()} NKB I Infinity (OPC) Pvt. Ltd. All rights reserved.
        </p>
        <p className="text-xs">
          Empowering students with industry-ready skills.
        </p>
      </div>
    </footer>
  );
}