"use client";

import { useState } from "react";

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

  const handleSearch = async () => {
    if (!certificateNo.trim()) {
      setError("Please enter a valid certificate number.");
      return;
    }

    setError("");
    setCertificate(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/certificate?certificateNo=${encodeURIComponent(certificateNo)}`);
      const data = await response.json();
      if (response.ok) {
        setCertificate(data);
      } else {
        setError(data.error || "Certificate not found.");
      }
    } catch (err) {
      setError("An error occurred while verifying. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container">
        <h2 className="text-3xl font-extrabold text-secondary text-center">
          Certificate Verification
        </h2>
        <div className="mt-8 max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="space-y-4">
            <div>
              <label htmlFor="certificateNo" className="block text-sm font-medium text-secondary">
                Certificate Number
              </label>
              <input
                type="text"
                id="certificateNo"
                value={certificateNo}
                onChange={(e) => setCertificateNo(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="e.g., A2025778"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !certificateNo.trim()}
              className="w-full bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify Certificate"}
            </button>
            {error && <p className="text-red-600 text-center text-sm">{error}</p>}
            {certificate && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-secondary">Certificate Details</h3>
                <div className="mt-2 space-y-2 text-gray-600">
                  <p><strong>Student Name:</strong> {certificate.studentName}</p>
                  <p><strong>Course:</strong> {certificate.courseName}</p>
                  <p><strong>Duration:</strong> {certificate.duration}</p>
                  <p><strong>Certificate No:</strong> {certificate.certificateNo}</p>
                  <p><strong>Father's Name:</strong> {certificate.fathersName}</p>
                  <p><strong>Institute:</strong> {certificate.institute}</p>
                  <p><strong>Registration No:</strong> {certificate.registrationNo}</p>
                  <p><strong>Issued At:</strong> {new Date(certificate.issuedAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}