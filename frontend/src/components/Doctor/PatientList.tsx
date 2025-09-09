import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import { Patient } from '../../types';

interface PatientListProps {
  patients: Patient[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export default function PatientList({ patients, loading, onDelete }: PatientListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Patients</h2>
        <Link
          href="/patients/new"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Link>
      </div>

      <div className="divide-y divide-gray-200">
        {patients.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No patients found. Add your first patient to get started.</p>
          </div>
        ) : (
          patients.map((patient) => (
            <div key={patient._id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {patient.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {patient.age} years • {patient.gender} • {patient.whatsappNumber}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    href={`/patients/${patient._id}`}
                    className="text-gray-400 hover:text-gray-600"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`/patients/${patient._id}/edit`}
                    className="text-gray-400 hover:text-blue-600"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(patient._id)}
                    disabled={deletingId === patient._id}
                    className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}