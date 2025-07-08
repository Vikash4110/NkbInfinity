/* eslint-disable */
'use client'
import { motion } from "framer-motion";
import Image from "next/image";
import { FaChalkboardTeacher, FaGraduationCap, FaHandsHelping, FaIndustry, FaUserTie } from "react-icons/fa";
import { FiAward, FiCheckCircle, FiTarget, FiUsers } from "react-icons/fi";
import { IoMdRibbon } from "react-icons/io";

export default function About() {
  const features = [
    {
      icon: <FaChalkboardTeacher className="text-4xl" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals with 10+ years of practical experience",
      bgColor: "bg-blue-100"
    },
    {
      icon: <FaHandsHelping className="text-4xl" />,
      title: "Hands-on Training",
      description: "Practical, project-based learning with real-world case studies",
      bgColor: "bg-orange-100"
    },
    {
      icon: <FaGraduationCap className="text-4xl" />,
      title: "Career Support",
      description: "Resume building, interview prep, and direct placement assistance",
      bgColor: "bg-green-100"
    },
    {
      icon: <FaIndustry className="text-4xl" />,
      title: "Industry-Aligned",
      description: "Curriculum designed with input from top industry leaders",
      bgColor: "bg-purple-100"
    }
  ];

  const stats = [
    { value: "1000+", label: "Students Trained", icon: <FiUsers className="text-3xl" /> },
    { value: "15+", label: "Industry Experts", icon: <FaUserTie className="text-3xl" /> },
    { value: "95%", label: "Satisfaction Rate", icon: <FiAward className="text-3xl" /> },
    { value: "50+", label: "Partner Companies", icon: <FaIndustry className="text-3xl" /> }
  ];

  const values = [
    {
      title: "Excellence",
      description: "We strive for the highest standards in all our training programs",
      icon: <IoMdRibbon className="text-2xl" />
    },
    {
      title: "Integrity",
      description: "Honest and ethical practices in all our operations",
      icon: <FiCheckCircle className="text-2xl" />
    },
    {
      title: "Innovation",
      description: "Continuously updating our curriculum with the latest technologies",
      icon: <FaIndustry className="text-2xl" />
    }
  ];

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
              <span className="text-sm font-medium text-blue-100">Recognized Training Provider</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              About <span className="text-blue-300">NKB I Infinity</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Transforming careers through industry-relevant education and practical training
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/net.png" 
                  alt="NKB I Infinity Team" 
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-blue-900/10"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-bold">Towards Excellance</h3>
                  <p>Industry experts committed to your success</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission & Values
              </h2>
              <div className="space-y-6 text-gray-600 text-lg">
                <p>
                  NKB I Infinity (OPC) Pvt. Ltd. is a premier training institute dedicated to bridging the gap between academic learning and industry requirements through practical, hands-on education.
                </p>
                <p>
                  We specialize in career-transforming programs across:
                </p>
                <ul className="grid grid-cols-2 gap-3">
                  {["Information Technology", "Finance", "Healthcare", "Engineering", "Design", "Business"].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                {values.map((value, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100 p-2 rounded-full mr-3 text-blue-600">
                        {value.icon}
                      </div>
                      <h4 className="font-semibold text-gray-900">{value.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Institute</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              What makes us different from traditional education providers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${feature.bgColor}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-white p-4 rounded-full shadow-md">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-800 to-blue-700 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-4 text-blue-200">
                  <div className="bg-white/10 p-4 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center bg-blue-100 rounded-full p-4 mb-6">
              <FiTarget className="text-blue-600 text-3xl" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Vision for the Future</h2>
            <blockquote className="text-xl md:text-2xl text-gray-600 italic mb-8 leading-relaxed">
              &ldquo;To become the most trusted career transformation partner by delivering cutting-edge, industry-relevant training that empowers individuals to achieve professional excellence in an ever-evolving global marketplace.&rdquo;
            </blockquote>
           
          </motion.div>
        </div>
      </section>

      
    </div>
  );
}