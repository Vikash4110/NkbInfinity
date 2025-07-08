// /* eslint-disable */
// "use client";
// import { debounce } from "lodash";
// import { useCallback, useState } from "react";
// import { FaCertificate, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// import { FiBook, FiCalendar, FiClock, FiFileText, FiHash, FiHome, FiSearch, FiUser } from "react-icons/fi";

// interface Certificate {
//   studentName: string;
//   courseName: string;
//   duration: string;
//   certificateNo: string;
//   fathersName: string;
//   institute: string;
//   registrationNo: string;
//   issuedAt: string;
// }

// export default function Certificate() {
//   const [certificateNo, setCertificateNo] = useState("");
//   const [certificate, setCertificate] = useState<Certificate | null>(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const fetchCertificate = useCallback(
//     debounce(async (certNo: string) => {
//       if (!certNo.trim()) {
//         setError("Please enter a valid certificate number.");
//         setLoading(false);
//         return;
//       }

//       setError("");
//       setCertificate(null);
//       setLoading(true);

//       try {
//         const response = await fetch(`/api/certificate?certificateNo=${encodeURIComponent(certNo)}`);
//         const data = await response.json();
//         if (response.ok) {
//           setCertificate(data);
//         } else {
//           setError(data.error || "Certificate not found.");
//         }
//       } catch (err) {
//         console.error("Verification error:", err);
//         setError("An error occurred while verifying. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }, 300),
//     []
//   );

//   const handleSearch = () => {
//     fetchCertificate(certificateNo);
//   };

//   return (
//     <section className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center justify-center bg-blue-100 rounded-full p-3 mb-4">
//             <FaCertificate className="text-blue-600 text-3xl" />
//           </div>
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">Certificate Verification</h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Verify the authenticity of certificates issued by NKBINFINITY
//           </p>
//         </div>

//         <div className="bg-white rounded-xl shadow-xl overflow-hidden">
//           <div className="p-6 md:p-8">
//             <div className="flex flex-col md:flex-row gap-6">
//               <div className="md:w-1/2">
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                   <FiSearch className="mr-2 text-blue-600" />
//                   Verify Certificate
//                 </h2>
                
//                 <div className="space-y-4">
//                   <div>
//                     <label htmlFor="certificateNo" className="block text-sm font-medium text-gray-700 mb-1">
//                       Certificate Number
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         id="certificateNo"
//                         value={certificateNo}
//                         onChange={(e) => setCertificateNo(e.target.value)}
//                         className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="e.g., A2025778"
//                       />
//                       <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     </div>
//                   </div>

//                   <button
//                     onClick={handleSearch}
//                     disabled={loading || !certificateNo.trim()}
//                     className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white transition-all ${
//                       loading || !certificateNo.trim()
//                         ? "bg-blue-300 cursor-not-allowed"
//                         : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
//                     }`}
//                   >
//                     {loading ? (
//                       <>
//                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Verifying...
//                       </>
//                     ) : (
//                       <>
//                         <FiSearch className="mr-2" />
//                         Verify Certificate
//                       </>
//                     )}
//                   </button>

//                   {error && (
//                     <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-start">
//                       <FaTimesCircle className="mt-0.5 mr-2 flex-shrink-0" />
//                       <span>{error}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="md:w-1/2">
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                   <FiFileText className="mr-2 text-blue-600" />
//                   Verification Result
//                 </h2>

//                 {certificate ? (
//                   <div className="border border-gray-200 rounded-lg overflow-hidden">
//                     <div className="p-4 bg-green-600 text-white flex items-center">
//                       <FaCheckCircle className="mr-2 text-xl" />
//                       <span className="font-medium">Valid Certificate</span>
//                     </div>
                    
//                     <div className="p-4 space-y-4">
//                       <div className="flex items-start">
//                         <FiUser className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
//                         <div>
//                           <p className="text-sm text-gray-500">Student Name</p>
//                           <p className="font-medium text-gray-800">{certificate.studentName}</p>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-start">
//                         <FiBook className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
//                         <div>
//                           <p className="text-sm text-gray-500">Course</p>
//                           <p className="font-medium text-gray-800">{certificate.courseName}</p>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-start">
//                         <FiClock className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
//                         <div>
//                           <p className="text-sm text-gray-500">Duration</p>
//                           <p className="font-medium text-gray-800">{certificate.duration}</p>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-start">
//                         <FiHash className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
//                         <div>
//                           <p className="text-sm text-gray-500">Certificate No.</p>
//                           <p className="font-medium text-gray-800">{certificate.certificateNo}</p>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-start">
//                         <FiUser className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
//                         <div>
//                           <p className="text-sm text-gray-500">Father's Name</p>
//                           <p className="font-medium text-gray-800">{certificate.fathersName}</p>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-start">
//                         <FiHome className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
//                         <div>
//                           <p className="text-sm text-gray-500">Institute</p>
//                           <p className="font-medium text-gray-800">{certificate.institute}</p>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-start">
//                         <FiHash className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
//                         <div>
//                           <p className="text-sm text-gray-500">Registration No.</p>
//                           <p className="font-medium text-gray-800">{certificate.registrationNo}</p>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-start">
//                         <FiCalendar className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
//                         <div>
//                           <p className="text-sm text-gray-500">Issued Date</p>
//                           <p className="font-medium text-gray-800">
//                             {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
//                               year: 'numeric',
//                               month: 'long',
//                               day: 'numeric'
//                             })}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="bg-gray-50 rounded-lg p-8 text-center">
//                     <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
//                       <FiFileText className="text-gray-400 text-2xl" />
//                     </div>
//                     <h3 className="text-lg font-medium text-gray-700 mb-1">
//                       No certificate verified
//                     </h3>
//                     <p className="text-gray-500 text-sm">
//                       Enter a certificate number and click verify to check authenticity
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
//             <p className="text-sm text-gray-500 text-center">
//               Having trouble verifying your certificate?{" "}
//               <a href="/contact" className="text-blue-600 hover:underline">
//                 Contact our support team
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

