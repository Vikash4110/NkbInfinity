import Link from "next/link";

export default function Home() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-secondary tracking-tight">
            Welcome to NKINFINITY
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Transforming lives through industry-aligned training in IT, finance, healthcare, and engineering.
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Explore Courses
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {["IT", "Finance", "Healthcare", "Engineering"].map((industry) => (
            <div
              key={industry}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold text-secondary">{industry} Training</h3>
              <p className="mt-2 text-gray-600">
                Cutting-edge programs tailored to {industry.toLowerCase()} industry standards.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}