'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import axios from 'axios';

interface PrescriptionItem {
  medicine: string;
  dosage: string;
  status?: string;
  expiry_date?: string | null;
  image?: File | null; // local image
}

export default function PreviewPrescription() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<PrescriptionItem[]>([]);

  // ✅ Load prescription data from query param
  useEffect(() => {
    const raw = searchParams.get('data');
    if (raw) {
      try {
        setItems(JSON.parse(raw));
      } catch {
        console.error('Invalid prescription data');
      }
    }
  }, [searchParams]);

  // ✅ Update a single field
  const handleChange = (index: number, field: keyof PrescriptionItem, value: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  // ✅ Save all prescriptions to backend
  const handleSave = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('Please login');
    router.push('/login');
    return;
  }

  const rawId = (params as any).id;
  const patientId = Array.isArray(rawId) ? rawId[0] : rawId;

  // Build JSON payload exactly as backend expects
  const payload = {
    prescription: items.map((item) => ({
      image: item.image instanceof File ? item.image.name : item.image, // or null if no image
      medicine: item.medicine,
      dosage: item.dosage,
      expiry_date: item.expiry_date ?? '',
      status: item.status ?? 'Active',
    })),
  };

  try {
    await axios.post(
      `http://localhost:5000/api/auth/prescriptions/${patientId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    router.push(`/patients/${patientId}`);
  } catch (error: any) {
    console.error('❌ Failed to save prescriptions', error);
    alert(error.response?.data?.message || 'Failed to save prescriptions');
  }
};


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Preview & Edit Prescription</h1>

      <div className="space-y-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center"
          >
            {/* Image Upload */}
            <div>
              {item.image ? (
                <img
                  src={URL.createObjectURL(item.image)}
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
                onChange={(e) =>
                  handleChange(idx, 'image', e.target.files?.[0] || null)
                }
              />
            </div>

            {/* Editable Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={item.medicine}
                onChange={(e) => handleChange(idx, 'medicine', e.target.value)}
                className="border rounded p-2 w-full"
                placeholder="Medicine Name"
              />
              <input
                value={item.dosage}
                onChange={(e) => handleChange(idx, 'dosage', e.target.value)}
                className="border rounded p-2 w-full"
                placeholder="Dosage"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => router.back()}
          className="bg-gray-300 px-6 py-2 rounded"
        >
          ← Back
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save All
        </button>
      </div>
    </div>
  );
}
