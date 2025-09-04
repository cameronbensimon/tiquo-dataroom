"use client";

import { useAuthToken } from "@convex-dev/auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const token = useAuthToken();
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  // Generate random positions for file cards in each stack (changes on each load)
  const generateRandomStack = () => {
    const cardCount = Math.floor(Math.random() * 2) + 2; // Random 2 or 3 cards
    return Array.from({ length: cardCount }, (_, i) => ({
      id: i,
      top: Math.floor(Math.random() * 32) - 16, // -16 to 16px (more vertical spread)
      left: Math.floor(Math.random() * 40) - 20, // -20 to 20px (wider horizontal fan-out)
      rotation: Math.floor(Math.random() * 30) - 15, // -15 to 15 degrees
      opacity: Math.random() * 0.4 + 0.5, // 0.5 to 0.9
    }));
  };

  // Generate different random stacks for each folder
  const companyDocsStack = generateRandomStack();
  const productTechStack = generateRandomStack(); 
  const brandStrategyStack = generateRandomStack();

  // Handle folder click
  const handleFolderClick = (folderId: number) => {
    if (selectedFolderId === folderId) {
      // If clicking the same folder, close it
      setSelectedFolderId(null);
    } else {
      // Otherwise, select the new folder
      setSelectedFolderId(folderId);
    }
  };

  // Get the stack for a specific folder
  const getStackForFolder = (folderName: string) => {
    if (folderName === "Company Documents") return companyDocsStack;
    if (folderName === "Product & Technology") return productTechStack;
    if (folderName === "Brand & Strategy") return brandStrategyStack;
    return [];
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
        <div className="relative max-w-6xl mx-auto min-h-8">
          {/* Close button when folder is selected */}
          <AnimatePresence>
            {selectedFolderId && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedFolderId(null)}
                className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-sm rounded-full p-3 hover:bg-white/90 transition-colors shadow-lg"
              >
                <svg
                  className="w-6 h-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Single container - all items always mounted to prevent teleporting */}
          <div className="relative min-h-8">
            {/* Main grid layout */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12" id="folders-grid">
              {dataRoomItems.map((item) => {
                const isSelected = selectedFolderId === item.id;
                const shouldFadeOut = selectedFolderId && selectedFolderId !== item.id;
                
                return (
                  <motion.div
                    key={item.id}
                    layoutId={`folder-${item.id}`}
                    className="group cursor-pointer relative"
                    onClick={() => item.id !== 1 && handleFolderClick(item.id)}
                    animate={{
                      opacity: shouldFadeOut ? 0 : 1,
                      scale: shouldFadeOut ? 0.8 : 1,
                      // Move to center of container when selected
                      x: isSelected ? "50%" : 0,
                      translateX: isSelected ? "-50%" : "0%",
                      y: isSelected ? 200 : 0, // Move down exactly 200px when selected
                      zIndex: isSelected ? 40 : shouldFadeOut ? 1 : 10,
                    }}
                    style={{
                      pointerEvents: shouldFadeOut ? "none" : "auto", // Disable clicks when faded out
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      duration: 0.8
                    }}
                    whileHover={!selectedFolderId ? { scale: 1.05 } : {}}
                    whileTap={!selectedFolderId ? { scale: 0.98 } : {}}
                  >
                    {item.image && (
                      <div className="w-72 h-60 relative">
                        {/* Stack of file cards behind folders (not deck) */}
                        {item.name !== "Investor Deck" && (() => {
                          const stack = getStackForFolder(item.name);

                          return (
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-0">
                              {/* Randomized file card stack */}
                              <div className="relative w-48 h-48">
                                {stack.map((card, index) => {
                                  // Calculate grid position for when this folder is selected
                                  const gridCol = index % 3;
                                  const gridRow = Math.floor(index / 3);
                                  const gridX = (gridCol - 1) * 200; // Relative to center
                                  const gridY = gridRow * 200 - 300; // Move up from folder position

                                  return (
                                    <motion.div
                                      key={`card-${item.id}-${card.id}`}
                                      className="absolute"
                                      animate={isSelected ? {
                                        // Move to grid position centered with folder
                                        x: `calc(50% + ${gridX}px - 64px)`,
                                        y: `${gridY + 150}px`, // Position relative to container
                                        rotate: 0,
                                        scale: 1.2,
                                        zIndex: 30,
                                        opacity: 1,
                                      } : {
                                        // Original position behind folder
                                        x: card.left,
                                        y: card.top,
                                        rotate: card.rotation,
                                        scale: 1,
                                        zIndex: 0,
                                        opacity: shouldFadeOut ? 0 : card.opacity,
                                      }}
                                      transition={{
                                        type: "spring",
                                        stiffness: 80,
                                        damping: 20,
                                        delay: isSelected ? 0.3 + (index * 0.1) : 0,
                                        duration: 0.8
                                      }}
                                    >
                                      <Image
                                        src="/file.png"
                                        alt="file"
                                        width={128}
                                        height={160}
                                        className="object-contain drop-shadow-lg"
                                      />
                                    </motion.div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}
                        
                        {/* Main folder/deck image */}
                        <div className="relative z-10 w-full h-full">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain hover:drop-shadow-xl transition-all duration-300"
                          />
                        </div>
                      </div>
                    )}

                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
