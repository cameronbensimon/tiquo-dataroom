"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AccessDenied from "@/components/AccessDenied";
import { useAuth } from "@/lib/auth-context";

export default function RequestAccessPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (isLoading) return; // Still loading
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, isLoading, router]);

  // Redirect to dashboard if user has access
  useEffect(() => {
    if (user && user.accessAllowed === true) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#f2f2f2'}}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Show access denied page
  return <AccessDenied />;
}
