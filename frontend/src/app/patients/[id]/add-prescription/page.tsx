'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function AddPrescriptionPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [mode, setMode] = useState<'manual' | 'pdf'>('manual');
  const [formData, setFormData] = useState({
    medicine: '',
    dosage: '',
    time: '',
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in');
        router.push('/login');
        return;
      }

      // 🚀 send manual prescription (you might need a separate API)
      const response = await axios.post(
        'http://localhost:5000/api/auth/prescriptions',
        {
          patientId: params.id,
          ...formData,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ Prescription saved:', response.data);
      router.push(`/patients/${params.id}`);
    } catch (error: any) {
      console.error('❌ Failed to save prescription', error);
      alert(error.response?.data?.message || 'Failed to save prescription');
    }
  };

  const handlePdfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pdfFile) {
      alert('Please upload a PDF file');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in');
        router.push('/login');
        return;
      }

      const formDataUpload = new FormData();
      formDataUpload.append('patientId', params.id);
      formDataUpload.append('file', pdfFile);

      const response = await axios.post(
        'http://localhost:5000/api/auth/scan',
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('✅ PDF uploaded & scanned:', response.data);
      router.push(`/patients/${params.id}`);
    } catch (error: any) {
      console.error('❌ Failed to upload PDF', error);
      alert(error.response?.data?.message || 'Failed to upload prescription');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6">
        Add Prescription for Patient {params.id}
      </h1>

      {/* Mode Toggle */}
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          className={`px-4 py-2 rounded-lg ${
            mode === 'manual'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setMode('manual')}
        >
          ✍️ Manual Entry
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-lg ${
            mode === 'pdf'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setMode('pdf')}
        >
          📄 Upload PDF
        </button>
      </div>

      {/* Manual Form */}
      {mode === 'manual' && (
        <form
          onSubmit={handleManualSubmit}
          className="bg-white shadow rounded-xl p-6 space-y-4 max-w-lg"
        >
          <div>
            <label className="block text-gray-700">Medicine Name</label>
            <input
              type="text"
              required
              className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
              value={formData.medicine}
              onChange={(e) =>
                setFormData({ ...formData, medicine: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-gray-700">Dosage</label>
            <input
              type="text"
              required
              className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
              value={formData.dosage}
              onChange={(e) =>
                setFormData({ ...formData, dosage: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-gray-700">Time</label>
            <input
              type="text"
              required
              className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            Save Prescription
          </button>
        </form>
      )}

      {/* PDF Upload Form */}
      {mode === 'pdf' && (
        <form
          onSubmit={handlePdfSubmit}
          className="bg-white shadow rounded-xl p-6 space-y-4 max-w-lg"
        >
          <div>
            <label className="block text-gray-700">Upload PDF</label>
            <input
              type="file"
              accept="application/pdf"
              required
              className="w-full border rounded-lg px-4 py-2 mt-1"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            />
          </div>
          <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
            Upload & Scan
          </button>
        </form>
      )}
    </div>
  );
}
