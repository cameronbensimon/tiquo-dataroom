"use client";

import { useAuthToken } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AccessDenied from "@/components/AccessDenied";

export default function RequestAccessPage() {
  const token = useAuthToken();
  const router = useRouter();
  const user = useQuery(api.users.getCurrentUser);

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (token === undefined) return; // Still loading
    if (!token) {
      router.push("/auth");
    }
  }, [token, router]);

  // Redirect to dashboard if user has access
  useEffect(() => {
    if (user?.AccessAllowed === true) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Show loading while checking authentication
  if (!token || user === undefined) {
    return null;
  }

  // Redirect to auth if not authenticated
  if (user === null) {
    return null;
  }

  // Show access denied page
  return <AccessDenied />;
}
