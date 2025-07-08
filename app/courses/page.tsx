/* eslint-disable */
'use client'
import { motion } from "framer-motion";
import { useState } from 'react';
import { FaBriefcase, FaChartLine, FaGraduationCap, FaLaptopCode, FaRegStar, FaStar } from "react-icons/fa";
import { FiAward, FiClock, FiTrendingUp } from "react-icons/fi";
import { IoMdPricetag } from "react-icons/io";

export default function Courses() {
  const courses = [
    {
      title: "AutoCAD Professional",
      industry: "Engineering",
      duration: "8 Weeks",
      description: "Master 2D and 3D design for architecture and mechanical engineering applications with industry-standard tools.",
      icon: <FaGraduationCap className="text-3xl" />,
      features: ["Hands-on projects", "Industry certification", "Portfolio development"],
      category: "Engineering",
      level: "Intermediate",
      price: "899",
      rating: 4.8,
      featured: true
    },
    {
      title: "Financial Analyst Program",
      industry: "Finance",
      duration: "16 Weeks",
      description: "Comprehensive training in financial modeling, investment strategies, and market analysis for global finance careers.",
      icon: <FaChartLine className="text-3xl" />,
      features: ["Excel mastery", "Financial modeling", "Real-world case studies"],
      category: "Finance",
      level: "Advanced",
      price: "1,299",
      rating: 4.9,
      featured: true
    },
    {
      title: "Healthcare Administration",
      industry: "Healthcare",
      duration: "10 Weeks",
      description: "Develop essential skills for healthcare management, compliance, and operational excellence in medical facilities.",
      icon: <FaBriefcase className="text-3xl" />,
      features: ["Regulatory compliance", "Healthcare IT", "Leadership training"],
      category: "Healthcare",
      level: "Beginner",
      price: "749",
      rating: 4.6
    },
    {
      title: "Full-Stack Development",
      industry: "IT",
      duration: "12 Weeks",
      description: "Build modern web applications using React, Node.js, and MongoDB with agile development methodologies.",
      icon: <FaLaptopCode className="text-3xl" />,
      features: ["MERN stack", "REST APIs", "Deployment strategies"],
      category: "IT",
      level: "Intermediate",
      price: "1,099",
      rating: 4.7,
      featured: true
    },
    {
      title: "Data Science Fundamentals",
      industry: "IT",
      duration: "14 Weeks",
      description: "Learn Python for data analysis, machine learning algorithms, and data visualization techniques.",
      icon: <FaLaptopCode className="text-3xl" />,
      features: ["Python programming", "Pandas & NumPy", "Machine learning basics"],
      category: "IT",
      level: "Intermediate",
      price: "1,199",
      rating: 4.8
    },
    {
      title: "Digital Marketing Mastery",
      industry: "Marketing",
      duration: "6 Weeks",
      description: "Comprehensive training in SEO, social media marketing, and content strategy for digital platforms.",
      icon: <FaChartLine className="text-3xl" />,
      features: ["SEO techniques", "Social media strategy", "Analytics tools"],
      category: "Marketing",
      level: "Beginner",
      price: "699",
      rating: 4.5
    }
  ];

  const categories = [
    { name: "All", count: courses.length },
    { name: "Featured", count: courses.filter(c => c.featured).length },
    { name: "Engineering", count: courses.filter(c => c.category === "Engineering").length },
    { name: "Finance", count: courses.filter(c => c.category === "Finance").length },
    { name: "Healthcare", count: courses.filter(c => c.category === "Healthcare").length },
    { name: "IT", count: courses.filter(c => c.category === "IT").length },
    { name: "Marketing", count: courses.filter(c => c.category === "Marketing").length }
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCourses = courses.filter(course => 
    activeCategory === "All" 
      ? true 
      : activeCategory === "Featured" 
        ? course.featured 
        : course.category === activeCategory
  );

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
            <div className="inline-flex items-center bg-blue-800/30 border border-blue-700 rounded-full px-4 py-1.5 mb-4">
              <FiAward className="mr-2 text-blue-300" />
              <span className="text-sm font-medium text-blue-100">Industry-Recognized Certifications</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Transform Your <span className="text-blue-300">Career</span> With Our Expert-Led Courses
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Gain practical skills and certifications that employers value in today's competitive job market
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
                {category.name === "Featured" && <FaStar className="mr-2 text-yellow-400" />}
                {category.name} 
                <span className="ml-2 bg-blue-100/20 text-xs px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600">No courses found in this category</h3>
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
                  key={course.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className={`bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 ${
                    course.featured ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  {course.featured && (
                    <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 absolute top-4 right-4 rounded-full flex items-center">
                      <FaStar className="mr-1" /> Featured
                    </div>
                  )}
                  <div className="p-6 pb-4">
                    <div className="flex justify-center mb-5">
                      <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                        {course.icon}
                      </div>
                    </div>
                    <div className="text-center mb-4">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full mb-2">
                        {course.level}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center justify-center text-sm text-gray-500 mb-3">
                        <FiClock className="mr-1.5" />
                        <span>{course.duration}</span>
                        <span className="mx-2">•</span>
                        <FiTrendingUp className="mr-1.5" />
                        <span>{course.industry}</span>
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
                    <div className="space-y-3 mb-6">
                      {course.features.map((feature, i) => (
                        <div key={i} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center text-lg font-bold text-gray-900">
                        <IoMdPricetag className="mr-1.5 text-blue-600" />
                        {course.price}
                      </div>
                      <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg">
                        Enroll Now
                      </button>
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