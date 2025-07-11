'use client';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import {
  FaAlignLeft,
  FaArrowLeft,
  FaChalkboardTeacher,
  FaClock,
  FaCode,
  FaDollarSign,
  FaImage,
  FaSave,
  FaSpinner,
  FaStar
} from 'react-icons/fa';
import { FiBookOpen } from 'react-icons/fi';

interface CourseFormData {
  id?: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  detailedDescription: string;
  imageUrl: string;
  price: number;
  rating: number;
  enrollments?: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
  }>;
}

export default function CourseForm({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    category: 'Mechanical Eng',
    duration: '4 weeks',
    description: '',
    detailedDescription: '',
    imageUrl: '',
    price: 0,
    rating: 4.5
  });

  useEffect(() => {
    if (isNew) return;

    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/courses/${resolvedParams.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch course');
        }

        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [resolvedParams.id, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'rating' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = isNew 
        ? '/api/admin/courses'
        : `/api/admin/courses/${resolvedParams.id}`;
      
      const method = isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(isNew ? 'Failed to create course' : 'Failed to update course');
      }

      router.push('/admin/courses');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => router.back()}
                className="flex items-center text-white hover:text-blue-200 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Courses
              </button>
              <h1 className="text-2xl font-bold">
                {isNew ? 'Create New Course' : 'Edit Course'}
              </h1>
              <div className="w-6"></div> {/* Spacer for alignment */}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Title */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="Enter course title"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiBookOpen className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      required
                    >
                      <option value="Mechanical Eng">Mechanical Engineering</option>
                      <option value="Electrical Eng">Electrical Engineering</option>
                      <option value="Electronic Eng">Electronic Engineering</option>
                      <option value="Computer Sci Eng">Computer Science Engineering</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaChalkboardTeacher className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <div className="relative">
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      required
                    >
                      <option value="4 weeks">4 Weeks</option>
                      <option value="6 weeks">6 Weeks</option>
                      <option value="8 weeks">8 Weeks</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaClock className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                      required
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaDollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating (1-5)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="5"
                      step="0.1"
                      required
                      placeholder="4.5"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaStar className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Image URL */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="https://example.com/image.jpg"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaImage className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <div className="relative">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                    required
                    placeholder="Brief course description"
                  />
                  <div className="absolute top-3 left-3">
                    <FaAlignLeft className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Description 
                </label>
                <div className="relative">
                  <textarea
                    name="detailedDescription"
                    value={formData.detailedDescription}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
                    required
                    placeholder="Detailed course description"
                  />
                  <div className="absolute top-3 left-3">
                    <FaCode className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      {!isNew ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      {!isNew ? 'Update Course' : 'Create Course'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}