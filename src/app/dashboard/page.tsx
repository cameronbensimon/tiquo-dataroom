"use client";

import { useAuthActions, useAuthToken } from "@convex-dev/auth/react";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const token = useAuthToken();
  const { signOut } = useAuthActions();
  const currentUser = useQuery(api.users.getCurrentUser);

  const handleSignOut = async () => {
    await signOut();
  };

  // Simple 4 buttons - deck + 3 folders
  const dataRoomItems = [
    { 
      id: 1, 
      name: "Investor Deck", 
      count: 15, 
      type: "folder" as const,
      image: "/Deck.png"
    },
    { 
      id: 2, 
      name: "Company Documents", 
      count: 8, 
      type: "folder" as const,
      image: "/Company-documents.png"
    },
    { 
      id: 3, 
      name: "Product & Technology", 
      count: 32, 
      type: "folder" as const,
      image: "/Product-Technology.png"
    },
    { 
      id: 4, 
      name: "Brand & Strategy", 
      count: 18, 
      type: "folder" as const,
      image: "/Brand-Strategy.png"
    },
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/tiquo logo.svg"
              alt="tiquo"
              width={96}
              height={96}
              className="w-24 h-24"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to tiquo DataRoom
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your secure, modern data room platform for document sharing and collaboration.
            Organize, share, and manage your most important files with enterprise-grade security.
          </p>
        </div>

        {/* Data Room Items Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
          {dataRoomItems.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer transition-all duration-300 hover:scale-105"
            >
              {/* All items now use images - same size */}
              {item.image && (
                <div className="w-72 h-60 relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain hover:drop-shadow-xl transition-all duration-300"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
