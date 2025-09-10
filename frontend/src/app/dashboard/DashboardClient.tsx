// 'use client';

// import { useRouter } from 'next/navigation';
// import { UserPlus, ClipboardList, Bell, PlusCircle } from 'lucide-react';

// interface Patient {
//   _id: string;
//   name: string;
//   age: number;
//   whatsappNumber: string;
// }

// interface User {
//   name: string;
// }

// export default function DashboardClient({ patients, user }: { patients: Patient[]; user: User }) {
//   const router = useRouter();

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <header className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
//         <div className="flex gap-4">
//           <button
//             onClick={() => router.push('/patients/add')}
//             className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//           >
//             <PlusCircle className="h-5 w-5" /> Add Patient
//           </button>
//           <button
//             onClick={() => router.push('/login')}
//             className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </div>
//       </header>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white shadow p-6 rounded-xl flex items-center gap-4">
//           <UserPlus className="h-10 w-10 text-blue-600" />
//           <div>
//             <p className="text-gray-600">Total Patients</p>
//             <p className="text-2xl font-bold">{patients.length}</p>
//           </div>
//         </div>
//         <div className="bg-white shadow p-6 rounded-xl flex items-center gap-4">
//           <ClipboardList className="h-10 w-10 text-green-600" />
//           <div>
//             <p className="text-gray-600">Prescriptions Uploaded</p>
//             <p className="text-2xl font-bold">15</p>
//           </div>
//         </div>
//         <div className="bg-white shadow p-6 rounded-xl flex items-center gap-4">
//           <Bell className="h-10 w-10 text-yellow-600" />
//           <div>
//             <p className="text-gray-600">Reminders Sent</p>
//             <p className="text-2xl font-bold">45</p>
//           </div>
//         </div>
//       </div>

//       {/* Patient list */}
//       <h2 className="text-xl font-semibold mb-4">Patient List</h2>
//       <div className="bg-white shadow rounded-xl divide-y">
//         {patients.map((patient) => (
//           <div
//             key={patient._id}
//             className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
//             onClick={() => router.push(`/patients/${patient._id}`)}
//           >
//             <div>
//               <p className="font-semibold">{patient.name}</p>
//               <p className="text-gray-600 text-sm">Age: {patient.age}</p>
//             </div>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 router.push(`/patients/${patient._id}/add-prescription`);
//               }}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//             >
//               Add Prescription
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }






'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserPlus, ClipboardList, Bell, PlusCircle } from 'lucide-react';

interface Patient {
  _id: string;
  name: string;
  age: number;
  whatsappNumber: string;
}

interface User {
  name: string;
}

export default function DashboardClient() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch patients
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPatients(res.data);
        setUser({ name: 'Doctor Name' }); // Replace with actual user fetch
      })
      .catch((err) => {
        console.error('Failed to fetch patients', err);
      });
  }, [router]);

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
            onClick={() => {
              localStorage.removeItem('authToken');
              router.push('/login');
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Stats */}
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

      {/* Patient list */}
      <h2 className="text-xl font-semibold mb-4">Patient List</h2>
      <div className="bg-white shadow rounded-xl divide-y">
        {patients.map((patient) => (
          <div
            key={patient._id}
            className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
            onClick={() => router.push(`/patients/${patient._id}`)}
          >
            <div>
              <p className="font-semibold">{patient.name}</p>
              <p className="text-gray-600 text-sm">Age: {patient.age}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/patients/${patient._id}/add-prescription`);
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
