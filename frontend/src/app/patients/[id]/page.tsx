'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Prescription {
  status: string;
  expiry_date: string;
  _id: string;
  medicine: string;
  dosage: string;
  time: string;
}

interface Patient {
  _id: string;
  doctor: string;
  name: string;
  age: number;
  whatsappNumber: string;
  prescriptions: Prescription[];
}

export default function PatientProfilePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;

    const fetchPatient = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('No token found in localStorage');
          return;
        }

        const res = await fetch('http://localhost:5000/api/auth/patients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Failed to fetch patients: ${res.status}`);

        const patients: Patient[] = await res.json();
        const found = patients.find((p) => p._id === params.id);
        setPatient(found || null);
      } catch (err) {
        console.error('Error fetching patient:', err);
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [params.id]);

  if (loading) return <p className="p-8 text-gray-600">Loading patient details...</p>;

  if (!patient) {
    return (
      <div className="p-8">
        <button onClick={() => router.back()} className="text-blue-600 hover:underline mb-4">
          ← Back
        </button>
        <p className="text-red-500">Patient not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button onClick={() => router.back()} className="mb-4 text-blue-600 hover:underline">
        ← Back
      </button>

      {/* Patient Info */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">{patient.name}</h1>
        <p className="text-gray-700">
          <span className="font-medium">Age:</span> {patient.age}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">WhatsApp:</span> {patient.whatsappNumber}
        </p>
      </div>

      {/* Prescriptions */}
      <h2 className="text-xl font-semibold mb-4">Prescriptions</h2>
      {patient.prescriptions.length === 0 ? (
        <p className="text-gray-500">No prescriptions added yet.</p>
      ) : (
        <div className="bg-white shadow rounded-xl overflow-hidden">
<table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Medicine</th>
                <th className="p-4 text-left">Dosage</th>
                <th className="p-4 text-left">Expiry Date</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {patient.prescriptions.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-4">{p.medicine}</td>
                  <td className="p-4">{p.dosage}</td>
                  <td className="p-4">{p.expiry_date || '-'}</td>
                  <td className="p-4">{p.status || 'Active'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={() => router.push(`/patients/${params.id}/add-prescription`)}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Add Prescription
      </button>
    </div>
  );
}



// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';

// interface Prescription {
//   _id: string;
//   medicine: string;
//   dosage: string;
//   expiry_date?: string;
//   status?: string;
// }

// interface Patient {
//   _id: string;
//   doctor: string;
//   name: string;
//   age: number;
//   whatsappNumber: string;
//   prescriptions: Prescription[];
// }

// export default function PatientProfilePage() {
//   const router = useRouter();
//   const params = useParams();
//   const [patient, setPatient] = useState<Patient | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadPatient = async () => {
//       const rawId = (params as any).id;
//       const patientId = Array.isArray(rawId) ? rawId[0] : rawId;

//       if (!patientId) return;

//       try {
//         const token = localStorage.getItem('authToken');
//         if (!token) {
//           console.error('No token found in localStorage');
//           router.push('/login');
//           return;
//         }

//         const res = await fetch(`http://localhost:5000/api/auth/patients`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) {
//           throw new Error(`Failed to fetch patient: ${res.status}`);
//         }

//         const data: Patient = await res.json();
//         setPatient(data);
//       } catch (err) {
//         console.error('Error fetching patient:', err);
//         setPatient(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadPatient();
//   }, [params, router]);

//   if (loading) {
//     return <p className="p-8 text-gray-600">Loading patient details...</p>;
//   }

//   if (!patient) {
//     return (
//       <div className="p-8">
//         <button onClick={() => router.back()} className="text-blue-600 hover:underline mb-4">
//           ← Back
//         </button>
//         <p className="text-red-500">Patient not found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <button onClick={() => router.back()} className="mb-4 text-blue-600 hover:underline">
//         ← Back
//       </button>

//       {/* Patient Info */}
//       <div className="bg-white shadow rounded-xl p-6 mb-8">
//         <h1 className="text-2xl font-bold mb-4">{patient.name}</h1>
//         <p className="text-gray-700">
//           <span className="font-medium">Age:</span> {patient.age}
//         </p>
//         <p className="text-gray-700">
//           <span className="font-medium">WhatsApp:</span> {patient.whatsappNumber}
//         </p>
//       </div>

//       {/* Prescriptions */}
//       <h2 className="text-xl font-semibold mb-4">Prescriptions</h2>
//       {patient.prescriptions.length === 0 ? (
//         <p className="text-gray-500">No prescriptions added yet.</p>
//       ) : (
//         <div className="bg-white shadow rounded-xl overflow-hidden">
//           <table className="w-full border-collapse">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-4 text-left">Medicine</th>
//                 <th className="p-4 text-left">Dosage</th>
//                 <th className="p-4 text-left">Expiry Date</th>
//                 <th className="p-4 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {patient.prescriptions.map((p) => (
//                 <tr key={p._id} className="border-t">
//                   <td className="p-4">{p.medicine}</td>
//                   <td className="p-4">{p.dosage}</td>
//                   <td className="p-4">{p.expiry_date || '-'}</td>
//                   <td className="p-4">{p.status || 'Active'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <button
//         onClick={() => router.push(`/patients/${(params as any).id}/add-prescription`)}
//         className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//       >
//         Add Prescription
//       </button>
//     </div>
//   );
// }
