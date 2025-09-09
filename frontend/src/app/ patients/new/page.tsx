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
<h1>Add New Patient</h1>