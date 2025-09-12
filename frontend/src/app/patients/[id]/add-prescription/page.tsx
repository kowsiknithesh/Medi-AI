'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

interface PrescriptionItem {
  medicine: string;
  dosage: string;
  status?: string;
  expiry_date?: string;
  time?: string;
  image?: File | string | null;
}

export default function AddPrescriptionPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const patientId = params?.id;

  const [mode, setMode] = useState<'manual' | 'pdf'>('manual');
  const [items, setItems] = useState<PrescriptionItem[]>([
    { medicine: '', dosage: '', status: 'Active', expiry_date: '', time: '', image: null },
  ]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleChange = (index: number, field: keyof PrescriptionItem, value: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  const addRow = () => {
    setItems([
      ...items,
      { medicine: '', dosage: '', status: 'Active', expiry_date: '', time: '', image: null },
    ]);
  };

  const handleManualSave = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please login');
      router.push('/login');
      return;
    }

    const payload = {
      prescription: items.map((item) => ({
        medicine: item.medicine,
        dosage: item.dosage,
        expiry_date: item.expiry_date || '',
        status: item.status || 'Active',
        time: item.time || '',
        image: item.image instanceof File ? item.image.name : item.image || '/dummy-prescription.png',
      })),
    };

    try {
      await axios.post(`http://localhost:5000/api/auth/prescriptions/${patientId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      router.push(`/patients/${patientId}`);
    } catch (error: any) {
      console.error('Failed to save prescriptions', error);
      alert(error.response?.data?.message || 'Failed to save prescriptions');
    }
  };

  const handlePdfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) {
      alert('Please upload a PDF');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please login');
        router.push('/login');
        return;
      }

      const formDataUpload = new FormData();
      formDataUpload.append('patientId', patientId);
      formDataUpload.append('pdf', pdfFile);

      const response = await axios.post('http://localhost:5000/api/auth/scan', formDataUpload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Redirect to preview page with scanned data
      const encoded = encodeURIComponent(JSON.stringify(response.data.prescription));
      router.push(`/patients/${patientId}/preview?data=${encoded}`);
    } catch (error: any) {
      console.error('Failed to upload PDF', error);
      alert(error.response?.data?.message || 'Failed to upload prescription');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button onClick={() => router.back()} className="mb-4 text-blue-600 hover:underline">
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Add Prescription for Patient {patientId}</h1>

      {/* Mode Toggle */}
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          className={`px-4 py-2 rounded-lg ${
            mode === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setMode('manual')}
        >
          ✍️ Manual Entry
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-lg ${
            mode === 'pdf' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setMode('pdf')}
        >
          📄 Upload PDF
        </button>
      </div>

      {/* Manual Entry Table */}
      {mode === 'manual' && (
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white shadow rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start"
            >
              {/* Image */}
              <div>
                {item.image && typeof item.image !== 'string' ? (
                  <img
                    src={URL.createObjectURL(item.image)}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-md"
                  />
                ) : item.image && typeof item.image === 'string' ? (
                  <img
                    src={item.image}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-md"
                  />
                ) : (
                  <div className="h-20 w-20 border rounded-md flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 text-sm"
                  onChange={(e) => handleChange(idx, 'image', e.target.files?.[0] || null)}
                />
              </div>

              {/* Editable Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  value={item.medicine}
                  onChange={(e) => handleChange(idx, 'medicine', e.target.value)}
                  placeholder="Medicine Name"
                  className="border rounded p-2 w-full"
                />
                <input
                  value={item.dosage}
                  onChange={(e) => handleChange(idx, 'dosage', e.target.value)}
                  placeholder="Dosage"
                  className="border rounded p-2 w-full"
                />
                <input
                  value={item.time || ''}
                  onChange={(e) => handleChange(idx, 'time', e.target.value)}
                  placeholder="Time"
                  className="border rounded p-2 w-full"
                />
                <input
                  value={item.expiry_date || ''}
                  onChange={(e) => handleChange(idx, 'expiry_date', e.target.value)}
                  placeholder="Expiry Date"
                  className="border rounded p-2 w-full"
                />
                <select
                  value={item.status || 'Active'}
                  onChange={(e) => handleChange(idx, 'status', e.target.value)}
                  className="border rounded p-2 w-full"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          ))}

          <button
            onClick={addRow}
            className="mt-4 mr-2 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            + Add Row
          </button>

          <button
            onClick={handleManualSave}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
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
