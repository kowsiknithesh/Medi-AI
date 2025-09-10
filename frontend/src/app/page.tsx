"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <h1 className="text-4xl font-bold text-blue-700 mb-4">
        Medi-AI
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Smart prescription management and medicine reminders for doctors and patients.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/signup")}
          className="px-6 py-3 rounded-xl bg-white text-blue-600 font-semibold border border-blue-600 shadow hover:bg-blue-50 transition"
        >
          Sign Up
        </button>
      </div>
    </main>
  );
}
