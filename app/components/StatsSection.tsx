import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { FaBriefcase, FaGlobe, FaGraduationCap, FaUserTie } from 'react-icons/fa';

interface StatItem {
  value: number;
  label: string;
  icon: JSX.Element;
  suffix: string;
}

const StatsSection = () => {
  const stats: StatItem[] = [
    { 
      value: 1000, 
      label: 'Students Trained', 
      icon: <FaGraduationCap className="text-4xl text-blue-600" />,
      suffix: '+'
    },
    { 
      value: 15, 
      label: 'Industry Experts', 
      icon: <FaUserTie className="text-4xl text-blue-600" />,
      suffix: '+'
    },
    { 
      value: 6, 
      label: 'Core Courses', 
      icon: <FaBriefcase className="text-4xl text-blue-600" />,
      suffix: ''
    },
    { 
      value: 95, 
      label: 'Satisfaction Rate', 
      icon: <FaGlobe className="text-4xl text-blue-600" />,
      suffix: '%'
    }
  ];

  return (
    <section className="py-16 bg-blue-900 text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex justify-center mb-4">
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                <CountUp end={stat.value} duration={3} />{stat.suffix}
              </div>
              <div className="text-xl text-blue-200">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;