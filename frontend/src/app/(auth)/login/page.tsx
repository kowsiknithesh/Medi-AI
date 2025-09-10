// 'use client';

// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { Mail, Lock, Stethoscope } from 'lucide-react';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   type: string;
// }

// interface LoginFormProps {
//   onSwitch: () => void;
//   onLogin: (user: User) => void;
// }

// const LoginForm: React.FC<LoginFormProps> = ({ onSwitch, onLogin }) => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
//         {
//           email: formData.email,
//           password: formData.password,
//         }
//       );

//       // Save token to localStorage
//       localStorage.setItem('authToken', response.data.token);

//       // Call parent onLogin with user info
//       const user: User = response.data.user;
//       onLogin(user);

//       // Redirect to dashboard
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
//           <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
//           <p className="text-gray-600 mt-2">Sign in to your account</p>
//         </div>

//         {error && (
//           <p className="p-3 text-sm text-center text-red-700 bg-red-100 rounded-lg">{error}</p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//             <div className="relative">
//               <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
//               <input
//                 type="email"
//                 required
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="doctor@hospital.com"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//             <div className="relative">
//               <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
//               <input
//                 type="password"
//                 required
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="••••••••"
//                 value={formData.password}
//                 onChange={(e) =>
//                   setFormData({ ...formData, password: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400"
//           >
//             {loading ? 'Logging in...' : 'Sign In'}
//           </button>
//         </form>

//         <p className="text-center text-gray-600 mt-6">
//           Don't have an account?{' '}
//           <button onClick={onSwitch} className="text-blue-600 hover:underline font-medium">
//             Sign up
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;




'use client';

import React, { useState } from 'react';

import { Lock, Mail, Stethoscope } from 'lucide-react';

import { useRouter } from 'next/navigation';
 
export default function LoginPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({ email: '', password: '' });
 
  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    // fake login

    router.push('/dashboard');

  };
 
  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
<div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
<div className="text-center mb-8">
<div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
<Stethoscope className="h-8 w-8 text-blue-600" />
</div>
<h1 className="text-2xl font-bold">Welcome Back</h1>
<p className="text-gray-600">Sign in to your account</p>
</div>
<form onSubmit={handleSubmit} className="space-y-6">
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
<button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Sign In</button>
</form>
<p className="text-center mt-6 text-gray-600">

          Don’t have an account?{' '}
<button onClick={() => router.push('/signup')} className="text-blue-600 hover:underline">Sign up</button>
</p>
</div>
</div>

  );

}

 