'use client'
import { motion } from "framer-motion";
import { useState } from 'react';
import { FaBriefcase, FaChartLine, FaGraduationCap, FaLaptopCode } from "react-icons/fa";
import { FiClock, FiTrendingUp } from "react-icons/fi";

export default function Courses() {
  const courses = [
    {
      title: "AutoCAD Professional",
      industry: "Engineering",
      duration: "8 Weeks",
      description: "Master 2D and 3D design for architecture and mechanical engineering applications with industry-standard tools.",
      icon: <FaGraduationCap className="text-3xl text-blue-600" />,
      features: ["Hands-on projects", "Industry certification", "Portfolio development"],
      category: "Engineering"
    },
    {
      title: "Financial Analyst Program",
      industry: "Finance",
      duration: "16 Weeks",
      description: "Comprehensive training in financial modeling, investment strategies, and market analysis for global finance careers.",
      icon: <FaChartLine className="text-3xl text-blue-600" />,
      features: ["Excel mastery", "Financial modeling", "Real-world case studies"],
      category: "Finance"
    },
    {
      title: "Healthcare Administration",
      industry: "Healthcare",
      duration: "10 Weeks",
      description: "Develop essential skills for healthcare management, compliance, and operational excellence in medical facilities.",
      icon: <FaBriefcase className="text-3xl text-blue-600" />,
      features: ["Regulatory compliance", "Healthcare IT", "Leadership training"],
      category: "Healthcare"
    },
    {
      title: "Full-Stack Development",
      industry: "IT",
      duration: "12 Weeks",
      description: "Build modern web applications using React, Node.js, and MongoDB with agile development methodologies.",
      icon: <FaLaptopCode className="text-3xl text-blue-600" />,
      features: ["MERN stack", "REST APIs", "Deployment strategies"],
      category: "IT"
    },
    {
      title: "Data Science Fundamentals",
      industry: "IT",
      duration: "14 Weeks",
      description: "Learn Python for data analysis, machine learning algorithms, and data visualization techniques.",
      icon: <FaLaptopCode className="text-3xl text-blue-600" />,
      features: ["Python programming", "Pandas & NumPy", "Machine learning basics"],
      category: "IT"
    },
    {
      title: "Digital Marketing Mastery",
      industry: "Marketing",
      duration: "6 Weeks",
      description: "Comprehensive training in SEO, social media marketing, and content strategy for digital platforms.",
      icon: <FaChartLine className="text-3xl text-blue-600" />,
      features: ["SEO techniques", "Social media strategy", "Analytics tools"],
      category: "Marketing"
    }
  ];

  const categories = [
    { name: "All", count: courses.length },
    { name: "Engineering", count: courses.filter(c => c.category === "Engineering").length },
    { name: "Finance", count: courses.filter(c => c.category === "Finance").length },
    { name: "Healthcare", count: courses.filter(c => c.category === "Healthcare").length },
    { name: "IT", count: courses.filter(c => c.category === "IT").length },
    { name: "Marketing", count: courses.filter(c => c.category === "Marketing").length }
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-blue-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90 z-0"></div>
        <div className="container relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Transform Your Career With Our <span className="text-blue-300">Courses</span>
            </h1>
            <p className="text-xl text-blue-100">
              Industry-relevant training programs designed for professional success
            </p>
          </motion.div>
        </div>
      </section>

      {/* Courses Content */}
      <section className="py-16">
        <div className="container">
          {/* Category Filters */}
          <motion.div 
            className="flex flex-wrap justify-center gap-2 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.name
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } shadow-sm`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </motion.div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses
              .filter(course => activeCategory === "All" || course.category === activeCategory)
              .map((course, index) => (
                <motion.div
                  key={course.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="p-6">
                    <div className="flex justify-center mb-4">
                      {course.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                      {course.title}
                    </h3>
                    <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                      <FiClock className="mr-1" />
                      <span>{course.duration}</span>
                      <span className="mx-2">•</span>
                      <FiTrendingUp className="mr-1" />
                      <span>{course.industry}</span>
                    </div>
                    <p className="text-gray-600 text-center mb-4">
                      {course.description}
                    </p>
                    <div className="mt-4 space-y-2">
                      {course.features.map((feature, i) => (
                        <div key={i} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                      Enroll Now
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8">
              Our admissions team is ready to help you choose the perfect program for your career goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-3 bg-white text-blue-900 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg">
                Speak to an Advisor
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}