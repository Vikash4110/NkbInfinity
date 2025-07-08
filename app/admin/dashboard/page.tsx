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
        handleLogout();
      } else {
        setError(err.response?.data?.error || "Failed to fetch certificates");
      }
    }
  };

  const validateCertificate = (data: typeof form) => {
    if (!data.studentName?.trim()) return "Student name is required";
    if (!data.courseName?.trim()) return "Course name is required";
    if (!data.duration?.trim()) return "Duration is required";
    if (!data.certificateNo?.trim()) return "Certificate number is required";
    if (!data.fathersName?.trim()) return "Father's name is required";
    if (!data.institute?.trim()) return "Institute is required";
    if (!data.registrationNo?.trim()) return "Registration number is required";
    if (!data.issuedAt) return "Issued date is required";
    
    const issuedDate = new Date(data.issuedAt);
    if (isNaN(issuedDate.getTime())) return "Valid issued date is required (YYYY-MM-DD)";
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const validationError = validateCertificate(form);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...form,
        issuedAt: new Date(form.issuedAt).toISOString()
      };

      if (editingId) {
        await axios.put(`/api/admin/certificates/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSuccess("Certificate updated successfully");
      } else {
        await axios.post("/api/admin/certificates", payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSuccess("Certificate created successfully");
      }

      resetForm();
      fetchCertificates();
    } catch (err: any) {
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
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const records: any[] = XLSX.utils.sheet_to_json(sheet);

    // Enhanced validation
    const errors: string[] = [];
    const validRecords = records.map((record, index) => {
      // Check for missing fields
      const missingFields = [
        'studentName', 'courseName', 'duration', 
        'certificateNo', 'fathersName', 
        'institute', 'registrationNo', 'issuedAt'
      ].filter(field => !record[field]);

      if (missingFields.length > 0) {
        errors.push(`Row ${index + 2}: Missing fields - ${missingFields.join(', ')}`);
        return null;
      }

      // Format dates properly
      let issuedDate;
      try {
        // Handle Excel date serial numbers (if dates come as numbers)
        if (typeof record.issuedAt === 'number') {
          issuedDate = new Date((record.issuedAt - (25567 + 1)) * 86400 * 1000);
        } else {
          issuedDate = new Date(record.issuedAt);
        }
        
        if (isNaN(issuedDate.getTime())) {
          errors.push(`Row ${index + 2}: Invalid date format for issuedAt (${record.issuedAt})`);
          return null;
        }
      } catch (dateError) {
        errors.push(`Row ${index + 2}: Date parsing error - ${record.issuedAt}`);
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
        issuedAt: issuedDate.toISOString(),
      };
    }).filter(record => record !== null);

    if (errors.length > 0) {
      setError(`Found ${errors.length} errors in Excel file:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? '\n...and more' : ''}`);
      setLoading(false);
      return;
    }

    if (!validRecords.length) {
      setError("No valid records found after validation");
      setLoading(false);
      return;
    }

    const response = await axios.post(
      "/api/admin/certificates",
      { certificates: validRecords },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    setSuccess(`Successfully uploaded ${validRecords.length} certificates`);
    fetchCertificates();
  } catch (err: any) {
    console.error("Bulk upload error:", err);
    setError(err.response?.data?.error || "Failed to process Excel file. Please check the format.");
  } finally {
    setLoading(false);
    if (e.target) e.target.value = "";
  }
};

  const resetForm = () => {
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
      issuedAt: certificate.issuedAt.split("T")[0],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    
    try {
      await axios.delete(`/api/admin/certificates/${id}`, {
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

  const handleInputChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  const filteredCertificates = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return certificates.filter(cert =>
      cert.studentName.toLowerCase().includes(term) ||
      cert.courseName.toLowerCase().includes(term) ||
      cert.certificateNo.toLowerCase().includes(term)
    );
  }, [certificates, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaCertificate className="text-blue-600 text-xl" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Certificate Admin</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg border border-green-100">
            {success}
          </div>
        )}

        <section className="mb-12 bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b">
            <h2 className="text-lg font-medium text-gray-800">
              {editingId ? "Edit Certificate" : "Create New Certificate"}
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={form.studentName}
                    onChange={(e) => handleInputChange("studentName", e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={form.courseName}
                    onChange={(e) => handleInputChange("courseName", e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certificate No
                  </label>
                  <input
                    type="text"
                    value={form.certificateNo}
                    onChange={(e) => handleInputChange("certificateNo", e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    value={form.fathersName}
                    onChange={(e) => handleInputChange("fathersName", e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institute
                  </label>
                  <input
                    type="text"
                    value={form.institute}
                    onChange={(e) => handleInputChange("institute", e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration No
                  </label>
                  <input
                    type="text"
                    value={form.registrationNo}
                    onChange={(e) => handleInputChange("registrationNo", e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issued Date
                  </label>
                  <input
                    type="date"
                    value={form.issuedAt}
                    onChange={(e) => handleInputChange("issuedAt", e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Excel
                  </label>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleBulkUpload}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    disabled={loading}
                  />
                </div>
                <div className="flex">
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="mr-4 px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-75"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : editingId ? (
                      <>
                        <FaEdit className="-ml-1 mr-2" />
                        Update
                      </>
                    ) : (
                      <>
                        <FaPlus className="-ml-1 mr-2" />
                        Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Certificates</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => debouncedSetSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            {filteredCertificates.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-800">
                  {searchTerm ? "No matching certificates" : "No certificates found"}
                </h3>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Certificate No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issued Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCertificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
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
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(cert.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
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