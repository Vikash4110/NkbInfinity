'use client'
import { motion } from 'framer-motion';
import Link from 'next/link';

const FinalCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Join thousands of successful professionals who&apos;ve taken their skills to the next level with NKBINFINITY.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/courses"
              className="bg-white hover:bg-gray-100 text-blue-900 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Browse All Courses
            </Link>
            <Link
              href="/contact"
              className="bg-transparent hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg text-lg border-2 border-white hover:border-transparent transition-all duration-300"
            >
              Get Free Consultation
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;