"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
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
          <Image
            src="/Black.gif"
            alt="Loading..."
            width={32}
            height={32}
            className="mx-auto mb-4"
          />
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
