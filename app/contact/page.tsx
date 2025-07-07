'use client'
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaPhone } from "react-icons/fa";

export default function Contact() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data: any) => console.log(data);

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-2xl text-blue-600" />,
      title: "Email Us",
      content: "contact@nkinfinity.com",
      link: "mailto:contact@nkinfinity.com"
    },
    {
      icon: <FaPhone className="text-2xl text-blue-600" />,
      title: "Call Us",
      content: "+91-123-456-7890",
      link: "tel:+911234567890"
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-blue-600" />,
      title: "Visit Us",
      content: "123 Infinity Tower, New Delhi, India",
      link: "https://maps.google.com"
    }
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
              Contact <span className="text-blue-600">NKB I Infinity</span>
            </h1>
            <p className="text-xl text-gray-600">
              We'd love to hear from you! Reach out for inquiries or support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Information */}
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-xl shadow-xl p-8 h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Get in Touch
                </h2>
                
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mr-4 mt-1">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-1">
                          {item.title}
                        </h3>
                        <a 
                          href={item.link} 
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.content}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Business Hours
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-xl shadow-xl p-8 h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Send Us a Message
                </h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+91 1234567890"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      {...register("message", { required: "Message is required" })}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="How can we help you?"
                    ></textarea>
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message.message as string}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
                  >
                    <FaPaperPlane className="mr-2" />
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="rounded-xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.566757968209!2d77.23191331508219!3d28.61294398242595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2daa9dc4a07%3A0x7e6332349f4a3d4e!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="NKB I Infinity Location"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}