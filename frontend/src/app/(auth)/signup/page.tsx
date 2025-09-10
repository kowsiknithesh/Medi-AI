// // frontend/app/(auth)/signup/page.tsx
// 'use client';

// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { User, Lock, Mail, Stethoscope } from 'lucide-react';

// export default function DoctorSignupPage() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     const { name, email, password, confirmPassword } = formData;

//     if (!name || !email || !password || !confirmPassword) {
//       setError('All fields are required.');
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError('Passwords do not match.');
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
//         { name, email, password }
//       );

//       localStorage.setItem('authToken', response.data.token);

//       router.push('/dashboard');
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Stethoscope className="h-8 w-8 text-blue-600" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
//           <p className="text-gray-600 mt-2">Sign up as a doctor</p>
//         </div>

//         {error && <p className="p-3 text-sm text-center text-red-700 bg-red-100 rounded-lg">{error}</p>}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="sr-only">Full Name</label>
//             <div className="relative">
//               <User className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
//               <input
//                 type="text"
//                 required
//                 placeholder="Dr. John Smith"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="sr-only">Email</label>
//             <div className="relative">
//               <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
//               <input
//                 type="email"
//                 required
//                 placeholder="doctor@hospital.com"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="sr-only">Password</label>
//             <div className="relative">
//               <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
//               <input
//                 type="password"
//                 required
//                 placeholder="••••••••"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="sr-only">Confirm Password</label>
//             <div className="relative">
//               <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
//               <input
//                 type="password"
//                 required
//                 placeholder="••••••••"
//                 value={formData.confirmPassword}
//                 onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400"
//           >
//             {loading ? 'Creating Account...' : 'Create Account'}
//           </button>
//         </form>

//         <p className="text-center text-gray-600 mt-6">
//           Already have an account?{' '}
//           <button onClick={() => router.push('/login')} className="text-blue-600 hover:underline font-medium">
//             Sign in
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }











'use client';

import React, { useState } from 'react';

import { User, Lock, Mail, Stethoscope } from 'lucide-react';

import { useRouter } from 'next/navigation';
 
export default function SignupPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
 
  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    if (formData.password === formData.confirmPassword) {

      router.push('/dashboard');

    }

  };
 
  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
<div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
<div className="text-center mb-8">
<div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
<Stethoscope className="h-8 w-8 text-blue-600" />
</div>
<h1 className="text-2xl font-bold">Create Account</h1>
<p className="text-gray-600">Sign up as a doctor</p>
</div>
<form onSubmit={handleSubmit} className="space-y-6">
<div className="relative">
<User className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
<input

              type="text"

              required

              placeholder="Dr. John Smith"

              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"

              value={formData.name}

              onChange={(e) => setFormData({ ...formData, name: e.target.value })}

            />
</div>
<div className="relative">
<Mail className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
<input

              type="email"

              required

              placeholder="doctor@hospital.com"

              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"

              value={formData.email}

              onChange={(e) => setFormData({ ...formData, email: e.target.value })}

            />
</div>
<div className="relative">
<Lock className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
<input

              type="password"

              required

              placeholder="••••••••"

              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"

              value={formData.password}

              onChange={(e) => setFormData({ ...formData, password: e.target.value })}

            />
</div>
<div className="relative">
<Lock className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
<input

              type="password"

              required

              placeholder="Confirm password"

              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"

              value={formData.confirmPassword}

              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}

            />
</div>
<button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Create Account</button>
</form>
<p className="text-center mt-6 text-gray-600">

          Already have an account?{' '}
<button onClick={() => router.push('/login')} className="text-blue-600 hover:underline">Sign in</button>
</p>
</div>
</div>

  );

}

 