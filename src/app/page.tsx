"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    if (user) {
      if (user.accessAllowed === true) {
        router.push("/dashboard");
      } else {
        router.push("/request-access");
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  // Show a loading state while determining auth status and redirecting
  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#f2f2f2'}}>
      <div className="text-center">
        <Image
          src="/Black.gif"
          alt="Loading..."
          width={48}
          height={48}
          className="mx-auto"
        />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}