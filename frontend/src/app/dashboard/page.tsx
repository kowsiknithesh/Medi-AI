// // // frontend/app/dashboard/page.tsx
// // 'use client';

// // import { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { PatientCard } from '@/components/PatientCard';
// // import { useRouter } from 'next/navigation'; 

// // interface Patient {
// //   _id: string;
// //   name: string;
// //   age: number;
// //   whatsappNumber: string;
// // }

// // export default function DashboardPage() {
// //   const [patients, setPatients] = useState<Patient[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const router = useRouter();

// //   useEffect(() => {
// //     const fetchPatients = async () => {
// //       try {
// //         const token = localStorage.getItem('authToken'); // Get JWT from storage
// //         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/patients`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         setPatients(response.data);
// //       } catch (error) {
// //         console.error('Failed to fetch patients', error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchPatients();
// //   }, []);

// //   if (loading) return <p>Loading patients...</p>;

// //   return (
// //     <div className="container mx-auto p-8">
// //       <h1 className="text-3xl font-bold text-gray-800 mb-6">Doctor Dashboard</h1>
// //       <div className="flex justify-between items-center mb-6">
// //         <h2 className="text-2xl">Your Patients</h2>
// //         <button
// //           onClick={() => router.push('/patients/new')}
// //           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
// //         >
// //           + Add New Patient
// //         </button>
// //       </div>
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {patients.length > 0 ? (
// //           patients.map((patient) => (
// //             <PatientCard key={patient._id} patient={patient} />
// //           ))
// //         ) : (
// //           <p>You have not added any patients yet.</p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
// // frontend/app/dashboard/page.tsx
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// // import PatientCard from '@/components/PatientCard';
// import axios from 'axios';
// import { Suspense } from 'react';
// import DashboardContent from './DashboardContent';

// interface Patient {
//   _id: string;
//   name: string;
//   age: number;
//   whatsappNumber: string;
// }

// interface User {
//   name: string;
// }

// // This is the server-side page component
// export default async function DashboardPage() {
//   // Example: fetch user from cookies or session
//   const cookieStore = cookies();
//   const token = (await cookieStore).get('authToken')?.value;

//   if (!token) {
//     redirect('/login'); // redirect if not authenticated
//   }

//   // You can fetch patients on the server if you have a server token
//   let patients: Patient[] = [];
//   try {
//     const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/patients`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     patients = response.data;
//   } catch (error) {
//     console.error('Failed to fetch patients', error);
//   }

//   const user: User = { name: 'Doctor Name' }; // Replace with actual user fetch

//   return (
//     <Suspense fallback={<p className="p-8 text-gray-600">Loading dashboard...</p>}>
//       {/* Move dynamic parts to a client component */}
//       <DashboardContent patients={patients} user={user} />
//     </Suspense>
//   );
// }





'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { UserPlus, ClipboardList, Bell, PlusCircle } from 'lucide-react';
 
export default function DashboardPage() {

  const router = useRouter();
 
  const patients = [

    { id: 1, name: 'John Doe', age: 45, condition: 'Diabetes' },

    { id: 2, name: 'Mary Smith', age: 60, condition: 'Hypertension' },

  ];
 
  return (
<div className="min-h-screen bg-gray-50 p-8">
<header className="flex justify-between items-center mb-8">
<h1 className="text-2xl font-bold">Doctor Dashboard</h1>
<div className="flex gap-4">
<button

            onClick={() => router.push('/patients/add')}

            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
>
<PlusCircle className="h-5 w-5" /> Add Patient
</button>
<button

            onClick={() => router.push('/login')}

            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
>

            Logout
</button>
</div>
</header>
 
      {/* Stats Section */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
<div className="bg-white shadow p-6 rounded-xl flex items-center gap-4">
<UserPlus className="h-10 w-10 text-blue-600" />
<div>
<p className="text-gray-600">Total Patients</p>
<p className="text-2xl font-bold">{patients.length}</p>
</div>
</div>
<div className="bg-white shadow p-6 rounded-xl flex items-center gap-4">
<ClipboardList className="h-10 w-10 text-green-600" />
<div>
<p className="text-gray-600">Prescriptions Uploaded</p>
<p className="text-2xl font-bold">15</p>
</div>
</div>
<div className="bg-white shadow p-6 rounded-xl flex items-center gap-4">
<Bell className="h-10 w-10 text-yellow-600" />
<div>
<p className="text-gray-600">Reminders Sent</p>
<p className="text-2xl font-bold">45</p>
</div>
</div>
</div>
 
      {/* Patients List */}
<h2 className="text-xl font-semibold mb-4">Patient List</h2>
<div className="bg-white shadow rounded-xl divide-y">

        {patients.map((patient) => (
<div

            key={patient.id}

            className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"

            onClick={() => router.push(`/patients/${patient.id}`)}
>
<div>
<p className="font-semibold">{patient.name}</p>
<p className="text-gray-600 text-sm">

                Age: {patient.age} • {patient.condition}
</p>
</div>
<button

              onClick={(e) => {

                e.stopPropagation();

                router.push(`/patients/${patient.id}/add-prescription`);

              }}

              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
>

              Add Prescription
</button>
</div>

        ))}
</div>
</div>

  );

}

 