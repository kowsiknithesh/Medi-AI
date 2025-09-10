'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Clock, Calendar } from 'lucide-react';
import { Prescription, Medicine } from '../../types';

interface PrescriptionFormProps {
  patientId: string;
  onSubmit: (data: Partial<Prescription>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function PrescriptionForm({ patientId, onSubmit, onCancel, loading }: PrescriptionFormProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<Partial<Prescription>>({
    defaultValues: {
      medicines: [{
        name: '',
        dosage: '',
        frequency: 'Once daily',
        duration: { value: 7, unit: 'days' },
        timing: [{ time: '08:00', withFood: true }]
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medicines'
  });

  const [error, setError] = useState<string>('');

  const handleFormSubmit = async (data: Partial<Prescription>) => {
    try {
      setError('');
      await onSubmit({
        ...data,
        patientId,
        prescriptionDate: new Date()
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create prescription');
    }
  };

  const addMedicine = () => {
    append({
      name: '',
      dosage: '',
      frequency: 'Once daily',
      duration: { value: 7, unit: 'days' },
      timing: [{ time: '08:00', withFood: true }]
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
          Diagnosis
        </label>
        <input
          type="text"
          id="diagnosis"
          {...register('diagnosis')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Enter diagnosis..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Medicines</h3>
          <button
            type="button"
            onClick={addMedicine}
            className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Medicine
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-900">Medicine {index + 1}</h4>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Medicine Name *
                  </label>
                  <input
                    {...register(`medicines.${index}.name`, { required: 'Medicine name is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="e.g., Paracetamol"
                  />
                  {errors.medicines?.[index]?.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.medicines[index]?.name?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dosage *
                  </label>
                  <input
                    {...register(`medicines.${index}.dosage`, { required: 'Dosage is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="e.g., 500mg"
                  />
                  {errors.medicines?.[index]?.dosage && (
                    <p className="mt-1 text-sm text-red-600">{errors.medicines[index]?.dosage?.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Frequency *
                  </label>
                  <select
                    {...register(`medicines.${index}.frequency`, { required: 'Frequency is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Four times daily">Four times daily</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      {...register(`medicines.${index}.duration.value`, { 
                        valueAsNumber: true,
                        min: 1 
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="7"
                    />
                    <select
                      {...register(`medicines.${index}.duration.unit`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Timing
                  </label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <input
                      type="time"
                      {...register(`medicines.${index}.timing.0.time`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  {...register(`medicines.${index}.notes`)}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Special instructions..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
          General Instructions
        </label>
        <textarea
          id="instructions"
          {...register('instructions')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Additional instructions for the patient..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700">
            Follow-up Date
          </label>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <input
              type="date"
              id="followUpDate"
              {...register('followUpDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Prescription'}
        </button>
      </div>
    </form>
  );
}