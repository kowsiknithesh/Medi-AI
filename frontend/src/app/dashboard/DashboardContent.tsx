// // frontend/app/dashboard/DashboardContent.tsx
// 'use client';

// import { useRouter } from 'next/navigation';
// import { PatientCard } from '@/components/PatientCard';

// interface Patient {
//   _id: string;
//   name: string;
//   age: number;
//   whatsappNumber: string;
// }

// interface User {
//   name: string;
// }

// interface Props {
//   patients: Patient[];
//   user: User;
// }

// export default function DashboardContent({ patients, user }: Props) {
//   const router = useRouter();

//   return (
//     <div className="container mx-auto p-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
//         <div className="flex items-center gap-4">
//           <span className="text-gray-700">Welcome, {user.name}</span>
//           <button
//             onClick={() => router.push('/logout')}
//             className="text-gray-500 hover:text-gray-700 transition-colors"
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Add Patient Button */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold">Your Patients</h2>
//         <button
//           onClick={() => router.push('/patients/new')}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//         >
//           + Add New Patient
//         </button>
//       </div>

//       {/* Patients Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {patients.length > 0 ? (
//           patients.map((patient) => <PatientCard key={patient._id} patient={patient} />)
//         ) : (
//           <p className="text-gray-500 col-span-full">You have not added any patients yet.</p>
//         )}
//       </div>
//     </div>
//   );
// }
