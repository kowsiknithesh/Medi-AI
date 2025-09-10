'use client';

import { useRouter } from 'next/navigation';
import PatientForm from '@/components/Doctor/PatientForm';
import { usePatients } from '@/hooks/usePatients';

export default function NewPatientPage() {
  const router = useRouter();
  const { createPatient, loading } = usePatients();

  const handleSubmit = async (data: any) => {
    try {
      await createPatient(data);
      router.push('/patients');
    } catch (error) {
      console.error('Failed to create patient:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Patient</h1>
        <p className="text-gray-600">Create a new patient profile</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <PatientForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/patients')}
          loading={loading}
        />
      </div>
    </div>
  );
}