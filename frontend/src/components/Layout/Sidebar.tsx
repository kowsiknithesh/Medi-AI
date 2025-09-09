'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  Users,
  FileText,
  Settings,
  X,
  Calendar,
  Icon
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Prescriptions', href: '/prescriptions', icon: FileText },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Profile', href: '/profile', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-6 space-y-2">
          {navigation.map((item) => {
  const isActive = pathname === item.href;

  return (
    <Link
      key={item.name}
      href={item.href}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-primary-100 text-primary-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
      onClick={onClose}
    >
      <item.icon className="h-5 w-5 mr-3" />
      {item.name}
    </Link>
  );
})}

          </div>
        </nav>
      </aside>
    </>
  );
}