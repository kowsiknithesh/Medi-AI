'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AddPatientPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    condition: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Get token from localStorage
      const token = localStorage.getItem('authToken');

      if (!token) {
        alert('You must be logged in!');
        router.push('/login');
        return;
      }

      // 2. Send patient data to backend
      const response = await axios.post(
        'http://localhost:5000/api/auth/patients',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('✅ New patient added:', response.data);

      // 3. Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('❌ Failed to add patient', error);
      alert(error.response?.data?.message || 'Failed to add patient');
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

      <h1 className="text-2xl font-bold mb-6">Add New Patient</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 space-y-4 max-w-lg"
      >
        {/* Patient Name */}
        <div>
          <label className="block text-gray-700">Patient Name</label>
          <input
            type="text"
            required
            className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>


        {/* Age */}
        <div>
          <label className="block text-gray-700">Age</label>
          <input
            type="number"
            required
            className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
            value={formData.age}
            onChange={(e) =>
              setFormData({ ...formData, age: e.target.value })
            }
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-gray-700">Condition</label>
          <input
            type="text"
            required
            className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
            value={formData.condition}
            onChange={(e) =>
              setFormData({ ...formData, condition: e.target.value })
            }
          />
        </div>

        {/* WhatsApp Number */}
        <div>
          <label className="block text-gray-700">WhatsApp Number</label>
          <input
            type="tel"
            required
            placeholder="+91XXXXXXXXXX"
            className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
          Save Patient
        </button>
      </form>
    </div>
  );
}
