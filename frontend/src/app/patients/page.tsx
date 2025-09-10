// 'use client'; // ← MUST add this for client components

// import { useState } from 'react';
// import Link from 'next/link';
// import { usePatients } from '@/hooks/usePatients'; // ← Same import
// import PatientList from '@/components/Doctor/PatientList'; // ← Same component

// export default function PatientsPage() {
//   const { patients, loading, error, deletePatient } = usePatients();
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredPatients = patients.filter(patient =>
//     patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     patient.whatsappNumber.includes(searchTerm)
//   );

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
//           <p className="text-gray-600">Manage your patient records</p>
//         </div>
//         <Link
//           href="/patients/new"
//           className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
//         >
//           Add New Patient
//         </Link>
//       </div>

//       {/* Search */}
//       <div className="bg-white p-4 rounded-lg shadow-sm">
//         <input
//           type="text"
//           placeholder="Search patients by name or phone..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//         />
//       </div>

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
//           {error}
//         </div>
//       )}

//       {/* Patient List Component - REUSED AS-IS */}
//       <PatientList
//         patients={filteredPatients}
//         loading={loading}
//         onDelete={deletePatient}
//       />
//     </div>
//   );
// }






'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, Calendar, Phone, Mail, MapPin } from 'lucide-react';
import { api } from '../../utils/api';
import { Patient, Prescription } from '../../types';

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientRes, prescriptionsRes] = await Promise.all([
          api.get(`/patients/${params.id}`),
          api.get(`/prescriptions/patient/${params.id}`)
        ]);
        setPatient(patientRes.data);
        setPrescriptions(prescriptionsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Patient not found</h1>
        <Link href="/patients" className="text-primary-600 hover:text-primary-700">
          Back to Patients
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-600">Patient Profile</p>
          </div>
        </div>
        <Link
          href={`/patients/${params.id}/edit`}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-gray-700">{patient.whatsappNumber}</span>
              </div>
              
              {patient.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-700">{patient.email}</span>
                </div>
              )}
              
              {patient.address && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-700">{patient.address}</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="text-sm font-medium">{patient.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="text-sm font-medium">{patient.gender}</p>
                </div>
              </div>
            </div>

            {patient.emergencyContact && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Emergency Contact</h3>
                <p className="text-sm font-medium">{patient.emergencyContact.name}</p>
                <p className="text-sm text-gray-600">{patient.emergencyContact.phone}</p>
                <p className="text-sm text-gray-500">{patient.emergencyContact.relationship}</p>
              </div>
            )}
          </div>
        </div>

        {/* Prescriptions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Prescription History</h2>
              <Link
                href={`/prescriptions/new?patientId=${params.id}`}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm"
              >
                New Prescription
              </Link>
            </div>

            {prescriptions.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No prescriptions found</p>
                <Link
                  href={`/prescriptions/new?patientId=${params.id}`}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  Create first prescription
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div key={prescription._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {new Date(prescription.prescriptionDate).toLocaleDateString()}
                        </h3>
                        {prescription.diagnosis && (
                          <p className="text-sm text-gray-600">{prescription.diagnosis}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        prescription.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {prescription.status}
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-2">Medicines:</h4>
                      <ul className="space-y-1">
                        {prescription.medicines.slice(0, 3).map((medicine, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {medicine.name} - {medicine.dosage}
                          </li>
                        ))}
                        {prescription.medicines.length > 3 && (
                          <li className="text-sm text-gray-500">
                            +{prescription.medicines.length - 3} more medicines
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <Link
                      href={`/prescriptions/${prescription._id}`}
                      className="inline-block mt-3 text-primary-600 hover:text-primary-700 text-sm"
                    >
                      View details →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}