'use client';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaEnvelope,
  FaFileExcel,
  FaPhone,
  FaSpinner,
  FaUserGraduate,
  FaUsers
} from 'react-icons/fa';
import { FiBook } from 'react-icons/fi';
import * as XLSX from 'xlsx'; // Import the xlsx library

interface Enrollment {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface Course {
  id: string;
  title: string;
  enrollments: Enrollment[];
}

export default function CourseEnrollments({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/courses/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch course');
        }

        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Function to export data to Excel
  const exportToExcel = () => {
    if (!course || !course.enrollments.length) return;

    // Prepare the data for Excel
    const data = course.enrollments.map(enrollment => ({
      'Student Name': enrollment.name,
      'Email': enrollment.email,
      'Phone': enrollment.phone,
      'Enrollment Date': new Date(enrollment.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }));

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Enrollments");
    
    // Generate the Excel file
    XLSX.writeFile(wb, `${course.title}_Enrollments.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/admin/courses')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => router.back()}
                className="flex items-center text-white hover:text-blue-200 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Course
              </button>
              <div className="flex items-center">
                <FaUsers className="mr-3 text-xl" />
                <h1 className="text-2xl font-bold">
                  Enrollments for {course?.title}
                </h1>
              </div>
              <div className="w-6"></div> {/* Spacer for alignment */}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {course?.enrollments.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                  <FiBook className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Enrollments Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  No students have enrolled in this course yet. Check back later or promote your course to attract students.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={exportToExcel}
                    className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                  >
                    <FaFileExcel className="mr-2" />
                    Export to Excel
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <FaUserGraduate className="mr-2 text-blue-500" />
                            Name
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <FaEnvelope className="mr-2 text-blue-500" />
                            Email
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <FaPhone className="mr-2 text-blue-500" />
                            Phone
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-blue-500" />
                            Enrollment Date
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {course?.enrollments.map((enrollment) => (
                        <tr key={enrollment.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <FaUserGraduate />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{enrollment.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{enrollment.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{enrollment.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(enrollment.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}