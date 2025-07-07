'use client'
import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaGraduationCap, FaHandsHelping, FaIndustry } from "react-icons/fa";
import { FiAward, FiTarget, FiUsers } from "react-icons/fi";

export default function About() {
  const features = [
    {
      icon: <FaChalkboardTeacher className="text-4xl text-blue-600" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of practical experience"
    },
    {
      icon: <FaHandsHelping className="text-4xl text-blue-600" />,
      title: "Hands-on Training",
      description: "Practical, project-based learning for real-world application"
    },
    {
      icon: <FaGraduationCap className="text-4xl text-blue-600" />,
      title: "Career Support",
      description: "Resume building, interview prep, and placement assistance"
    },
    {
      icon: <FaIndustry className="text-4xl text-blue-600" />,
      title: "Industry-Aligned",
      description: "Curriculum designed to meet current industry demands"
    }
  ];

  const stats = [
    { value: "1000+", label: "Students Trained", icon: <FiUsers /> },
    { value: "15+", label: "Industry Experts", icon: <FaChalkboardTeacher /> },
    { value: "95%", label: "Satisfaction Rate", icon: <FiAward /> }
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/5 z-0"></div>
        <div className="container relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-blue-600">NKB I Infinity</span>
            </h1>
            <p className="text-xl text-gray-600">
              Bridging the gap between academic learning and industry requirements
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <img 
                  src="/net.png" 
                  alt="NKB I Infinity Team" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-blue-900/20"></div>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <div className="space-y-6 text-gray-600">
                <p className="text-lg">
                  NKB I Infinity (OPC) Pvt. Ltd. is a premier training institute dedicated to transforming careers through industry-relevant education.
                </p>
                <p className="text-lg">
                  We empower students with practical skills in:
                </p>
                <ul className="grid grid-cols-2 gap-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    <span>Information Technology</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    <span>Finance</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    <span>Healthcare</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    <span>Engineering</span>
                  </li>
                </ul>
                <p className="text-lg">
                  With a proven track record of transforming thousands of careers, we provide comprehensive training to prepare students for professional success.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence sets us apart
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-4 text-blue-300">
                  <div className="text-3xl">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-xl text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center bg-blue-100 rounded-full p-3 mb-6">
              <FiTarget className="text-blue-600 text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
            <blockquote className="text-xl text-gray-600 italic mb-8">
              "To become the most trusted career transformation partner by delivering industry-relevant training that empowers individuals to achieve professional excellence."
            </blockquote>
            <div className="mt-8">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg">
                Explore Our Courses
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}