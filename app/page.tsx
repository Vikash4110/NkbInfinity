import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const courses = [
    {
      name: "AutoCAD",
      description: "Master 2D and 3D design for architecture and engineering projects.",
      icon: "✏️"
    },
    {
      name: "SolidWorks",
      description: "Learn 3D modeling and simulation for product design and manufacturing.",
      icon: "🖥️"
    },
    {
      name: "Arduino",
      description: "Build interactive electronics projects with open-source hardware.",
      icon: "🔌"
    },
    {
      name: "STAAD Pro",
      description: "Structural analysis and design for civil engineering projects.",
      icon: "🏗️"
    },
    {
      name: "Python",
      description: "Versatile programming for data, web, automation, and machine learning.",
      icon: "🐍"
    },
    {
      name: "PLC",
      description: "Industrial automation with Programmable Logic Controllers.",
      icon: "⚙️"
    }
  ];

  const stats = [
    { value: "1000+", label: "Students Trained" },
    { value: "15+", label: "Industry Experts" },
    { value: "6", label: "Core Courses" },
    { value: "95%", label: "Satisfaction Rate" }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Empowering Futures Through <span className="text-yellow-300">Industry-Ready</span> Training
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Bridging the gap between academic learning and industry demands with comprehensive training programs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/courses" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-lg text-lg transition duration-300">
              Explore Courses
            </Link>
            <Link href="/contact" className="bg-transparent hover:bg-blue-800 text-white font-semibold hover:text-white py-3 px-8 border border-white hover:border-transparent rounded-lg text-lg transition duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-3xl font-bold text-blue-800">{stat.value}</div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <Image 
                src="/about-image.jpg" 
                alt="NKBINFINITY Training"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold text-blue-900 mb-6">Who We Are</h2>
              <p className="text-lg text-gray-700 mb-6">
                NKB I Infinity (OPC) Pvt. Ltd. is a premier training and consultancy firm dedicated to equipping students and professionals with the skills needed to thrive in today's competitive job market.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                With expertise across IT, finance, healthcare, and engineering, we've successfully guided thousands of learners towards excellence through our industry-aligned programs.
              </p>
              <Link href="/about" className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Featured Courses</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive training programs designed to meet industry demands
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                <div className="p-8">
                  <div className="text-4xl mb-4">{course.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.name}</h3>
                  <p className="text-gray-600 mb-6">{course.description}</p>
                  <Link href={`/courses/${course.name.toLowerCase().replace(' ', '-')}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/courses" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-lg inline-block transition duration-300">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The AutoCAD course transformed my career. I went from junior drafter to lead designer in just 6 months!",
                name: "Rahul Sharma",
                role: "CAD Designer"
              },
              {
                quote: "NKBINFINITY's Python program gave me the skills to land my dream job in data science. The hands-on projects were invaluable.",
                name: "Priya Patel",
                role: "Data Analyst"
              },
              {
                quote: "The industry-experienced instructors and practical approach made all the difference in my learning journey.",
                name: "Amit Kumar",
                role: "PLC Engineer"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
                <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-gray-600">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of successful students who've taken their skills to the next level with NKBINFINITY.
          </p>
          <Link href="/contact" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-lg text-lg inline-block transition duration-300">
            Enroll Now
          </Link>
        </div>
      </section>
    </>
  );
}