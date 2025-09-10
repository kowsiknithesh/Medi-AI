'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

export default function AddPatientPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({ name: '', age: '', condition: '' });

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    console.log("New patient added:", formData);

    router.push('/dashboard'); // redirect back after adding

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
        <div>
          <label className="block text-gray-700">Patient Name</label>
          <input

            type="text"

            required

            className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"

            value={formData.name}

            onChange={(e) => setFormData({ ...formData, name: e.target.value })}

          />
        </div>
        <div>
          <label className="block text-gray-700">Age</label>
          <input

            type="number"

            required

            className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"

            value={formData.age}

            onChange={(e) => setFormData({ ...formData, age: e.target.value })}

          />
        </div>
        <div>
          <label className="block text-gray-700">Condition</label>
          <input

            type="text"

            required

            className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"

            value={formData.condition}

            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}

          />
        </div>
        <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">

          Save Patient
        </button>
      </form>
    </div>

  );

}

