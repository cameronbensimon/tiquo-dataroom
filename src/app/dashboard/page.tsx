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
        <div className="relative max-w-6xl mx-auto">
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

          {/* Normal grid view */}
          <AnimatePresence mode="wait">
            {!selectedFolderId && (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-12"
              >
                {dataRoomItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="group cursor-pointer"
                    onClick={() => item.id !== 1 && handleFolderClick(item.id)} // Don't allow clicking deck
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
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
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Selected folder view */}
          <AnimatePresence>
            {selectedFolderId && (() => {
              const selectedFolder = dataRoomItems.find(item => item.id === selectedFolderId);
              if (!selectedFolder) return null;
              
              const cards = getStackForFolder(selectedFolder.name);
              const gridCols = cards.length <= 4 ? cards.length : Math.ceil(Math.sqrt(cards.length));

              return (
                <motion.div
                  key="selected-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative min-h-screen flex flex-col"
                >
                  {/* Cards grid at the top */}
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex-1 flex items-center justify-center"
                  >
                    <div 
                      className={`grid gap-8 max-w-4xl mx-auto`}
                      style={{
                        gridTemplateColumns: `repeat(${Math.min(gridCols, 4)}, minmax(0, 1fr))`
                      }}
                    >
                      {cards.map((card, index) => (
                        <motion.div
                          key={card.id}
                          initial={{ 
                            opacity: 0,
                            x: -100, // Start from left (where the folder was)
                            y: 200, // Start from bottom
                            rotate: card.rotation,
                            scale: 0.8
                          }}
                          animate={{ 
                            opacity: 1,
                            x: 0,
                            y: 0,
                            rotate: 0,
                            scale: 1
                          }}
                          transition={{ 
                            delay: 0.4 + (index * 0.1),
                            duration: 0.6,
                            type: "spring",
                            stiffness: 100,
                            damping: 15
                          }}
                          className="w-32 h-40 relative hover:scale-105 transition-transform cursor-pointer"
                        >
                          <Image
                            src="/file.png"
                            alt="file"
                            fill
                            className="object-contain drop-shadow-lg"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Selected folder at bottom center */}
                  <motion.div
                    initial={{ 
                      opacity: 1,
                      scale: 1,
                    }}
                    animate={{ 
                      opacity: 1,
                      scale: 0.6,
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                  >
                    <div className="w-72 h-60 relative">
                      <Image
                        src={selectedFolder.image}
                        alt={selectedFolder.name}
                        fill
                        className="object-contain drop-shadow-xl"
                      />
                    </div>
                    <div className="text-center mt-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedFolder.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {cards.length} files
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
