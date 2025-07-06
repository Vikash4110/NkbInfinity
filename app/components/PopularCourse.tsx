import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaArrowRight, FaCheck } from 'react-icons/fa';

interface Course {
  name: string;
  description: string;
  duration: string;
  level: string;
}

const PopularCourses = () => {
  const [activeOption, setActiveOption] = useState(0);
  
  const courses: Course[] = [
    {
      name: "AutoCAD Professional",
      description: "Master 2D and 3D design for architecture and engineering",
      duration: "8 Weeks",
      level: "Beginner to Advanced"
    },
    {
      name: "SolidWorks Certification",
      description: "3D modeling and simulation for product design",
      duration: "10 Weeks",
      level: "Intermediate"
    },
    {
      name: "Python Programming",
      description: "From basics to data science applications",
      duration: "12 Weeks",
      level: "Beginner"
    }
  ];

  const options: string[] = [
    'Industry-Relevant Curriculum',
    'Expert-Led Instruction',
    'Hands-On Projects',
    'Career Support'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOption(prev => (prev + 1) % options.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [options.length]);

  return (
    <section className="py-20 bg-blue-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Popular Courses</h2>
            <p className="text-xl text-blue-100 mb-8">
              Transform your career with our most sought-after programs
            </p>
            
            <div className="mb-8">
              {options.map((option, index) => (
                <div 
                  key={index} 
                  className={`flex items-center text-lg mb-4 transition-all duration-500 ${
                    activeOption === index ? 'text-white' : 'text-blue-200'
                  }`}
                >
                  <FaCheck className={`mr-3 ${activeOption === index ? 'text-blue-300' : 'text-blue-400'}`} />
                  {option}
                </div>
              ))}
            </div>
            
            <Link
              href="/courses"
              className="inline-flex items-center bg-white text-blue-900 font-bold py-3 px-6 rounded-lg hover:bg-blue-100 transition-colors duration-300"
            >
              View All Courses <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>

          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              {courses.map((course, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-xl font-bold mb-2">{course.name}</h3>
                  <p className="text-blue-100 mb-4">{course.description}</p>
                  <div className="flex justify-between text-sm text-blue-200">
                    <span>{course.duration}</span>
                    <span>{course.level}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PopularCourses;