export default function Courses() {
  const courses = [
    {
      title: "AutoCAD",
      industry: "Engineering",
      duration: "2 months",
      description: "Master 2D and 3D design with AutoCAD for engineering applications.",
    },
    {
      title: "Financial Analyst Program",
      industry: "Finance",
      duration: "4 months",
      description: "Learn financial modeling and investment strategies for global markets.",
    },
    {
      title: "Healthcare Management",
      industry: "Healthcare",
      duration: "2 months",
      description: "Develop skills for healthcare administration and compliance.",
    },
    {
      title: "Full-Stack Development",
      industry: "IT",
      duration: "3 months",
      description: "Build modern web applications with React and Node.js.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container">
        <h2 className="text-3xl font-extrabold text-secondary text-center">
          Our Courses
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.title}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold text-secondary">{course.title}</h3>
              <p className="mt-2 text-gray-600"><strong>Industry:</strong> {course.industry}</p>
              <p className="mt-1 text-gray-600"><strong>Duration:</strong> {course.duration}</p>
              <p className="mt-2 text-gray-600">{course.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}