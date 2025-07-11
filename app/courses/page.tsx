/* eslint-disable */
'use client'
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { FaBriefcase, FaChartLine, FaGraduationCap, FaLaptopCode, FaRegStar, FaStar } from "react-icons/fa";
import { FiClock } from "react-icons/fi";

interface Course { 
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  imageUrl: string;
  price: number;
  rating: number;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/admin/courses');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate the response data structure
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from API');
        }
        
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setError(error instanceof Error ? error.message : 'Failed to load courses');
        setCourses([]); // Ensure courses is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Safely calculate category counts
  const categories = [
    { name: "All", count: courses?.length || 0 },
    { name: "Mechanical Eng", count: courses?.filter(c => c.category === "Mechanical Eng").length || 0 },
    { name: "Electrical Eng", count: courses?.filter(c => c.category === "Electrical Eng").length || 0 },
    { name: "Electronic Eng", count: courses?.filter(c => c.category === "Electronic Eng").length || 0 },
    { name: "Computer Sci Eng", count: courses?.filter(c => c.category === "Computer Sci Eng").length || 0 },
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCourses = courses?.filter(course => 
    activeCategory === "All" ? true : course.category === activeCategory
  ) || [];

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "Mechanical Eng":
        return <FaBriefcase className="text-3xl" />;
      case "Electrical Eng":
        return <FaChartLine className="text-3xl" />;
      case "Electronic Eng":
        return <FaLaptopCode className="text-3xl" />;
      case "Computer Sci Eng":
        return <FaGraduationCap className="text-3xl" />;
      default:
        return <FaGraduationCap className="text-3xl" />;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Courses</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-blue-900 text-white">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-cover opacity-20 z-0"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Industry-Focused <span className="text-blue-300">Courses</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Hands-on training with industry-standard tools and technologies
            </p>
          </motion.div>
        </div>
      </section>

      {/* Courses Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          {/* Category Filters */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12 md:mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {categories.map((category) => (
              <motion.button
                key={category.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.name)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.name
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                } flex items-center`}
              >
                {category.name} 
                <span className="ml-2 bg-blue-100/20 text-xs px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Courses Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600">No courses found</h3>
              <p className="text-gray-500 mb-4">We couldn't find any courses matching your criteria</p>
              <button 
                onClick={() => setActiveCategory("All")}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                View All Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative h-48 w-full">
                    <Image 
                      src={course.imageUrl || "/course-placeholder.jpg"} 
                      alt={course.title}
                      layout="fill"
                      objectFit="cover"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-6 pb-4">
                    <div className="flex justify-center mb-5">
                      <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                        {getCategoryIcon(course.category)}
                      </div>
                    </div>
                    <div className="text-center mb-4">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full mb-2">
                        {course.category}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center justify-center text-sm text-gray-500 mb-3">
                        <FiClock className="mr-1.5" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          i < Math.floor(course.rating) ? (
                            <FaStar key={i} className="text-yellow-400 text-sm mx-0.5" />
                          ) : (
                            <FaRegStar key={i} className="text-yellow-400 text-sm mx-0.5" />
                          )
                        ))}
                        <span className="ml-2 text-sm text-gray-600">({course.rating})</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-center mb-5">
                      {course.description}
                    </p>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold text-gray-900">
                        ${course.price.toFixed(2)}
                      </div>
                      <Link href={`/courses/${course.id}`} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg">
                        View Course
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}