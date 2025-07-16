/* eslint-disable */
// admin/dashboard/page.tsx
"use client";

import axios from "axios";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaBook, FaCalendarAlt, FaCertificate, FaEdit, FaFileExcel, FaIdCard, FaPlus, FaSearch, FaSignOutAlt, FaTrash, FaUserGraduate } from "react-icons/fa";
import { FiClock, FiHome, FiUser } from "react-icons/fi";
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
  const router = useRouter();
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
  const [stats, setStats] = useState({
    total: 0,
    recent: 0,
    loading: true
  });

  // Fetch certificates on component mount
  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setStats(prev => ({...prev, loading: true}));
      const response = await axios.get("/api/admin/certificates", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      setCertificates(response.data);
      setStats({
        total: response.data.length,
        recent: response.data.filter((cert: Certificate) => 
          new Date(cert.issuedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
        loading: false
      });
    } catch (err: any) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError(err.response?.data?.error || "Failed to fetch certificates");
      }
      setStats(prev => ({...prev, loading: false}));
    }
  };

 const validateForm = () => {
  const requiredFields = [
    { field: "studentName", name: "Student name" },
    { field: "courseName", name: "Course name" },
    { field: "duration", name: "Duration" },
    { field: "certificateNo", name: "Certificate number" },
    { field: "fathersName", name: "Father's name" },
    { field: "institute", name: "Institute" },
    { field: "registrationNo", name: "Registration number" },
    { field: "issuedAt", name: "Issued date" }
  ];

  for (const {field, name} of requiredFields) {
    if (!form[field as keyof typeof form]?.trim()) {
      return `${name} is required`;
    }
  }

  if (isNaN(new Date(form.issuedAt).getTime())) {
    return "Valid issued date is required (YYYY-MM-DD)";
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

    resetForm();
    fetchCertificates();
  } catch (err: any) {
    // Update error message handling
    setError(err.response?.data?.error.includes("Certificate number") 
      ? "Certificate number already exists" 
      : "Failed to save certificate");
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
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array", cellDates: true });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const records: any[] = XLSX.utils.sheet_to_json(sheet, { raw: false, dateNF: "yyyy-mm-dd" });

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
                issuedAt: getValidDate(record.issuedAt).toISOString(),
              };
            })
            .filter(record => record !== null);

          if (errors.length > 0) {
            setError(`Invalid records:\n${errors.slice(0, 5).join("\n")}${errors.length > 5 ? "\n...and more" : ""}`);
            return;
          }

          if (validRecords.length === 0) {
            setError("No valid records found in the Excel file");
            return;
          }

          const response = await axios.post(
            "/api/admin/certificates",
            { certificates: validRecords },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          
          setSuccess(`Successfully uploaded ${response.data.length} certificates`);
          fetchCertificates();
        } catch (err: any) {
          setError(err.response?.data?.error || "Failed to upload certificates");
        } finally {
          setLoading(false);
          e.target.value = "";
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError("Failed to process Excel file. Ensure it has the correct format.");
      setLoading(false);
    }
  };

  const validateBulkRecord = (record: any, index: number) => {
    const requiredFields = [
      "studentName", "courseName", "duration", "certificateNo",
      "fathersName", "institute", "registrationNo", "issuedAt"
    ];
    
    const missingFields = requiredFields.filter(
      field => !record[field] || String(record[field]).trim() === ""
    );
    
    if (missingFields.length > 0) {
      return `Row ${index + 2}: Missing fields - ${missingFields.join(", ")}`;
    }

    const issuedDate = getValidDate(record.issuedAt);
    if (isNaN(issuedDate.getTime())) {
      return `Row ${index + 2}: Invalid date format for issuedAt (${record.issuedAt})`;
    }

    return null;
  };

  const getValidDate = (dateValue: any) => {
    if (typeof dateValue === "number") {
      const excelEpoch = new Date(1899, 11, 30);
      return new Date(excelEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000);
    }
    return new Date(dateValue);
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

  const handleInputChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  const filteredCertificates = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return certificates.filter(
      cert =>
        cert.studentName.toLowerCase().includes(term) ||
        cert.courseName.toLowerCase().includes(term) ||
        cert.certificateNo.toLowerCase().includes(term)
    );
  }, [certificates, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-3 rounded-xl shadow-md">
              <FaCertificate className="text-blue-600 text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-white">Certificate Management System</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <FaSignOutAlt />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={<FaCertificate className="text-blue-600 text-xl" />}
            title="Total Certificates"
            value={stats.loading ? '...' : stats.total}
            color="blue"
          />
          
          <StatCard 
            icon={<FaCalendarAlt className="text-green-600 text-xl" />}
            title="Recent (30 days)"
            value={stats.loading ? '...' : stats.recent}
            color="green"
          />
          
          <StatCard 
            icon={<FaFileExcel className="text-purple-600 text-xl" />}
            title="Bulk Upload"
            action={
              <label className="cursor-pointer text-blue-600 font-medium inline-block">
                Upload Excel
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleBulkUpload}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            }
            color="purple"
          />
        </div>

        {/* Status Messages */}
        <StatusMessage type="error" message={error} onDismiss={() => setError("")} />
        <StatusMessage type="success" message={success} onDismiss={() => setSuccess("")} />

        {/* Form Section */}
        <FormSection 
          editingId={editingId}
          form={form}
          loading={loading}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
        />

        {/* Certificates List Section */}
        <CertificateTable 
          certificates={filteredCertificates}
          totalCertificates={certificates.length}
          searchTerm={searchTerm}
          onSearchChange={(e) => debouncedSetSearchTerm(e.target.value)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}

