import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

const TestimonialsSection = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "CAD Designer",
      content: "The AutoCAD course at NKBINFINITY transformed my career. The practical approach and industry-relevant projects helped me transition from a junior drafter to lead designer in just six months.",
      rating: 5
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Data Analyst",
      content: "The Python programming course gave me the skills I needed to break into data science. The instructors were knowledgeable and the hands-on projects were invaluable for my portfolio.",
      rating: 5
    },
    {
      id: 3,
      name: "Amit Kumar",
      role: "PLC Engineer",
      content: "The industrial automation training was exactly what I needed to advance my career. The practical labs and real-world scenarios prepared me for challenges I face daily in my job.",
      rating: 4
    }
  ];

  const [current, setCurrent] = useState(0);

  const nextTestimonial = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our students who transformed their careers
          </p>
        </motion.div>

        <motion.div 
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 relative">
            <div className="absolute top-8 left-8 text-blue-600 opacity-20">
              <FaQuoteLeft className="text-6xl" />
            </div>
            
            <div className="relative z-10">
              <p className="text-lg md:text-xl text-gray-700 mb-8 italic">
                "{testimonials[current].content}"
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">{testimonials[current].name}</h4>
                  <p className="text-gray-600">{testimonials[current].role}</p>
                  <div className="flex mt-2">
                    {[...Array(testimonials[current].rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    onClick={prevTestimonial}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <FaChevronLeft className="text-gray-700" />
                  </button>
                  <button 
                    onClick={nextTestimonial}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Next testimonial"
                  >
                    <FaChevronRight className="text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;