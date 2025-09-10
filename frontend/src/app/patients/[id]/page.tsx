// 'use client';

// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// export default function AddPatientPage() {
//   const [name, setName] = useState('');
//   const [age, setAge] = useState<number | ''>('');
//   const [whatsappNumber, setWhatsappNumber] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const token = localStorage.getItem('authToken'); // JWT from login
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/patients`,
//         { name, age, whatsappNumber },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // After adding patient, redirect to dashboard
//       router.push('/dashboard');
//     } catch (error) {
//       console.error('Error adding patient:', error);
//       alert('Failed to add patient. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-8 max-w-lg">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Patient</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-gray-700">Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Age</label>
//           <input
//             type="number"
//             value={age}
//             onChange={(e) => setAge(Number(e.target.value))}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">WhatsApp Number</label>
//           <input
//             type="text"
//             value={whatsappNumber}
//             onChange={(e) => setWhatsappNumber(e.target.value)}
//             placeholder="whatsapp:+919876543210"
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//         >
//           {loading ? 'Adding...' : 'Add Patient'}
//         </button>
//       </form>
//     </div>
//   );
// }





'use client';

import React from 'react';

import { useParams, useRouter } from 'next/navigation';
 
export default function PatientProfilePage() {

  const router = useRouter();

  const params = useParams<{ id: string }>();
 
  const prescriptions = [

    { id: 1, medicine: 'Metformin', dosage: '500mg', time: 'Morning' },

    { id: 2, medicine: 'Amlodipine', dosage: '10mg', time: 'Night' },

  ];
 
  return (
<div className="min-h-screen bg-gray-50 p-8">
<button

        onClick={() => router.back()}

        className="mb-4 text-blue-600 hover:underline"
>

        ← Back
</button>
 
      <h1 className="text-2xl font-bold mb-6">Patient Profile (ID: {params.id})</h1>
 
      {/* Prescription Table */}
<div className="bg-white shadow rounded-xl overflow-hidden">
<table className="w-full border-collapse">
<thead className="bg-gray-100">
<tr>
<th className="p-4 text-left">Medicine</th>
<th className="p-4 text-left">Dosage</th>
<th className="p-4 text-left">Time</th>
</tr>
</thead>
<tbody>

            {prescriptions.map((p) => (
<tr key={p.id} className="border-t">
<td className="p-4">{p.medicine}</td>
<td className="p-4">{p.dosage}</td>
<td className="p-4">{p.time}</td>
</tr>

            ))}
</tbody>
</table>
</div>
 
      <button

        onClick={() => router.push(`/patients/${params.id}/add-prescription`)}

        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
>

        Add Prescription
</button>
</div>

  );

}

 