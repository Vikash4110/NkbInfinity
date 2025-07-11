/* eslint-disable */
import EnrollmentForm from '@/app/components/EnrollmentForm';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { FaBookOpen, FaBriefcase, FaCertificate, FaChalkboardTeacher, FaRegStar, FaStar } from 'react-icons/fa';
import { FiAward, FiClock, FiUser } from 'react-icons/fi';
import { RiHandCoinLine } from 'react-icons/ri';

interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  detailedDescription: string;
  imageUrl: string;
  price: number;
  rating: number;
}

// Define the props type to expect params as a Promise
interface CoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  // Await the params to resolve the id
  const { id } = await params;
  const course = await getCourse(id);
  
  if (!course) {
    notFound();
  }

  return (
    <CourseContent course={course} />
  );
}

async function getCourse(id: string): Promise<Course | undefined> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/courses/${id}`, {
    next: { revalidate: 60 }
  });
  
  if (!res.ok) return undefined;
  return res.json();
}

// ... Rest of the CourseContent component remains unchanged ...
function CourseContent({ course }: { course: Course }) {
  const curriculumModules = [
    "Module 1: Fundamentals and Core Concepts",
    "Module 2: Advanced Techniques and Applications", 
    "Module 3: Real-world Case Studies",
    "Module 4: Hands-on Projects",
    "Module 5: Final Assessment"
  ];

  const learningBenefits = [
    { icon: <FaChalkboardTeacher className="text-green-500 mr-3" />, text: "Guidance from experienced instructors" },
    { icon: <FaCertificate className="text-green-500 mr-3" />, text: "Certificate upon completion" },
    { icon: <FaBriefcase className="text-green-500 mr-3" />, text: "Career guidance and support" },
    { icon: <FaBookOpen className="text-green-500 mr-3" />, text: "Access to learning resources" },
    { icon: <FiUser className="text-green-500 mr-3" />, text: "Hands-on projects with real applications" },
    { icon: <FiAward className="text-green-500 mr-3" />, text: "Industry-relevant skills" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-10 transition-all duration-300 hover:shadow-xl">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/3 relative h-80 md:h-[400px]">
              <Image
                src={course.imageUrl || "/course-placeholder.jpg"}
                alt={course.title}
                fill
                className="object-cover w-full h-full"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
            <div className="p-8 md:w-2/3">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-100 rounded-full mb-4">
                  {course.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
                  {course.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                    <FiClock className="mr-2 text-blue-500" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                    <div className="flex mr-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        i < Math.floor(course.rating) ? (
                          <FaStar key={i} className="text-yellow-400 text-md mx-0.5" />
                        ) : (
                          <FaRegStar key={i} className="text-yellow-400 text-md mx-0.5" />
                        )
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-600 ml-1">
                      {course.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-8">
                  {course.description}
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-100">
                  <div>
                    <span className="text-sm text-gray-500">Price</span>
                    <p className="text-3xl font-bold text-gray-900">
                      ${course.price.toFixed(2)}
                    </p>
                  </div>
                  <EnrollmentForm courseId={course.id} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                <FiAward className="text-blue-500 text-2xl mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Course Details</h2>
              </div>
              <div 
                className="prose max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: course.detailedDescription }} 
              />
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                <FaBookOpen className="text-blue-500 text-2xl mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
              </div>
              <div className="space-y-4">
                {curriculumModules.map((item, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4 font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{item}</h3>
                      <p className="text-sm text-gray-500 mt-1">4 lessons • 2 hours</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* What You'll Learn */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <RiHandCoinLine className="text-blue-500 text-2xl mr-3" />
                <h3 className="text-xl font-bold text-gray-900">What You'll Learn</h3>
              </div>
              <ul className="space-y-3">
                {learningBenefits.map((item, index) => (
                  <li key={index} className="flex items-start">
                    {item.icon}
                    <span className="text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}