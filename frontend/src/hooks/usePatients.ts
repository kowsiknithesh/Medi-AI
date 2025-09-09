import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Patient } from '../types';

interface UsePatientsReturn {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  createPatient: (data: Partial<Patient>) => Promise<Patient>;
  updatePatient: (id: string, data: Partial<Patient>) => Promise<Patient>;
  deletePatient: (id: string) => Promise<void>;
  refreshPatients: () => Promise<void>;
}

export function usePatients(): UsePatientsReturn {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const createPatient = async (data: Partial<Patient>): Promise<Patient> => {
    try {
      const response = await api.post('/patients', data);
      setPatients(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create patient');
    }
  };

  const updatePatient = async (id: string, data: Partial<Patient>): Promise<Patient> => {
    try {
      const response = await api.put(`/patients/${id}`, data);
      setPatients(prev => prev.map(p => p._id === id ? response.data : p));
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update patient');
    }
  };

  const deletePatient = async (id: string): Promise<void> => {
    try {
      await api.delete(`/patients/${id}`);
      setPatients(prev => prev.filter(p => p._id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete patient');
    }
  };

  return {
    patients,
    loading,
    error,
    createPatient,
    updatePatient,
    deletePatient,
    refreshPatients: fetchPatients
  };
}