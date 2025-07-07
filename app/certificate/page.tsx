'use client'
import { useState } from "react";
import { FaCertificate, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FiBook, FiCalendar, FiClock, FiFileText, FiHash, FiHome, FiSearch, FiUser } from "react-icons/fi";

interface Certificate {
  studentName: string;
  courseName: string;
  duration: string;
  certificateNo: string;
  fathersName: string;
  institute: string;
  registrationNo: string;
  issuedAt: string;
  isValid?: boolean;
}

export default function Certificate() {
  const [certificateNo, setCertificateNo] = useState("");
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!certificateNo.trim()) {
      setError("Please enter a valid certificate number.");
      return;
    }

    setError("");
    setCertificate(null);
    setLoading(true);

    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response - replace with actual API call
      const mockCertificate: Certificate = {
        studentName: "Rahul Sharma",
        courseName: "AutoCAD Professional",
        duration: "3 Months",
        certificateNo: certificateNo,
        fathersName: "Sanjay Sharma",
        institute: "NKBINFINITY Training Center",
        registrationNo: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
        issuedAt: new Date(2023, 5, 15).toISOString(),
        isValid: true
      };

      setCertificate(mockCertificate);
    } catch (err) {
      console.error("Verification error:", err);
      setError("An error occurred while verifying. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-blue-100 rounded-full p-3 mb-4">
            <FaCertificate className="text-blue-600 text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Certificate Verification</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Verify the authenticity of certificates issued by NKBINFINITY
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiSearch className="mr-2 text-blue-600" />
                  Verify Certificate
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="certificateNo" className="block text-sm font-medium text-gray-700 mb-1">
                      Certificate Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="certificateNo"
                        value={certificateNo}
                        onChange={(e) => setCertificateNo(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., NKBCERT20230001"
                      />
                      <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <button
                    onClick={handleSearch}
                    disabled={loading || !certificateNo.trim()}
                    className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white transition-all ${
                      loading || !certificateNo.trim()
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <FiSearch className="mr-2" />
                        Verify Certificate
                      </>
                    )}
                  </button>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-start">
                      <FaTimesCircle className="mt-0.5 mr-2 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:w-1/2">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiFileText className="mr-2 text-blue-600" />
                  Verification Result
                </h2>

                {certificate ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className={`p-4 text-white flex items-center ${
                      certificate.isValid ? "bg-green-600" : "bg-red-600"
                    }`}>
                      {certificate.isValid ? (
                        <FaCheckCircle className="mr-2 text-xl" />
                      ) : (
                        <FaTimesCircle className="mr-2 text-xl" />
                      )}
                      <span className="font-medium">
                        {certificate.isValid ? "Valid Certificate" : "Invalid Certificate"}
                      </span>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      <div className="flex items-start">
                        <FiUser className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Student Name</p>
                          <p className="font-medium text-gray-800">{certificate.studentName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FiBook className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Course</p>
                          <p className="font-medium text-gray-800">{certificate.courseName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FiClock className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-medium text-gray-800">{certificate.duration}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FiHash className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Certificate No.</p>
                          <p className="font-medium text-gray-800">{certificate.certificateNo}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FiHome className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Institute</p>
                          <p className="font-medium text-gray-800">{certificate.institute}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FiCalendar className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Issued Date</p>
                          <p className="font-medium text-gray-800">
                            {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <FiFileText className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-1">
                      No certificate verified
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Enter a certificate number and click verify to check authenticity
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Having trouble verifying your certificate?{" "}
              <a href="/contact" className="text-blue-600 hover:underline">
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}