"use client";

import { useAuthToken } from "@convex-dev/auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DeckCarouselModal from "@/components/DeckCarouselModal";
import SpreadsheetModal from "@/components/SpreadsheetModal";

export default function DashboardPage() {
  const token = useAuthToken();
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [isBrandKitModalOpen, setIsBrandKitModalOpen] = useState(false);
  const [isPricingModelModalOpen, setIsPricingModelModalOpen] = useState(false);

  // TIQUO deck slides configuration
  const tiquoDeckImages = Array.from({ length: 17 }, (_, index) => ({
    id: index + 1,
    src: `/slides/TIQUO DECK V5 - ${String(index + 1).padStart(2, '0')}.jpg`,
    alt: `TIQUO Deck Slide ${index + 1}`
  }));

  // Brand identity images configuration
  const brandIdentityImages = Array.from({ length: 17 }, (_, index) => ({
    id: index + 1,
    src: `/brand-identity/Tiquo brand identity - ${String(index + 1).padStart(2, '0')}.jpg`,
    alt: `Tiquo Brand Identity ${index + 1}`
  }));

  // Pricing model spreadsheet data - 3 tables layout
  const leftTableData = {
    title: "Sub-Location Examples",
    headers: ["Sub-Location Examples", "Products", "Services"],
    rows: [
      ["Restaurant", true, true],
      ["Spa & Treatments", true, true],
      ["Hotel Rooms", true, true],
      ["Exhibition", false, true],
      ["Meeting Rooms", false, true],
      ["Cinemas", true, true],
      ["Gym", true, true],
      ["Single Event", false, true],
      ["Tennis Courts", false, true],
      ["Doctor", false, true],
      ["Venue Hire", false, true],
      ["Retail Store", true, false],
      ["Bar", true, false],
      ["Concerts", true, true],
      ["Recording Studio", false, true],
      ["Reception Desk", false, false]
    ]
  };

  const rightTableData1 = {
    title: "Property Size and Revenue",
    headers: ["Property Type", "Sub Locations", "£300/month", "500k Revenue (1%)", "1M Revenue (0.5%)", "Revenue per Year"],
    editableColumns: [1], // Sub Locations column is editable
    rows: [
      ["Very Large Property", 25, "=B*300", "", "=B*1000000*0.005", "=(C*12)+SUM(D:E)"],
      ["Large Property", 10, "=B*300", "", "=B*1000000*0.005", "=(C*12)+SUM(D:E)"],
      ["Medium Property", 5, "=B*300", "=B*500000*0.01", "", "=(C*12)+SUM(D:E)"],
      ["Small Property", 2, "=B*300", "=B*500000*0.01", "", "=(C*12)+SUM(D:E)"]
    ]
  };

  const rightTableData2 = {
    title: "Example Tiquo Revenue",
    headers: ["Property Type", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7"],
    editableColumns: [1, 2, 3, 4, 5, 6, 7], // All year columns are editable
    rows: [
      ["Very Large Property", 1, 20, 35, 55, 80, 110, 145],
      ["Large Property", 5, 50, 85, 130, 185, 250, 325],
      ["Medium Property", 10, 200, 320, 460, 620, 800, 1000],
      ["Small Property", 15, 200, 300, 420, 560, 720, 900],
      ["", "", "", "", "", "", "", ""],
      ["Revenue", "=SUMREVENUE(B)", "=SUMREVENUE(C)", "=SUMREVENUE(D)", "=SUMREVENUE(E)", "=SUMREVENUE(F)", "=SUMREVENUE(G)", "=SUMREVENUE(H)"]
    ]
  };

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Generate fan-out positions for file cards in each stack (stable positions)
  const generateFanOutStack = (fileNames: string[]) => {
    return fileNames.map((fileName, i) => {
      // Create fan-out effect: cards start close at bottom, spread at top
      const fanAngle = (i - (fileNames.length - 1) / 2) * 15; // Spread cards in fan
      const fanRadius = 20; // Distance from center
      
      return {
        id: i,
        name: fileName,
        top: -Math.abs(fanAngle) * 0.5, // Slightly higher for outer cards
        left: Math.sin((fanAngle * Math.PI) / 180) * fanRadius, // Horizontal fan spread
        rotation: fanAngle, // Rotation follows fan angle
        opacity: 0.7 + (i * 0.1), // Slightly different opacity for depth
      };
    });
  };

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

  // Handle deck click
  const handleDeckClick = () => {
    setIsDeckModalOpen(true);
  };

  // Handle brand kit file click
  const handleBrandKitClick = () => {
    setIsBrandKitModalOpen(true);
  };

  // Handle pricing model file click
  const handlePricingModelClick = () => {
    setIsPricingModelModalOpen(true);
  };

  // Simple 4 buttons - deck + 3 folders
  const dataRoomItems = [
    { 
      id: 1, 
      name: "Investor Deck", 
      count: 15, 
      type: "folder" as const,
      image: "/deck.png",
      description: "Comprehensive investor presentation materials including company overview, financial projections, and strategic roadmap.",
      files: []
    },
    { 
      id: 2, 
      name: "Company Documents", 
      count: 2, 
      type: "folder" as const,
      image: "/Company-documents.png",
      description: "Essential company documentation including incorporation papers, legal agreements, and corporate governance materials.",
      files: ["Certificate of incorporation", "Cap table"]
    },
    { 
      id: 3, 
      name: "Product & Technology", 
      count: 4, 
      type: "folder" as const,
      image: "/Product-Technology.png",
      description: "Technical specifications, product roadmaps, architecture documentation, and development resources.",
      files: ["Feature Roadmap", "Feature Usecases", "Feature Competitor Comparison", "Unique selling points"]
    },
    { 
      id: 4, 
      name: "Brand & Strategy", 
      count: 4, 
      type: "folder" as const,
      image: "/Brand-Strategy.png",
      description: "Brand guidelines, marketing materials, strategic positioning documents, and visual identity assets.",
      files: ["Brand kit", "Use of funds", "Go-to-market strategy", "Pricing Model"]
    },
  ];

  // Generate different stacks for each folder based on their files
  const companyDocsStack = generateFanOutStack(dataRoomItems.find(item => item.name === "Company Documents")?.files || []);
  const productTechStack = generateFanOutStack(dataRoomItems.find(item => item.name === "Product & Technology")?.files || []); 
  const brandStrategyStack = generateFanOutStack(dataRoomItems.find(item => item.name === "Brand & Strategy")?.files || []);

  // Get the stack for a specific folder
  const getStackForFolder = (folderName: string) => {
    if (folderName === "Company Documents") return companyDocsStack;
    if (folderName === "Product & Technology") return productTechStack;
    if (folderName === "Brand & Strategy") return brandStrategyStack;
    return [];
  };

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
        {/* Header Section - Logo Only */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/tiquo logo.svg"
              alt="tiquo"
              width={96}
              height={96}
              className="w-24 h-24"
            />
          </div>
        </div>

        {/* Folder Description Card */}
        <AnimatePresence>
          {selectedFolderId && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-32 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg max-w-md mx-4"
            >
              <div className="relative">
                <button
                  onClick={() => setSelectedFolderId(null)}
                  className="absolute top-0 right-0 -mt-2 -mr-2 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
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
                </button>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {dataRoomItems.find(item => item.id === selectedFolderId)?.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {dataRoomItems.find(item => item.id === selectedFolderId)?.description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data Room Items Grid */}
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl min-h-8">
            {/* Main grid layout */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 px-4 sm:px-6 lg:px-8" id="folders-grid">
              {dataRoomItems.map((item) => {
                const isSelected = selectedFolderId === item.id;
                const shouldFadeOut = selectedFolderId && selectedFolderId !== item.id;
                
                return (
                  <motion.div
                    key={item.id}
                    layoutId={`folder-${item.id}`}
                    className={`group cursor-pointer ${
                      isSelected && isMobile 
                        ? "fixed top-48 left-1/2 -translate-x-1/2 z-40" 
                        : "relative"
                    }`}
                    onClick={() => item.id === 1 ? handleDeckClick() : handleFolderClick(item.id)}
                    animate={{
                      opacity: shouldFadeOut ? 0 : 1,
                      scale: shouldFadeOut ? 0.8 : 1,
                      zIndex: isSelected ? 40 : shouldFadeOut ? 1 : 10,
                    }}
                    style={{
                      pointerEvents: shouldFadeOut ? "none" : "auto", // Disable clicks when faded out
                      // Desktop only: mobile uses Tailwind classes for proper centering
                      ...(isSelected && !isMobile && {
                        position: "fixed",
                        left: "40%",
                        top: "13.75rem",
                        transform: "translateX(-50%)",
                      }),
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
                            <div className="absolute -top-1 transform -translate-x-1/2 z-0" style={{ 
                              left: isSelected ? "50%" : "calc(50% + 50px)" 
                            }}>
                              {/* Randomized file card stack */}
                              <div className="relative w-48 h-48">
                                {stack.map((card, index) => {
                                  // Calculate position for when this folder is selected
                                  // Desktop: single horizontal row, Mobile: grid layout
                                  let gridX, gridY;
                                  if (isMobile) {
                                    // Mobile: 2-column grid
                                    const gridCol = index % 2;
                                    const gridRow = Math.floor(index / 2);
                                    gridX = (gridCol - 0.5) * 180; // Relative to center
                                    gridY = gridRow * 200 - 100; // Move up from folder position
                                  } else {
                                    // Desktop: single horizontal row at same level as folder
                                    const totalCards = stack.length;
                                    const cardSpacing = 180; // Space between cards
                                    const startX = -(totalCards - 1) * cardSpacing / 2; // Center the row
                                    gridX = startX + (index * cardSpacing);
                                    gridY = -400; // Same level as folder
                                  }

                                  return (
                                    <motion.div
                                      key={`card-${item.id}-${card.id}`}
                                      className={`${
                                        isSelected && isMobile 
                                          ? "fixed" 
                                          : "absolute"
                                      } cursor-pointer`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (card.name === "Brand kit") {
                                          handleBrandKitClick();
                                        } else if (card.name === "Pricing Model") {
                                          handlePricingModelClick();
                                        }
                                      }}
                                      style={{
                                        // Desktop only: mobile uses Tailwind classes
                                        ...(isSelected && !isMobile && {
                                          position: "fixed",
                                          left: `calc(50% + ${gridX}px - 64px)`, // Subtract half card width (128px/2)
                                          top: `${220 + gridY}px`,
                                        }),
                                        // Mobile positioning via Tailwind, but we need left/top for grid
                                        ...(isSelected && isMobile && {
                                          left: `calc(50% + ${gridX}px - 64px)`, // Subtract half card width for proper centering
                                          top: `${220 + gridY}px`,
                                        }),
                                      }}
                                      animate={isSelected ? {
                                        rotate: 0,
                                        scale: 1.1,
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
                                      <div className="text-center">
                                        <div className="w-32 h-40 flex items-center justify-center">
                                          <Image
                                            src="/file.png"
                                            alt="file"
                                            width={128}
                                            height={160}
                                            className="object-contain drop-shadow-lg max-w-full max-h-full"
                                          />
                                        </div>
                                        {isSelected && (
                                          <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + (index * 0.1) }}
                                            className="text-xs text-gray-700 mt-1 px-2 font-medium max-w-[140px] leading-tight"
                                          >
                                            {card.name}
                                          </motion.p>
                                        )}
                                      </div>
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
      </main>

      {/* Bottom Text Section with fade animation */}
      <AnimatePresence>
        {!selectedFolderId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="text-center">
              <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
                tiquo is a technology company building modern solutions for business infrastructure and workflow automation. 
                We create tools that streamline operations, enhance productivity, and enable seamless collaboration across teams.{" "}
                <a 
                  href="https://tiquo.co" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Visit tiquo.co
                  <svg 
                    className="w-3 h-3 ml-1" 
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deck Carousel Modal */}
      <DeckCarouselModal
        isOpen={isDeckModalOpen}
        onClose={() => setIsDeckModalOpen(false)}
        images={tiquoDeckImages}
        title="TIQUO Investor Deck"
      />

      {/* Brand Kit Carousel Modal */}
      <DeckCarouselModal
        isOpen={isBrandKitModalOpen}
        onClose={() => setIsBrandKitModalOpen(false)}
        images={brandIdentityImages}
        title="Tiquo Brand Identity"
      />

      {/* Pricing Model Spreadsheet Modal */}
      <SpreadsheetModal
        isOpen={isPricingModelModalOpen}
        onClose={() => setIsPricingModelModalOpen(false)}
        leftTable={leftTableData}
        rightTables={[rightTableData1, rightTableData2]}
        title="Pricing & Strategy"
      />
    </div>
  );
}
