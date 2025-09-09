// 'use client';

// import { useEffect, useState } from 'react';
// // Make sure the following file exists: src/hooks/useAuth.ts
// import { useAuth } from '../../hooks/useAuth';
// import { usePatients } from '../../hooks/usePatients';
// import { api } from '../../utils/api';
// // import { Patient, Prescription, Reminder } from '@/types';
// import {
//   Users,
//   FileText,
//   Bell,
//   Calendar,
//   ArrowUp,
//   ArrowDown
// } from 'lucide-react';
// import Link from 'next/link';

// interface DashboardStats {
//   totalPatients: number;
//   totalPrescriptions: number;
//   upcomingReminders: number;
//   recentActivity: any[];
// }

// export default function DashboardPage() {
//   const { doctor } = useAuth();
//   const { patients, loading: patientsLoading } = usePatients();
//   const [stats, setStats] = useState<DashboardStats>({
//     totalPatients: 0,
//     totalPrescriptions: 0,
//     upcomingReminders: 0,
//     recentActivity: []
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         const [prescriptionsRes, remindersRes] = await Promise.all([
//           api.get('/prescriptions'),
//           api.get('/reminders/upcoming')
//         ]);

//         setStats({
//           totalPatients: patients.length,
//           totalPrescriptions: prescriptionsRes.data.length,
//           upcomingReminders: remindersRes.data.length,
//           recentActivity: prescriptionsRes.data.slice(0, 5)
//         });
//       } catch (error) {
//         console.error('Failed to fetch dashboard data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (patients.length > 0) {
//       fetchDashboardData();
//     }
//   }, [patients]);

//   if (loading) {
//     return (
//       <div className="animate-pulse">
//         <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="h-32 bg-gray-200 rounded"></div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">
//           Welcome back, Dr. {doctor?.name}
//         </h1>
//         <p className="text-gray-600">Here's what's happening with your patients today.</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <Users className="h-6 w-6 text-blue-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Total Patients</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
//             </div>
//           </div>
//           <div className="mt-4 flex items-center text-sm text-green-600">
//             <ArrowUp className="h-4 w-4 mr-1" />
//             <span>+{Math.floor(stats.totalPatients * 0.1)} from last week</span>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="p-2 bg-green-100 rounded-lg">
//               <FileText className="h-6 w-6 text-green-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Prescriptions</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.totalPrescriptions}</p>
//             </div>
//           </div>
//           <div className="mt-4 flex items-center text-sm text-green-600">
//             <ArrowUp className="h-4 w-4 mr-1" />
//             <span>+{Math.floor(stats.totalPrescriptions * 0.15)} today</span>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="p-2 bg-yellow-100 rounded-lg">
//               <Bell className="h-6 w-6 text-yellow-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Upcoming Reminders</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.upcomingReminders}</p>
//             </div>
//           </div>
//           <div className="mt-4 flex items-center text-sm text-gray-600">
//             <span>Next 24 hours</span>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//           <div className="flex items-center">
//             <div className="p-2 bg-purple-100 rounded-lg">
//               <Calendar className="h-6 w-6 text-purple-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Active Plans</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {stats.totalPrescriptions - Math.floor(stats.totalPrescriptions * 0.3)}
//               </p>
//             </div>
//           </div>
//           <div className="mt-4 flex items-center text-sm text-gray-600">
//             <span>Currently active</span>
//           </div>
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
//         </div>
//         <div className="divide-y divide-gray-200">
//           {stats.recentActivity.length === 0 ? (
//             <div className="px-6 py-12 text-center">
//               <p className="text-gray-500">No recent activity</p>
//             </div>
//           ) : (
//             stats.recentActivity.map((activity: any) => (
//               <div key={activity._id} className="px-6 py-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">
//                       New prescription for {activity.patientId?.name}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       {new Date(activity.prescriptionDate).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div className="text-sm text-gray-500">
//                     {activity.medicines.length} medicines
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
//         </div>
//         <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <Link href="/patients/new" className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
//             <Users className="h-6 w-6 text-primary-600 mr-2" />
//             <span>Add Patient</span>
//           </Link>
//           <Link href="/prescriptions/new" className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
//             <FileText className="h-6 w-6 text-primary-600 mr-2" />
//             <span>New Prescription</span>
//           </Link>
//           <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
//             <Bell className="h-6 w-6 text-primary-600 mr-2" />
//             <span>View Reminders</span>
//           </button>
//           <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
//             <Calendar className="h-6 w-6 text-primary-600 mr-2" />
//             <span>Schedule</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client"

import { useEffect, useState } from "react"
// Make sure the following file exists: src/hooks/useAuth.ts
import { useAuth } from "../../hooks/useAuth"
import { usePatients } from "../../hooks/usePatients"
import { api } from "../../utils/api"
// import { Patient, Prescription, Reminder } from '@/types';
import { Users, FileText, Bell, Calendar, ArrowUp, Activity, TrendingUp, Clock, Stethoscope } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalPatients: number
  totalPrescriptions: number
  upcomingReminders: number
  recentActivity: any[]
}

export default function DashboardPage() {
  const { doctor } = useAuth()
  const { patients, loading: patientsLoading } = usePatients()
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalPrescriptions: 0,
    upcomingReminders: 0,
    recentActivity: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [prescriptionsRes, remindersRes] = await Promise.all([
          api.get("/prescriptions"),
          api.get("/reminders/upcoming"),
        ])

        setStats({
          totalPatients: patients.length,
          totalPrescriptions: prescriptionsRes.data.length,
          upcomingReminders: remindersRes.data.length,
          recentActivity: prescriptionsRes.data.slice(0, 5),
        })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (patients.length > 0) {
      fetchDashboardData()
    }
  }, [patients])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-muted rounded-xl w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-muted rounded-2xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-muted rounded-2xl"></div>
            <div className="h-96 bg-muted rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 lg:p-8 space-y-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 rounded-3xl p-8 border border-primary/10">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back, Dr. {doctor?.name}</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Here's your practice overview for today. Stay informed, stay efficient.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative overflow-hidden bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-chart-1/10 rounded-xl group-hover:bg-chart-1/20 transition-colors">
                <Users className="h-6 w-6 text-chart-1" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-chart-1 bg-chart-1/10 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3" />+{Math.floor(stats.totalPatients * 0.1)}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Patients</p>
              <p className="text-3xl font-bold text-card-foreground">{stats.totalPatients}</p>
              <p className="text-xs text-muted-foreground mt-2">
                +{Math.floor(stats.totalPatients * 0.1)} from last week
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-chart-2/10 rounded-xl group-hover:bg-chart-2/20 transition-colors">
                <FileText className="h-6 w-6 text-chart-2" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-chart-2 bg-chart-2/10 px-2 py-1 rounded-full">
                <ArrowUp className="h-3 w-3" />+{Math.floor(stats.totalPrescriptions * 0.15)}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Prescriptions</p>
              <p className="text-3xl font-bold text-card-foreground">{stats.totalPrescriptions}</p>
              <p className="text-xs text-muted-foreground mt-2">+{Math.floor(stats.totalPrescriptions * 0.15)} today</p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-chart-3/10 rounded-xl group-hover:bg-chart-3/20 transition-colors">
                <Bell className="h-6 w-6 text-chart-3" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                <Clock className="h-3 w-3" />
                24h
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Upcoming Reminders</p>
              <p className="text-3xl font-bold text-card-foreground">{stats.upcomingReminders}</p>
              <p className="text-xs text-muted-foreground mt-2">Next 24 hours</p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                <Activity className="h-3 w-3" />
                Active
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Active Plans</p>
              <p className="text-3xl font-bold text-card-foreground">
                {stats.totalPrescriptions - Math.floor(stats.totalPrescriptions * 0.3)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Currently active</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-card-foreground">Recent Activity</h2>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {stats.recentActivity.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {stats.recentActivity.map((activity: any, index: number) => (
                    <div key={activity._id} className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-chart-2/10 rounded-lg flex-shrink-0">
                          <FileText className="h-4 w-4 text-chart-2" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-card-foreground mb-1">
                            New prescription for {activity.patientId?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.prescriptionDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                          {activity.medicines.length} medicines
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-gradient-to-r from-accent/5 to-primary/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <h2 className="text-xl font-semibold text-card-foreground">Quick Actions</h2>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/patients/new"
                className="group flex items-center gap-3 p-4 border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 hover:shadow-md"
              >
                <div className="p-2 bg-chart-1/10 rounded-lg group-hover:bg-chart-1/20 transition-colors">
                  <Users className="h-5 w-5 text-chart-1" />
                </div>
                <span className="font-medium text-card-foreground">Add Patient</span>
              </Link>

              <Link
                href="/prescriptions/new"
                className="group flex items-center gap-3 p-4 border border-border rounded-xl hover:border-chart-2/50 hover:bg-chart-2/5 transition-all duration-200 hover:shadow-md"
              >
                <div className="p-2 bg-chart-2/10 rounded-lg group-hover:bg-chart-2/20 transition-colors">
                  <FileText className="h-5 w-5 text-chart-2" />
                </div>
                <span className="font-medium text-card-foreground">New Prescription</span>
              </Link>

              <button className="group flex items-center gap-3 p-4 border border-border rounded-xl hover:border-chart-3/50 hover:bg-chart-3/5 transition-all duration-200 hover:shadow-md">
                <div className="p-2 bg-chart-3/10 rounded-lg group-hover:bg-chart-3/20 transition-colors">
                  <Bell className="h-5 w-5 text-chart-3" />
                </div>
                <span className="font-medium text-card-foreground">View Reminders</span>
              </button>

              <button className="group flex items-center gap-3 p-4 border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 hover:shadow-md">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium text-card-foreground">Schedule</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
