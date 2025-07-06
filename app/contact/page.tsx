export default function Contact() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container">
        <h2 className="text-3xl font-extrabold text-secondary text-center">
          Contact Us
        </h2>
        <div className="mt-8 max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="space-y-4 text-gray-600">
            <p className="text-lg">
              Get in touch with our team for inquiries or support.
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:contact@nkinfinity.com" className="text-primary hover:underline">
                contact@nkinfinity.com
              </a>
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <a href="tel:+911234567890" className="text-primary hover:underline">
                +91-123-456-7890
              </a>
            </p>
            <p>
              <strong>Address:</strong> 123 Infinity Tower, New Delhi, India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}