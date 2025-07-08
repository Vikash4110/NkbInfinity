/* eslint-disable */
"use client";

import axios from "axios";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaCertificate, FaEdit, FaPlus, FaSearch, FaSignOutAlt, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";

interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  duration: string;
  certificateNo: string;
  fathersName: string;
  institute: string;
  registrationNo: string;
  issuedAt: string;
}

export default function AdminDashboard() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [form, setForm] = useState({
    studentName: "",
    courseName: "",
    duration: "",
    certificateNo: "",
    fathersName: "",
    institute: "",
    registrationNo: "",
    issuedAt: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get("/api/admin/certificates", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCertificates(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/admin/login");
      } else {
        setError(err.response?.data?.error || "Failed to fetch certificates");
      }
    }
  };

  const validateForm = () => {
    if (!form.studentName?.trim()) return "Student name is required";
    if (!form.courseName?.trim()) return "Course name is required";
    if (!form.duration?.trim()) return "Duration is required";
    if (!form.certificateNo?.trim()) return "Certificate number is required";
    if (!form.fathersName?.trim()) return "Father's name is required";
    if (!form.institute?.trim()) return "Institute is required";
    if (!form.registrationNo?.trim()) return "Registration number is required";
    if (!form.issuedAt?.trim()) return "Issued date is required";
    if (isNaN(new Date(form.issuedAt).getTime())) return "Valid issued date is required (YYYY-MM-DD)";
    return null;
  };

  const validateBulkRecord = (record: any, index: number) => {
    const requiredFields = [
      "studentName",
      "courseName",
      "duration",
      "certificateNo",
      "fathersName",
      "institute",
      "registrationNo",
      "issuedAt",
    ];
    const missingFields = requiredFields.filter((field) => !record[field] || String(record[field]).trim() === "");
    if (missingFields.length > 0) {
      return `Row ${index + 2}: Missing fields - ${missingFields.join(", ")}`;
    }

    let issuedDate: Date;
    if (typeof record.issuedAt === "number") {
      // Handle Excel serial date
      const excelEpoch = new Date(1899, 11, 30);
      issuedDate = new Date(excelEpoch.getTime() + record.issuedAt * 24 * 60 * 60 * 1000);
    } else {
      issuedDate = new Date(record.issuedAt);
    }

    if (isNaN(issuedDate.getTime())) {
      return `Row ${index + 2}: Invalid date format for issuedAt (${record.issuedAt})`;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      console.log("Submitting form data:", form); // Debugging log
      const payload = {
        studentName: form.studentName.trim(),
        courseName: form.courseName.trim(),
        duration: form.duration.trim(),
        certificateNo: form.certificateNo.trim(),
        fathersName: form.fathersName.trim(),
        institute: form.institute.trim(),
        registrationNo: form.registrationNo.trim(),
        issuedAt: new Date(form.issuedAt).toISOString(),
      };

      if (editingId) {
        await axios.put(`/api/admin/certificate/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSuccess("Certificate updated successfully");
      } else {
        await axios.post("/api/admin/certificates", payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSuccess("Certificate created successfully");
      }

      setForm({
        studentName: "",
        courseName: "",
        duration: "",
        certificateNo: "",
        fathersName: "",
        institute: "",
        registrationNo: "",
        issuedAt: "",
      });
      setEditingId(null);
      fetchCertificates();
    } catch (err: any) {
      console.error("Form submission error:", err.response?.data || err); // Debugging log
      setError(err.response?.data?.error || "Failed to save certificate");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const file = e.target.files?.[0];
    if (!file) {
      setError("No file selected");
      setLoading(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array", cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const records: any[] = XLSX.utils.sheet_to_json(sheet, { raw: false, dateNF: "yyyy-mm-dd" });

        console.log("Parsed Excel records:", records); // Debugging log

        const errors: string[] = [];
        const validRecords = records
          .map((record, index) => {
            const error = validateBulkRecord(record, index);
            if (error) {
              errors.push(error);
              return null;
            }

            return {
              studentName: String(record.studentName).trim(),
              courseName: String(record.courseName).trim(),
              duration: String(record.duration).trim(),
              certificateNo: String(record.certificateNo).trim(),
              fathersName: String(record.fathersName).trim(),
              institute: String(record.institute).trim(),
              registrationNo: String(record.registrationNo).trim(),
              issuedAt:
                typeof record.issuedAt === "number"
                  ? new Date(new Date(1899, 11, 30).getTime() + record.issuedAt * 24 * 60 * 60 * 1000).toISOString()
                  : new Date(record.issuedAt).toISOString(),
            };
          })
          .filter((record): record is NonNullable<typeof record> => record !== null);

        if (errors.length > 0) {
          setError(`Invalid records:\n${errors.slice(0, 5).join("\n")}${errors.length > 5 ? "\n...and more" : ""}`);
          setLoading(false);
          return;
        }

        if (validRecords.length === 0) {
          setError("No valid records found in the Excel file");
          setLoading(false);
          return;
        }

        try {
          console.log("Sending bulk upload payload:", validRecords); // Debugging log
          const response = await axios.post(
            "/api/admin/certificates",
            { certificates: validRecords },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          setSuccess(`Successfully uploaded ${response.data.length} certificates`);
          fetchCertificates();
        } catch (err: any) {
          console.error("Bulk upload server error:", err.response?.data || err); // Debugging log
          setError(err.response?.data?.error || "Failed to upload certificates");
        } finally {
          setLoading(false);
          e.target.value = ""; // Reset file input
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err: any) {
      console.error("Bulk upload processing error:", err); // Debugging log
      setError("Failed to process Excel file. Ensure it has the correct format.");
      setLoading(false);
    }
  };

  const handleEdit = (certificate: Certificate) => {
    setEditingId(certificate.id);
    setForm({
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      duration: certificate.duration,
      certificateNo: certificate.certificateNo,
      fathersName: certificate.fathersName,
      institute: certificate.institute,
      registrationNo: certificate.registrationNo,
      issuedAt: new Date(certificate.issuedAt).toISOString().split("T")[0],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    try {
      await axios.delete(`/api/admin/certificate/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuccess("Certificate deleted successfully");
      fetchCertificates();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete certificate");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  const handleInputChange = (key: string, value: string) => {
    console.log("Input change:", { key, value }); // Debugging log
    setForm((prev) => ({ ...prev, [key]: value || "" }));
  };

  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const filteredCertificates = useMemo(() => {
    return certificates.filter(
      (cert) =>
        cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificateNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [certificates, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaCertificate className="text-primary text-xl" />
            </div>
            <h1 className="text-xl font-bold text-secondary">Certificate Admin</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-secondary hover:text-gray-900 transition-colors"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error/Success Message */}
        {error && (
          <div className="mb-6 p-4 rounded border-l-4 whitespace-pre-wrap" style={{ backgroundColor: "#fef2f2", borderColor: "#ef4444" }}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="#ef4444" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm" style={{ color: "#b91c1c" }}>{error}</p>
              </div>
            </div>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded border-l-4" style={{ backgroundColor: "#f0fdf4", borderColor: "#22c55e" }}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="#22c55e" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm" style={{ color: "#166534" }}>{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        <section className="mb-12 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-secondary">
              {editingId ? "Edit Certificate" : "Create New Certificate"}
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    value={form.studentName}
                    onChange={(e) => handleInputChange("studentName", e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:ring-primary focus:border-primary"
                    placeholder="Enter student name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
                    Course Name
                  </label>
                  <input
                    type="text"
                    id="courseName"
                    value={form.courseName}
                    onChange={(e) => handleInputChange("courseName", e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:ring-primary focus:border-primary"
                    placeholder="Enter course name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    id="duration"
                    value={form.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:ring-primary focus:border-primary"
                    placeholder="e.g., 02-06-25 to 30-06-2025"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="certificateNo" className="block text-sm font-medium text-gray-700 mb-1">
                    Certificate No
                  </label>
                  <input
                    type="text"
                    id="certificateNo"
                    value={form.certificateNo}
                    onChange={(e) => handleInputChange("certificateNo", e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:ring-primary focus:border-primary"
                    placeholder="e.g., A2025778"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="fathersName" className="block text-sm font-medium text-gray-700 mb-1">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    id="fathersName"
                    value={form.fathersName}
                    onChange={(e) => handleInputChange("fathersName", e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:ring-primary focus:border-primary"
                    placeholder="Enter father's name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="institute" className="block text-sm font-medium text-gray-700 mb-1">
                    Institute
                  </label>
                  <input
                    type="text"
                    id="institute"
                    value={form.institute}
                    onChange={(e) => handleInputChange("institute", e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:ring-primary focus:border-primary"
                    placeholder="Enter institute name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="registrationNo" className="block text-sm font-medium text-gray-700 mb-1">
                    Registration No
                  </label>
                  <input
                    type="text"
                    id="registrationNo"
                    value={form.registrationNo}
                    onChange={(e) => handleInputChange("registrationNo", e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:ring-primary focus:border-primary"
                    placeholder="e.g., 1401524057"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="issuedAt" className="block text-sm font-medium text-gray-700 mb-1">
                    Issued Date
                  </label>
                  <input
                    type="date"
                    id="issuedAt"
                    value={form.issuedAt}
                    onChange={(e) => handleInputChange("issuedAt", e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <label htmlFor="excelUpload" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Excel
                  </label>
                  <input
                    type="file"
                    id="excelUpload"
                    accept=".xlsx,.xls"
                    onChange={handleBulkUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-blue-700"
                    disabled={loading}
                  />
                </div>
                <div className="flex">
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setForm({
                          studentName: "",
                          courseName: "",
                          duration: "",
                          certificateNo: "",
                          fathersName: "",
                          institute: "",
                          registrationNo: "",
                          issuedAt: "",
                        });
                      }}
                      className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        {editingId ? (
                          <>
                            <FaEdit className="-ml-1 mr-2 h-5 w-5" />
                            Update Certificate
                          </>
                        ) : (
                          <>
                            <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                            Add Certificate
                          </>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Certificates List Section */}
        <section className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-secondary">Certificates</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search certificates..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                onChange={(e) => debouncedSetSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            {filteredCertificates.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-secondary">No certificates</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? "No certificates match your search." : "Get started by creating a new certificate."}
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider"
                    >
                      Student Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider"
                    >
                      Course
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider"
                    >
                      Certificate No
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider"
                    >
                      Issued Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-secondary uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCertificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary">
                        {cert.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cert.courseName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cert.certificateNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(cert.issuedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(cert)}
                          className="text-primary hover:text-blue-700 mr-4"
                        >
                          <FaEdit className="inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(cert.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}