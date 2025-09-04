"use client";

import { useAuthToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const token = useAuthToken();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      // User is authenticated, redirect to dashboard
      router.push("/dashboard");
    } else {
      // User is not authenticated, redirect to auth page
      router.push("/auth");
    }
  }, [token, router]);

  // Show a loading state while determining auth status and redirecting
  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#f2f2f2'}}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}