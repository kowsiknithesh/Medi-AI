// frontend/components/PatientCard.tsx

'use client';

import Link from 'next/link';

// Define the structure of the patient object for TypeScript type safety
interface Patient {
  _id: string;
  name: string;
  age: number;
  whatsappNumber: string;
}

// Define the props that this component will accept
interface PatientCardProps {
  patient: Patient;
}

// The PatientCard component
export const PatientCard = ({ patient }: PatientCardProps) => {
  return (
    // The Link component makes the entire card clickable, navigating to the patient's detail page
    <Link href={`/patients/${patient._id}`}>
      <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          {patient.name}
        </h5>
        <div className="font-normal text-gray-700 space-y-2">
          <p>
            <span className="font-semibold">Age:</span> {patient.age} years
          </p>
          <p className="flex items-center">
            <span className="font-semibold mr-2">Contact:</span> 
            {/* Simple icon for WhatsApp */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.5 2a8.5 8.5 0 105.44 14.93l-1.44-.83a7 7 0 11-4.5-12.28A7.04 7.04 0 0110.5 3.5V2zM10 18a8 8 0 100-16 8 8 0 000 16z" />
              <path d="M13.54 7.46a.5.5 0 010 .7L9.29 12.51a.5.5 0 01-.7 0l-2.05-2.05a.5.5 0 01.7-.7l1.7 1.7 3.85-3.85a.5.5 0 01.7 0z" />
            </svg>
            {patient.whatsappNumber.replace('whatsapp:', '')}
          </p>
        </div>
      </div>
    </Link>
  );
};