// Component for Stat Cards
const StatCard = ({ icon, title, value, action, color }: {
  icon: React.ReactNode;
  title: string;
  value?: string | number;
  action?: React.ReactNode;
  color: string;
}) => {
  const bgColors = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    purple: "bg-purple-100"
  };

  const textColors = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600"
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="p-6 flex items-center">
        <div className={`p-4 rounded-full mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {value ? (
            <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          ) : (
            action
          )}
        </div>
      </div>
    </div>
  );
};

// Component for Status Messages
const StatusMessage = ({ type, message, onDismiss }: {
  type: 'error' | 'success';
  message: string;
  onDismiss: () => void;
}) => {
  if (!message) return null;

  const config = {
    error: {
      bg: "bg-red-50",
      border: "border-red-500",
      icon: (
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      ),
      text: "text-red-800"
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-500",
      icon: (
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      ),
      text: "text-green-800"
    }
  };

  return (
    <div className={`mb-6 ${config[type].bg} border-l-4 ${config[type].border} p-4 rounded-lg shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              {config[type].icon}
            </svg>
          </div>
          <div className="ml-3">
            <p className={`text-sm ${config[type].text}`}>{message}</p>
          </div>
        </div>
        <button onClick={onDismiss} className="text-gray-400 hover:text-gray-500">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Component for Form Section
const FormSection = ({ editingId, form, loading, handleInputChange, handleSubmit, resetForm }: {
  editingId: string | null;
  form: any;
  loading: boolean;
  handleInputChange: (key: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
}) => {
  const formFields = [
    {
      id: "studentName",
      label: "Student Name",
      icon: <FaUserGraduate className="text-gray-400" />,
      placeholder: "Enter student name"
    },
    {
      id: "courseName",
      label: "Course Name",
      icon: <FaBook className="text-gray-400" />,
      placeholder: "Enter course name"
    },
    {
      id: "duration",
      label: "Duration",
      icon: <FiClock className="text-gray-400" />,
      placeholder: "e.g., 02-06-25 to 30-06-2025"
    },
    {
      id: "certificateNo",
      label: "Certificate No",
      icon: <FaIdCard className="text-gray-400" />,
      placeholder: "e.g., A2025778"
    },
    {
      id: "fathersName",
      label: "Father's Name",
      icon: <FiUser className="text-gray-400" />,
      placeholder: "Enter father's name"
    },
    {
      id: "institute",
      label: "Institute",
      icon: <FiHome className="text-gray-400" />,
      placeholder: "Enter institute name"
    },
    {
      id: "registrationNo",
      label: "Registration No",
      icon: <FaIdCard className="text-gray-400" />,
      placeholder: "e.g., 1401524057"
    },
    {
      id: "issuedAt",
      label: "Issued Date",
      icon: <FaCalendarAlt className="text-gray-400" />,
      type: "date"
    }
  ];

  return (
    <section className="mb-12 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700">
        <h2 className="text-lg font-medium text-white">
          {editingId ? (
            <span className="flex items-center">
              <FaEdit className="mr-2" /> Edit Certificate
            </span>
          ) : (
            <span className="flex items-center">
              <FaPlus className="mr-2" /> Create New Certificate
            </span>
          )}
        </h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {formFields.map((field) => (
              <div className="relative" key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-5">
                    {field.icon}
                  </div>
                  <input
                    type={field.type || "text"}
                    id={field.id}
                    value={form[field.id]}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={field.placeholder}
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`ml-auto inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              ) : editingId ? (
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
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

// Component for Certificate Table
const CertificateTable = ({ certificates, totalCertificates, searchTerm, onSearchChange, onEdit, onDelete }: {
  certificates: Certificate[];
  totalCertificates: number;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (certificate: Certificate) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <section className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700 flex justify-between items-center">
        <h2 className="text-lg font-medium text-white flex items-center">
          <FaCertificate className="mr-2" />
          Certificate Records
        </h2>
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-300" />
          </div>
          <input
            type="text"
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={onSearchChange}
            className="block w-full pl-10 pr-3 py-2 bg-white bg-opacity-20 text-black placeholder-gray-300 rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:text-sm"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {certificates.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <TableHeader />
              <tbody className="bg-white divide-y divide-gray-200">
                {certificates.map((cert) => (
                  <TableRow 
                    key={cert.id} 
                    certificate={cert} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                  />
                ))}
              </tbody>
            </table>
            <TableFooter 
              showing={certificates.length} 
              total={totalCertificates} 
            />
          </>
        )}
      </div>
    </section>
  );
};

// Component for Empty State
const EmptyState = ({ searchTerm }: { searchTerm: string }) => (
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
    <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates found</h3>
    <p className="mt-1 text-sm text-gray-500">
      {searchTerm ? "Try adjusting your search or filter" : "Get started by creating a new certificate"}
    </p>
  </div>
);

// Component for Table Header
const TableHeader = () => (
  <thead className="bg-gray-50">
    <tr>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Student
      </th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Course
      </th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Certificate No
      </th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Issued Date
      </th>
      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
        Actions
      </th>
    </tr>
  </thead>
);

// Component for Table Row
const TableRow = ({ certificate, onEdit, onDelete }: {
  certificate: Certificate;
  onEdit: (certificate: Certificate) => void;
  onDelete: (id: string) => void;
}) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
          <FaUserGraduate className="text-blue-600" />
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{certificate.studentName}</div>
          <div className="text-sm text-gray-500">{certificate.fathersName}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 font-medium">{certificate.courseName}</div>
      <div className="text-sm text-gray-500">{certificate.duration}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
        {certificate.certificateNo}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button
        onClick={() => onEdit(certificate)}
        className="text-blue-600 hover:text-blue-900 mr-4"
      >
        <FaEdit className="inline" />
      </button>
      <button
        onClick={() => onDelete(certificate.id)}
        className="text-red-600 hover:text-red-900"
      >
        <FaTrash className="inline" />
      </button>
    </td>
  </tr>
);

// Component for Table Footer
const TableFooter = ({ showing, total }: { showing: number; total: number }) => (
  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
    <div className="text-sm text-gray-500">
      Showing <span className="font-medium">1</span> to <span className="font-medium">{showing}</span> of{' '}
      <span className="font-medium">{total}</span> certificates
    </div>
    <div className="flex space-x-4">
      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
        Previous
      </button>
      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
        Next
      </button>
    </div>
  </div>
);