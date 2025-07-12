import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaArrowRight, FaChartLine, FaCheck, FaClock } from 'react-icons/fa';
import { FiBarChart2 } from 'react-icons/fi';

interface Course {
  name: string;
  description: string;
  duration: string;
  level: string;
  highlight?: boolean;
}

const PopularCourses = () => {
  const [activeOption, setActiveOption] = useState(0);
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null);
  
  const courses: Course[] = [
    {
      name: "AutoCAD Professional",
      description: "Master 2D and 3D design for architecture and engineering with industry-standard tools",
      duration: "4 Weeks",
      level: "Beginner to Advanced",
      highlight: true
    },
    {
      name: "SolidWorks Certification",
      description: "Comprehensive 3D modeling and simulation for mechanical product design",
      duration: "4 Weeks",
      level: "Beginner to Advanced"
    },
    {
      name: "Python Programming",
      description: "From fundamentals to data science applications with real-world projects",
      duration: "4 Weeks",
      level: "Beginner to Advanced"
    }
  ];

  const features: string[] = [
    'Industry-Relevant Curriculum',
    'Expert-Led Instruction',
    'Hands-On Projects',
    'Career Support'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOption(prev => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-400 mix-blend-screen filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-indigo-500 mix-blend-screen filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 items-center">
          {/* Left content */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-2 text-blue-300 font-medium flex items-center">
              <FiBarChart2 className="mr-2" />
              <span>TRENDING COURSES</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Build In-Demand Skills With <span className="text-blue-300">Our Programs</span>
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-lg">
              Accelerate your career with our industry-aligned courses taught by professionals
            </p>
            
            {/* Features list */}
            <div className="mb-10 space-y-5">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className={`flex items-start text-lg transition-all duration-300 ${
                    activeOption === index ? 'text-white' : 'text-blue-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`p-1.5 rounded-lg mr-4 ${
                    activeOption === index ? 'bg-blue-600' : 'bg-blue-800'
                  }`}>
                    <FaCheck className={`text-sm ${activeOption === index ? 'text-blue-200' : 'text-blue-400'}`} />
                  </div>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
            
            {/* CTA button */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/courses"
                className="inline-flex items-center bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold py-4 px-8 rounded-lg hover:shadow-lg transition-all duration-300 group"
              >
                <span>Explore All Courses</span>
                <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right content - Courses cards */}
          <motion.div 
            className="lg:w-1/2 w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="space-y-6 relative">
              {courses.map((course, index) => (
                <motion.div
                  key={index}
                  className={`relative bg-white/5 backdrop-blur-md border ${
                    course.highlight ? 'border-blue-400' : 'border-white/10'
                  } rounded-xl p-6 transition-all duration-300 overflow-hidden`}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: course.highlight ? '0 10px 25px -5px rgba(56, 182, 255, 0.2)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                  onHoverStart={() => setHoveredCourse(index)}
                  onHoverEnd={() => setHoveredCourse(null)}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {course.highlight && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold mb-2 flex items-center">
                    {course.name}
                    {hoveredCourse === index && (
                      <motion.span 
                        className="ml-2 text-blue-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <FaArrowRight />
                      </motion.span>
                    )}
                  </h3>
                  <p className="text-blue-100 mb-5">{course.description}</p>
                  
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center text-blue-200">
                      <FaClock className="mr-2 text-blue-300" />
                      {course.duration}
                    </span>
                    <span className="flex items-center text-blue-200">
                      <FaChartLine className="mr-2 text-blue-300" />
                      {course.level}
                    </span>
                  </div>
                  
                  {/* Hover effect */}
                  <motion.div 
                    className={`absolute inset-0 -z-10 ${
                      course.highlight ? 'bg-blue-900/30' : 'bg-blue-800/20'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCourse === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
              
              {/* Decorative element */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-blue-600/20 filter blur-xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PopularCourses;