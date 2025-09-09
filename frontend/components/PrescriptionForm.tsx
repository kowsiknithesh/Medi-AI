// frontend/components/PrescriptionForm.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';

// ... (define interfaces for Medicine, etc.)

export function PrescriptionForm({ patientId }: { patientId: string }) {
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', times: [], duration: 7 }]);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleParsePrescription = async () => {
    if (!file) return alert('Please select a file first.');

    const formData = new FormData();
    formData.append('prescription', file);
    
    try {
      const token = localStorage.getItem('authToken');
      // This endpoint would call your Tesseract service on the backend
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/prescriptions/parse`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      // Assuming the backend returns structured data to pre-fill the form
      setMedicines(response.data.extractedData); 
    } catch (error) {
      console.error('Error parsing prescription', error);
      alert('Failed to parse prescription.');
    }
  };
  
  // ... (rest of the form logic for adding/removing medicines and submitting)

  return (
    <form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Prescription (Optional)</label>
        <div className="mt-1 flex items-center space-x-4">
          <input type="file" onChange={handleFileChange} className="..."/>
          <button type="button" onClick={handleParsePrescription} className="bg-green-500 text-white px-3 py-1 rounded">
            Parse with AI
          </button>
        </div>
      </div>

      {/* Form fields to add/edit medicines manually */}
      {/* ... */}
      
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
        Save Prescription & Schedule Reminders
      </button>
    </form>
  );
}