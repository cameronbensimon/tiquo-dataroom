"use client";

import { useAuthToken } from "@convex-dev/auth/react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const token = useAuthToken();

  // Generate random positions for file cards in each stack (changes on each load)
  const generateRandomStack = () => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      top: Math.floor(Math.random() * 32) - 16, // -16 to 16px (more vertical spread)
      left: Math.floor(Math.random() * 24) - 8, // -8 to 16px (more horizontal fan-out)
      rotation: Math.floor(Math.random() * 30) - 15, // -15 to 15 degrees
      opacity: Math.random() * 0.4 + 0.5, // 0.5 to 0.9
    }));
  };

  // Generate different random stacks for each folder
  const companyDocsStack = generateRandomStack();
  const productTechStack = generateRandomStack(); 
  const brandStrategyStack = generateRandomStack();

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
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#f2f2f2'}}>
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
    <div className="min-h-screen" style={{backgroundColor: '#f2f2f2'}}>
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
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            tiquo is a technology company building modern solutions for business infrastructure and workflow automation. 
            We create tools that streamline operations, enhance productivity, and enable seamless collaboration across teams.{" "}
            <a 
              href="https://tiquo.co" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              Visit tiquo.co
              <svg 
                className="w-4 h-4 ml-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                />
              </svg>
            </a>
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
                  {/* Stack of file cards behind folders (not deck) */}
                  {item.name !== "Investor Deck" && (() => {
                    // Get the appropriate random stack for this folder
                    let stack;
                    if (item.name === "Company Documents") stack = companyDocsStack;
                    else if (item.name === "Product & Technology") stack = productTechStack;
                    else if (item.name === "Brand & Strategy") stack = brandStrategyStack;
                    else stack = companyDocsStack; // fallback

                    return (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-0">
                        {/* Randomized file card stack */}
                        <div className="relative w-48 h-48">
                          {stack.map((card) => (
                            <Image
                              key={card.id}
                              src="/file.png"
                              alt="file"
                              width={128}
                              height={160}
                              className="absolute"
                              style={{
                                top: `${card.top}px`,
                                left: `${card.left}px`,
                                transform: `rotate(${card.rotation}deg)`,
                                opacity: card.opacity,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                  
                  {/* Main folder/deck image */}
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain hover:drop-shadow-xl transition-all duration-300 relative z-10"
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