/* eslint-disable */
"use client";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { FaCertificate, FaCheckCircle, FaRegQuestionCircle, FaTimesCircle } from "react-icons/fa";
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
}

export default function Certificate() {
  const [certificateNo, setCertificateNo] = useState("");
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCertificate = useCallback(
    debounce(async (certNo: string) => {
      if (!certNo.trim()) {
        setError("Please enter a valid certificate number.");
        setLoading(false);
        return;
      }

      setError("");
      setCertificate(null);
      setLoading(true);

      try {
        const response = await fetch(`/api/certificate?certificateNo=${encodeURIComponent(certNo)}`);
        const data = await response.json();
        if (response.ok) {
          setCertificate(data);
        } else {
          setError(data.error || "Certificate not found. Please check the number and try again.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("An error occurred while verifying. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCertificate(certificateNo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-white rounded-full p-4 mb-6 shadow-md">
            <FaCertificate className="text-blue-600 text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Certificate Verification Portal
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Verify the authenticity of certificates issued by <span className="font-semibold text-blue-600">NKBINFINITY</span>. 
            Enter the certificate number below to validate its details.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <FiSearch className="mr-3" />
                Certificate Verification System
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-blue-100 text-sm bg-blue-500 bg-opacity-30 px-3 py-1 rounded-full">
                  Secure Connection
                </span>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Search Section */}
              <div className="lg:border-r lg:border-gray-200 lg:pr-8">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-1 flex items-center">
                    <FiSearch className="mr-2 text-blue-600" />
                    Verify Certificate
                  </h3>
                  <p className="text-sm text-gray-500">
                    Enter the certificate number exactly as it appears on the document
                  </p>
                </div>

                <form onSubmit={handleSearch}>
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="certificateNo" className="block text-sm font-medium text-gray-700 mb-2">
                        Certificate Number
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiHash className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="certificateNo"
                          value={certificateNo}
                          onChange={(e) => setCertificateNo(e.target.value)}
                          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g., NKB-2023-XXXXXX"
                          aria-describedby="certificate-number-help"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500"
                            onClick={() => {
                              setCertificateNo("");
                              setError("");
                              setCertificate(null);
                            }}
                          >
                            <FaTimesCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p id="certificate-number-help" className="mt-2 text-sm text-gray-500">
                        Usually 8-12 characters including letters and numbers
                      </p>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={loading || !certificateNo.trim()}
                        className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white transition-all ${
                          loading || !certificateNo.trim()
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
                    </div>

                    {error && (
                      <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FaTimesCircle className="h-5 w-5 text-red-400" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Verification Error</h3>
                            <div className="mt-2 text-sm text-red-700">
                              <p>{error}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </form>

                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <FaRegQuestionCircle className="mr-2 text-blue-500" />
                    Need help finding your certificate number?
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Located at the bottom of your certificate document
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Typically begins with "A" followed by numbers
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Contact support if you can't locate your number
                    </li>
                  </ul>
                </div>
              </div>

              {/* Results Section */}
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-1 flex items-center">
                    <FiFileText className="mr-2 text-blue-600" />
                    Verification Results
                  </h3>
                  <p className="text-sm text-gray-500">
                    {certificate ? "Certificate details verified successfully" : "Results will appear here after verification"}
                  </p>
                </div>

                {certificate ? (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <FaCheckCircle className="mr-3 text-xl" />
                        <span className="font-medium">Valid Certificate Verified</span>
                      </div>
                      <span className="text-sm bg-blue-700 bg-opacity-20 px-2 py-1 rounded">
                        Authentic
                      </span>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <div className="bg-blue-50 p-2 rounded-lg mr-3">
                            <FiUser className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</p>
                            <p className="font-medium text-gray-900 mt-1">{certificate.studentName}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-blue-50 p-2 rounded-lg mr-3">
                            <FiBook className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Course</p>
                            <p className="font-medium text-gray-900 mt-1">{certificate.courseName}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-blue-50 p-2 rounded-lg mr-3">
                            <FiClock className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</p>
                            <p className="font-medium text-gray-900 mt-1">{certificate.duration}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-blue-50 p-2 rounded-lg mr-3">
                            <FiHash className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate No.</p>
                            <p className="font-medium text-gray-900 mt-1">{certificate.certificateNo}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-start">
                            <div className="bg-blue-50 p-2 rounded-lg mr-3">
                              <FiUser className="text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Father's Name</p>
                              <p className="font-medium text-gray-900 mt-1">{certificate.fathersName}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-blue-50 p-2 rounded-lg mr-3">
                              <FiHome className="text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Institute</p>
                              <p className="font-medium text-gray-900 mt-1">{certificate.institute}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-blue-50 p-2 rounded-lg mr-3">
                              <FiHash className="text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Registration No.</p>
                              <p className="font-medium text-gray-900 mt-1">{certificate.registrationNo}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-blue-50 p-2 rounded-lg mr-3">
                              <FiCalendar className="text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Issued Date</p>
                              <p className="font-medium text-gray-900 mt-1">
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
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
                    <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-inner">
                      <FiFileText className="text-gray-400 text-3xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      {error ? "Verification Failed" : "No Certificate Verified"}
                    </h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                      {error 
                        ? "The certificate could not be verified. Please check the number and try again."
                        : "Enter a valid certificate number and click verify to check the authenticity of your document."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 mb-2 md:mb-0">
                © {new Date().getFullYear()} NKBINFINITY. All rights reserved.
              </p>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}