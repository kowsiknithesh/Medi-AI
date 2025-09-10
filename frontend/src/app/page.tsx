import Link from 'next/link';
import { getCurrentUser } from '../utils/auth';

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome back, Dr. {user.name}
          </h1>
          <p className="text-gray-600 mb-8">
            You are already logged in. Go to your dashboard to manage patients and prescriptions.
          </p>
          <Link
            href="/dashboard"
            className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-4xl w-full mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Medicine Reminder System
          </h1>
          <p className="text-xl text-gray-600">
            Streamline patient care with automated medication reminders via WhatsApp
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-blue-600 text-xl font-bold">📋</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Digital Prescriptions</h3>
            <p className="text-gray-600">Create and manage prescriptions digitally with AI-powered parsing</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-green-600 text-xl font-bold">💊</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Reminders</h3>
            <p className="text-gray-600">Automated WhatsApp reminders for patients at prescribed times</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-purple-600 text-xl font-bold">👥</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Patient Management</h3>
            <p className="text-gray-600">Complete patient profiles with medical history and contact information</p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="bg-primary-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-primary-700 inline-block"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}