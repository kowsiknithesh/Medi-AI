// frontend/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { PatientCard } from '@/components/PatientCard';
import { useRouter } from 'next/navigation'; 

interface Patient {
  _id: string;
  name: string;
  age: number;
  whatsappNumber: string;
}

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Get JWT from storage
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(response.data);
      } catch (error) {
        console.error('Failed to fetch patients', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <p>Loading patients...</p>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Doctor Dashboard</h1>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl">Your Patients</h2>
        <button
          onClick={() => router.push('/patients/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add New Patient
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.length > 0 ? (
          patients.map((patient) => (
            <PatientCard key={patient._id} patient={patient} />
          ))
        ) : (
          <p>You have not added any patients yet.</p>
        )}
      </div>
    </div>
  );
}