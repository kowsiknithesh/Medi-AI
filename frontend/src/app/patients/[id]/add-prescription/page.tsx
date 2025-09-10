'use client';

import React, { useState } from 'react';

import { useParams, useRouter } from 'next/navigation';
 
export default function AddPrescriptionPage() {

  const router = useRouter();

  const params = useParams<{ id: string }>();

  const [formData, setFormData] = useState({ medicine: '', dosage: '', time: '' });
 
  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    console.log("New prescription:", formData);

    router.push(`/patients/${params.id}`);

  };
 
  return (
<div className="min-h-screen bg-gray-50 p-8">
<button

        onClick={() => router.back()}

        className="mb-4 text-blue-600 hover:underline"
>

        ← Back
</button>
 
      <h1 className="text-2xl font-bold mb-6">Add Prescription for Patient {params.id}</h1>
 
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-6 space-y-4 max-w-lg">
<div>
<label className="block text-gray-700">Medicine Name</label>
<input

            type="text"

            required

            className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"

            value={formData.medicine}

            onChange={(e) => setFormData({ ...formData, medicine: e.target.value })}

          />
</div>
<div>
<label className="block text-gray-700">Dosage</label>
<input

            type="text"

            required

            className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"

            value={formData.dosage}

            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}

          />
</div>
<div>
<label className="block text-gray-700">Time</label>
<input

            type="text"

            required

            className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"

            value={formData.time}

            onChange={(e) => setFormData({ ...formData, time: e.target.value })}

          />
</div>
<button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">

          Save Prescription
</button>
</form>
</div>

  );

}

 