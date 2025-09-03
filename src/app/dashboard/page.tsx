"use client";

import { useAuthActions, useAuthToken } from "@convex-dev/auth/react";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function DashboardPage() {
  const token = useAuthToken();
  const { signOut } = useAuthActions();
  const currentUser = useQuery(api.users.getCurrentUser);

  const handleSignOut = async () => {
    await signOut();
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to access the dashboard
          </h1>
          <Link
            href="/auth"
            className="inline-block rounded-lg bg-indigo-600 text-white px-6 py-3 text-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">DataRoom</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {currentUser?.email || "User"}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to your tiquo DataRoom Dashboard
              </h2>
              <p className="text-gray-600 mb-6">
                Your secure document sharing platform is ready!
              </p>
              <div className="space-y-3">
                <div className="text-sm text-gray-500">
                  ✅ Next.js 15 with App Router
                </div>
                <div className="text-sm text-gray-500">
                  ✅ Convex Database & File Storage
                </div>
                <div className="text-sm text-gray-500">
                  ✅ Passwordless Email OTP Authentication
                </div>
                <div className="text-sm text-gray-500">
                  ✅ Resend Email Integration
                </div>
                <div className="text-sm text-gray-500">
                  ✅ shadcn/ui Components
                </div>
                <div className="text-sm text-gray-500">
                  ✅ Tailwind CSS Styling
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
