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

  // Check user access permissions
  const hasCompanyDocsAccess = useQuery(api.users.checkUserAccess, { accessType: "companyDocuments" });
  const hasDeckAccess = useQuery(api.users.checkUserAccess, { accessType: "deck" });
  const hasProductTechAccess = useQuery(api.users.checkUserAccess, { accessType: "productTechnology" });
  const hasBrandStrategyAccess = useQuery(api.users.checkUserAccess, { accessType: "brandStrategy" });

  const handleSignOut = async () => {
    await signOut();
  };

  // Data room items (deck + folders) with access requirements
  const dataRoomItems = [
    { 
      id: 1, 
      name: "Investor Deck", 
      count: 15, 
      type: "deck" as const,
      accessRequired: "deck" as const,
      hasAccess: hasDeckAccess 
    },
    { 
      id: 2, 
      name: "Company Documents", 
      count: 8, 
      type: "folder" as const,
      image: "/Company-documents.png",
      accessRequired: "companyDocuments" as const,
      hasAccess: hasCompanyDocsAccess 
    },
    { 
      id: 3, 
      name: "Product & Technology", 
      count: 32, 
      type: "folder" as const,
      image: "/Product-Technology.png",
      accessRequired: "productTechnology" as const,
      hasAccess: hasProductTechAccess 
    },
    { 
      id: 4, 
      name: "Brand & Strategy", 
      count: 18, 
      type: "folder" as const,
      image: "/Brand-Strategy.png",
      accessRequired: "brandStrategy" as const,
      hasAccess: hasBrandStrategyAccess 
    },
  ];

  // Filter items based on user access
  const accessibleItems = dataRoomItems.filter(item => item.hasAccess);

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
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Image
                src="/tiquo logo.svg"
                alt="tiquo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <h1 className="text-xl font-semibold text-gray-900">DataRoom</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {currentUser?.email || "User"}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 px-3 py-1 rounded-md transition-colors backdrop-blur-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/tiquo logo.svg"
              alt="tiquo"
              width={64}
              height={64}
              className="w-16 h-16"
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {accessibleItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
            >
              {/* Glass effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-3xl"></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Deck or Folder Display */}
                <div className="mb-4 flex justify-center">
                  {item.type === "deck" ? (
                    // Deck - Rectangle with rounded corners
                    <div className="w-24 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  ) : (
                    // Folder - Use actual images
                    item.image && (
                      <div className="w-24 h-20 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )
                  )}
                </div>

                {/* Item Info */}
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {item.count} items
                  </p>
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* No Access Message */}
        {accessibleItems.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-lg max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No data room access
              </h3>
              <p className="text-gray-600 text-sm">
                Contact your administrator to request access to data room sections.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
