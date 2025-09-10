export interface Doctor {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  phone: string;
  clinicInfo: {
    name: string;
    address: string;
    phone: string;
  };
  licenseNumber: string;
  profilePicture?: string;
}

export interface Patient {
  _id: string;
  doctorId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  whatsappNumber: string;
  email?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory?: Array<{
    condition: string;
    diagnosisDate: Date;
    notes: string;
  }>;
  allergies?: string[];
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: {
    value: number;
    unit: 'days' | 'weeks' | 'months';
  };
  timing: Array<{
    time: string;
    withFood: boolean;
  }>;
  notes?: string;
  image?: string;
}

export interface Prescription {
  _id: string;
  doctorId: string;
//   patientId: string;
 patientId: string | {
    _id?: string;
    name?: string;
  };
  diagnosis?: string;
  medicines: Medicine[];
  instructions?: string;
  followUpDate?: Date;
  prescriptionDate: Date;
  status: 'active' | 'completed' | 'cancelled';
  originalImage?: string;
}



export interface Reminder {
  _id: string;
  prescriptionId: string;
  patientId: string;
  medicineName: string;
  dosage: string;
  scheduledTime: Date;
  whatsappNumber: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  sentAt?: Date;
  failureReason?: string;
}