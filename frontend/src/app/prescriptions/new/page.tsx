'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PatientForm from '../../../components/Doctor/PatientForm';
import PrescriptionForm from '../../../components/Prescription/PrescriptionForm';
import { usePatients } from '../../../hooks/usePatients';
import { api } from '../../../utils/api';
import { Patient, Prescription } from '../../../types';

export default function NewPrescriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId');
  
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientForm, setShowPatientForm] = useState(!patientId);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patientId) {
      const fetchPatient = async () => {
        try {
          const response = await api.get(`/patients/${patientId}`);
          setSelectedPatient(response.data);
        } catch (error) {
          console.error('Failed to fetch patient:', error);
        }
      };
      fetchPatient();
    }
  }, [patientId]);

  const handlePrescriptionSubmit = async (data: Partial<Prescription>) => {
    setLoading(true);
    try {
      await api.post('/prescriptions', data);
      router.push('/prescriptions');
    } catch (error) {
      console.error('Failed to create prescription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showPatientForm) {
    // Creates a new patient via API and returns the created patient object
    async function createPatient(data: Partial<Patient>): Promise<Patient> {
      try {
        const response = await api.post('/patients', data);
        return response.data;
      } catch (error) {
        console.error('Failed to create patient:', error);
        throw error;
      }
    }

    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Patient</h1>
          <p className="text-gray-600">First, create a patient profile</p>
        </div>
        <PatientForm
          onSubmit={async (data) => {
            // Create patient and then show prescription form
            const patient = await createPatient(data);
            setSelectedPatient(patient);
            setShowPatientForm(false);
          }}
          onCancel={() => router.push('/prescriptions')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          New Prescription for {selectedPatient?.name}
        </h1>
        <p className="text-gray-600">Create a new medication plan</p>
      </div>

      <PrescriptionForm
        patientId={selectedPatient!._id}
        onSubmit={handlePrescriptionSubmit}
        onCancel={() => setShowPatientForm(true)}
        loading={loading}
      />
    </div>
  );
}