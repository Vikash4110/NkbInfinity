import { motion } from 'framer-motion';
import { JSX } from 'react'; // Explicitly import JSX
import { FaChalkboardTeacher, FaHandsHelping, FaIndustry, FaUserGraduate } from 'react-icons/fa';
interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
}

const WhyChooseUs = () => {
  const features: Feature[] = [
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
      icon: <FaUserGraduate className="text-4xl text-blue-600" />,
      title: "Career Support",
      description: "Resume building, interview prep, and placement assistance"
    },
    {
      icon: <FaIndustry className="text-4xl text-blue-600" />,
      title: "Industry-Aligned",
      description: "Curriculum designed to meet current industry demands"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose NKBIINFINITY?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We bridge the gap between academic learning and industry requirements
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
  );
};

export default WhyChooseUs;