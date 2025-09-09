'use client';

import { useState,useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { api } from '../../utils/api';
import { Prescription } from '../../types';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await api.get('/prescriptions');
        setPrescriptions(response.data);
      } catch (error) {
        console.error('Failed to fetch prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const filteredPrescriptions = prescriptions.filter(prescription =>
    (
      typeof prescription.patientId === 'object' &&
      prescription.patientId !== null &&
      'name' in prescription.patientId &&
      typeof (prescription.patientId as { name?: string }).name === 'string'
        ? (prescription.patientId as { name: string }).name.toLowerCase().includes(searchTerm.toLowerCase())
        : typeof prescription.patientId === 'string' &&
          prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    prescription.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600">Manage patient prescriptions</p>
        </div>
        <Link
          href="/prescriptions/new"
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Prescription
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search prescriptions by patient name or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="bg-white rounded-lg shadow-sm">
        {filteredPrescriptions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No prescriptions found</p>
            <Link
              href="/prescriptions/new"
              className="text-primary-600 hover:text-primary-700"
            >
              Create your first prescription
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPrescriptions.map((prescription) => (
              <div key={prescription._id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {typeof prescription.patientId === 'object' && prescription.patientId !== null && 'name' in prescription.patientId
                        ? ((prescription.patientId as { name?: string }).name || 'Unknown Patient')
                        : (typeof prescription.patientId === 'string' ? prescription.patientId : 'Unknown Patient')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(prescription.prescriptionDate).toLocaleDateString()}
                    </p>
                    {prescription.diagnosis && (
                      <p className="text-sm text-gray-700 mt-1">{prescription.diagnosis}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    prescription.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : prescription.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {prescription.status}
                  </span>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Medications:</h4>
                  <div className="flex flex-wrap gap-2">
                    {prescription.medicines.slice(0, 4).map((medicine, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {medicine.name}
                      </span>
                    ))}
                    {prescription.medicines.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                        +{prescription.medicines.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex space-x-4">
                  <Link
                    href={`/prescriptions/${prescription._id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/patients/${
                      typeof prescription.patientId === 'object'
                        ? prescription.patientId?._id
                        : prescription.patientId || ''
                    }`}
                    className="text-gray-600 hover:text-gray-700 text-sm"
                  >
                    View Patient
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}