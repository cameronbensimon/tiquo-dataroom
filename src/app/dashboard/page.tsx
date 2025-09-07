"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import DeckCarouselModal from "@/components/DeckCarouselModal";
import PricingModelModal from "@/components/PricingModelModal";
import SingleImageModal from "@/components/SingleImageModal";
import CapTableModal from "@/components/CapTableModal";
import FeatureUsecasesModal from "@/components/FeatureUsecasesModal";
import FeatureRoadmapModal from "@/components/FeatureRoadmapModal";
import FeatureCompetitorComparisonModal from "@/components/FeatureCompetitorComparisonModal";
import AccessDenied from "@/components/AccessDenied";

interface DeckImage {
  id: number;
  src: string;
  alt: string;
  filename?: string;
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [isBrandKitModalOpen, setIsBrandKitModalOpen] = useState(false);
  const [isPricingModelModalOpen, setIsPricingModelModalOpen] = useState(false);
  const [isIncorporationModalOpen, setIsIncorporationModalOpen] = useState(false);
  const [isCapTableModalOpen, setIsCapTableModalOpen] = useState(false);
  const [isFeatureUsecasesModalOpen, setIsFeatureUsecasesModalOpen] = useState(false);
  const [isFeatureRoadmapModalOpen, setIsFeatureRoadmapModalOpen] = useState(false);
  const [isFeatureCompetitorComparisonModalOpen, setIsFeatureCompetitorComparisonModalOpen] = useState(false);

  // State for dynamically loaded images
  const [tiquoDeckImages, setTiquoDeckImages] = useState<DeckImage[]>([]);
  const [brandIdentityImages, setBrandIdentityImages] = useState<DeckImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

  // Function to preload images
  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (preloadedImages.has(src)) {
        resolve();
        return;
      }
      
      const img = new window.Image();
      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, src]));
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  };

  // Function to preload initial images (first 3 of each deck)
  const preloadInitialImages = async (deckImages: DeckImage[], brandImages: DeckImage[]) => {
    const preloadPromises: Promise<void>[] = [];
    
    // Preload first 3 deck images
    for (let i = 0; i < Math.min(3, deckImages.length); i++) {
      preloadPromises.push(preloadImage(deckImages[i].src));
    }
    
    // Preload first 3 brand identity images
    for (let i = 0; i < Math.min(3, brandImages.length); i++) {
      preloadPromises.push(preloadImage(brandImages[i].src));
    }
    
    try {
      await Promise.all(preloadPromises);
      console.log('✅ Preloaded initial images for both decks');
    } catch (error) {
      console.warn('⚠️ Some initial images failed to preload:', error);
    }
  };

  // Fetch images from blob storage on component mount
  useEffect(() => {
    const fetchBlobImages = async () => {
      try {
        setIsLoadingImages(true);
        const response = await fetch('/api/blob/list');
        const result = await response.json();
        
        if (result.success) {
          const deckImages = result.data.deckImages;
          const brandImages = result.data.brandImages;
          
          setTiquoDeckImages(deckImages);
          setBrandIdentityImages(brandImages);
          console.log('Loaded deck images:', deckImages.length);
          console.log('Loaded brand images:', brandImages.length);
          
          // Start preloading initial images immediately
          preloadInitialImages(deckImages, brandImages);
        } else {
          console.error('Failed to fetch blob images:', result.error);
        }
      } catch (error) {
        console.error('Error fetching blob images:', error);
      } finally {
        setIsLoadingImages(false);
      }
    };
    
    fetchBlobImages();
  }, []);


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

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (isLoading) return; // Still loading
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, isLoading, router]);

  // Detect mobile and tablet screen sizes
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768); // md breakpoint
      setIsTablet(width >= 768 && width < 1024); // tablet: md to lg breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
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

  // Handle certificate of incorporation file click
  const handleIncorporationClick = () => {
    setIsIncorporationModalOpen(true);
  };

  // Handle cap table file click
  const handleCapTableClick = () => {
    setIsCapTableModalOpen(true);
  };

  // Handle feature usecases file click
  const handleFeatureUsecasesClick = () => {
    setIsFeatureUsecasesModalOpen(true);
  };

  // Handle feature roadmap file click
  const handleFeatureRoadmapClick = () => {
    setIsFeatureRoadmapModalOpen(true);
  };

  // Handle feature competitor comparison file click
  const handleFeatureCompetitorComparisonClick = () => {
    setIsFeatureCompetitorComparisonModalOpen(true);
  };

  // Simple 4 buttons - deck + 3 folders
  const dataRoomItems = [
    { 
      id: 1, 
      name: "Investor Deck", 
      count: 15, 
      type: "folder" as const,
      image: "/deck.webp",
      description: "Comprehensive investor presentation materials including company overview, financial projections, and strategic roadmap.",
      files: []
    },
    { 
      id: 2, 
      name: "Company Documents", 
      count: 2, 
      type: "folder" as const,
      image: "/Company-documents.webp",
      description: "Our certificate of incorporation, cap table, and other company records are organized here.",
      files: ["Cap table", "Certificate of incorporation"]
    },
    { 
      id: 3, 
      name: "Product & Technology", 
      count: 4, 
      type: "folder" as const,
      image: "/Product-Technology.webp",
      description: "Technical specifications, product and feature roadmap and competitor analysis.",
      files: ["Feature Roadmap", "Feature Usecases", "Feature Competitor Comparison", "Unique selling points"]
    },
    { 
      id: 4, 
      name: "Brand & Strategy", 
      count: 4, 
      type: "folder" as const,
      image: "/Brand-Strategy.webp",
      description: "Brand guidelines, strategic positioning documents, and visual identity assets.",
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

  // Check if a file should have Work in Progress badge
  const isWorkInProgress = (fileName: string) => {
    const wipFiles = ["Use of funds", "Go-to-market strategy", "Unique selling points"];
    return wipFiles.includes(fileName);
  };

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

  // Redirect if unauthenticated (handled by useEffect above)
  if (!isAuthenticated || !user) {
    return null;
  }

  // Check if user has access - AccessAllowed must be explicitly true
  if (user.accessAllowed !== true) {
    return <AccessDenied />;
  }

  return (
    <>
      {/* Dashboard-specific structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "tiquo Data Room",
            "description": "The Universal Booking, Loyalty & Point of Sale Platform",
            "url": "https://dataroom.tiquo.co/dashboard",
            "isPartOf": {
              "@type": "WebSite",
              "name": "tiquo Data Room",
              "url": "https://dataroom.tiquo.co"
            },
            "provider": {
              "@type": "Organization",
              "name": "tiquo"
            },
            "mainEntity": {
              "@type": "Dataset",
              "name": "tiquo Data Room",
              "description": "The Universal Booking, Loyalty & Point of Sale Platform",
              "keywords": ["investor deck", "company documents", "product roadmap", "brand guidelines", "financial projections", "business strategy"]
            }
          })
        }}
      />
      
      <div className="min-h-screen" style={{backgroundColor: '#f2f2f2'}}>
        {/* Fixed Logo at Top Center */}
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <Image
            src="/tiquo logo.svg"
            alt="The Universal Booking, Loyalty & Point of Sale Platform"
            width={96}
            height={96}
            className="w-20 h-20 md:w-24 md:h-24"
          />
        </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* Folder Description Card */}
        <AnimatePresence>
  {selectedFolderId && (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      // Make a full-width fixed strip and center the card with mx-auto
      className="fixed inset-x-0 top-32 z-50 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full md:max-w-md bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
        <div className="relative">
          <button
            onClick={() => setSelectedFolderId(null)}
            className="absolute top-0 right-0 -mt-2 -mr-2 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors cursor-pointer"
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
      </div>
    </motion.div>
  )}
</AnimatePresence>

       {/* Data Room Items Grid */}
<div className="min-h-dvh flex items-center justify-center px-4 sm:px-6 lg:px-8">
  <div className="w-full max-w-6xl">
    {/* Main grid layout */}
    <div
      id="folders-grid"
      className="grid gap-6 md:gap-12 justify-items-center grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
    >
      {dataRoomItems.map((item) => {
        const isSelected = selectedFolderId === item.id;
        const shouldFadeOut = selectedFolderId && selectedFolderId !== item.id;

        return (
          <motion.div
            key={item.id}
            layoutId={`folder-${item.id}`}
            className={`group cursor-pointer ${
              isSelected && (isMobile || isTablet)
                ? "fixed bottom-[-230px] left-1/2 -translate-x-1/2 z-40"
                : "relative"
            }`}
            onClick={() =>
              item.id === 1 ? handleDeckClick() : handleFolderClick(item.id)
            }
            animate={{
              opacity: shouldFadeOut ? 0 : 1,
              scale: shouldFadeOut ? 0.8 : 1,
              zIndex: isSelected ? 40 : shouldFadeOut ? 1 : 10,
            }}
                          style={{
                pointerEvents: shouldFadeOut ? "none" : "auto",
                // Desktop only: keep your fixed positioning for the selected item
                ...(isSelected &&
                  !isMobile && !isTablet && {
                    position: "fixed",
                    left: "calc(50% - 8.5rem)",
                    top: "13.75rem", 
                    transform: "translateX(-50%)",
                    zIndex: 50,
                  }),
              }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              duration: 0.8,
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
                    <div
                      className="absolute -top-1 transform -translate-x-1/2 z-0"
                      style={{
                        left: isSelected ? "60%" : "calc(50% + 50px)",
                      }}
                    >
                      {/* Randomized file card stack */}
                      <div className="relative w-48 h-48">
                        {stack.map((card, index) => {
                          // Calculate position for when this folder is selected
                          // Desktop: single horizontal row, Mobile: grid layout
                          let gridX, gridY;
                                                     if (isMobile || isTablet) {
                             // Mobile & Tablet: 2-column grid
                             const gridCol = index % 2;
                             const gridRow = Math.floor(index / 2);
                             gridX = (gridCol - 0.5) * 160; // Adjusted spacing
                             // Much larger spacing between rows on tablet
                             const rowSpacing = isTablet ? 200 : 140; 
                             // Dynamic vertical offset based on screen height
                             const screenHeight = window.innerHeight;
                             let baseOffset;
                             if (screenHeight < 700) {
                               baseOffset = -650;
                             } else if (screenHeight < 900) {
                               baseOffset = -700;
                             } else {
                               baseOffset = -700;
                             }
                             // Debug log (remove after testing)
                             console.log(`Screen height: ${screenHeight}, Base offset: ${baseOffset}`);
                             gridY = gridRow * rowSpacing + baseOffset;
                           } else {
                            // Desktop: single horizontal row
                            const totalCards = stack.length;
                            const cardSpacing = 180;
                            const startX = -((totalCards - 1) * cardSpacing) / 2;
                            gridX = startX + index * cardSpacing;
                            gridY = -150;
                          }

                          return (
                            <motion.div
                              key={`card-${item.id}-${card.id}`}
                              layoutId={`file-card-${item.id}-${card.id}`}
                              className="absolute cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (card.name === "Brand kit") {
                                  handleBrandKitClick();
                                } else if (card.name === "Pricing Model") {
                                  handlePricingModelClick();
                                } else if (card.name === "Certificate of incorporation") {
                                  handleIncorporationClick();
                                } else if (card.name === "Cap table") {
                                  handleCapTableClick();
                                } else if (card.name === "Feature Usecases") {
                                  handleFeatureUsecasesClick();
                                } else if (card.name === "Feature Roadmap") {
                                  handleFeatureRoadmapClick();
                                } else if (card.name === "Feature Competitor Comparison") {
                                  handleFeatureCompetitorComparisonClick();
                                }
                              }}
                              animate={
                                isSelected
                                  ? {
                                      x: gridX,
                                      y: gridY + 250, // Move down with folder first, then to grid position
                                      rotate: 0,
                                      scale: 1.1,
                                      zIndex: 30,
                                      opacity: 1,
                                    }
                                  : {
                                      x: card.left,
                                      y: card.top,
                                      rotate: card.rotation,
                                      scale: 1,
                                      zIndex: 0,
                                      opacity: shouldFadeOut ? 0 : card.opacity,
                                    }
                              }
                              transition={{
                                type: "spring",
                                stiffness: 80,
                                damping: 20,
                                delay: isSelected ? 0.3 + index * 0.1 : 0,
                                duration: 0.8,
                              }}
                            >
                              <div className="text-center">
                                <div className="w-40 h-40 md:w-32 md:h-40 flex items-center justify-center scale-80 md:scale-90 lg:scale-100 relative">
                                  <Image
                                    src={
                                      card.name === "Certificate of incorporation"
                                        ? "/incorporation.webp"
                                        : card.name === "Cap table"
                                        ? "/captableicon.webp"
                                        : card.name === "Feature Usecases"
                                        ? "/spreadsheeticon.webp"
                                        : card.name === "Feature Competitor Comparison"
                                        ? "/spreadsheeticon.webp"
                                        : card.name === "Feature Roadmap"
                                        ? "/timeline.webp"
                                        : card.name === "Unique selling points"
                                        ? "/staricon.webp"
                                        : card.name === "Brand kit"
                                        ? "/brandicon.webp"
                                        : card.name === "Use of funds"
                                        ? "/spreadsheeticon.webp"
                                        : card.name === "Pricing Model"
                                        ? "/moneyicon.webp"
                                        : card.name === "Go-to-market strategy"
                                        ? "/arrowicon.webp"
                                        : "/file.webp"
                                    }
                                    alt={
                                      card.name === "Certificate of incorporation"
                                        ? "TIQUO Certificate of Incorporation - Official company registration document showing legal entity status and corporate structure"
                                        : card.name === "Cap table"
                                        ? "TIQUO Capitalization Table - Detailed breakdown of company ownership, equity distribution, and shareholder information"
                                        : card.name === "Feature Usecases"
                                        ? "TIQUO Feature Use Cases - Comprehensive analysis of product applications across different industries and business scenarios"
                                        : card.name === "Feature Competitor Comparison"
                                        ? "TIQUO Competitive Analysis - Feature comparison matrix showing advantages over competitors in the market"
                                        : card.name === "Use of funds"
                                        ? "TIQUO Investment Use of Funds - Strategic allocation plan for investor capital and business growth initiatives"
                                        : card.name === "Feature Roadmap"
                                        ? "TIQUO Product Roadmap - Timeline showing planned feature development, milestones, and strategic product evolution"
                                        : card.name === "Unique selling points"
                                        ? "TIQUO Unique Selling Propositions - Key differentiators and competitive advantages in the technology market"
                                        : card.name === "Brand kit"
                                        ? "TIQUO Brand Kit - Complete visual identity package including logos, colors, typography, and brand guidelines"
                                        : card.name === "Pricing Model"
                                        ? "TIQUO Pricing Strategy - Revenue model, pricing tiers, and financial projections for business growth"
                                        : card.name === "Go-to-market strategy"
                                        ? "TIQUO Go-to-Market Strategy - Strategic plan for product launch, customer acquisition, and market penetration"
                                        : "TIQUO Business Document - Important company file for investor review and due diligence"
                                    }
                                    width={128}
                                    height={160}
                                    className="object-contain drop-shadow-lg max-w-full max-h-full"
                                  />
                                  {/* Work in Progress Badge */}
                                  {isWorkInProgress(card.name) && (
                                    <div className="absolute bottom-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg border-2 border-white z-10 transform -rotate-12">
                                      WIP
                                    </div>
                                  )}
                                </div>
                                {isSelected && (
                                  <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="text-xs text-gray-700 -mt-6 md:mt-1 px-2 font-medium max-w-[160px] md:max-w-[140px] leading-tight"
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
                <div 
                  className="relative z-10 w-full h-full scale-80 md:scale-90 lg:scale-100 transition-transform duration-500"
                  style={{
                    transform: isSelected ? 'translateY(270px)' : 'translateY(0px)'
                  }}
                >
                  <Image
                    src={item.image}
                    alt={`${item.name} - ${item.description}`}
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
                <span className="md:hidden">
                  Data Room{" "}
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
                </span>
                <span className="hidden md:block">
                Running a hotel, restaurant, spa, or venue shouldn’t require 20+ different tools.
With Tiquo, every service, booking, and transaction flows through a single system — built for adaptability, scale, and AI.
Simpler for staff, seamless for customers, smarter for the business. 
                   {" "}
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
                  </span>
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
      />

      {/* Brand Kit Carousel Modal */}
      <DeckCarouselModal
        isOpen={isBrandKitModalOpen}
        onClose={() => setIsBrandKitModalOpen(false)}
        images={brandIdentityImages}
      />

      {/* Pricing Model Spreadsheet Modal */}
      <PricingModelModal
        isOpen={isPricingModelModalOpen}
        onClose={() => setIsPricingModelModalOpen(false)}
        leftTable={leftTableData}
        rightTables={[rightTableData1, rightTableData2]}
        title="Pricing & Strategy"
      />

      {/* Certificate of Incorporation Modal */}
      <SingleImageModal
        isOpen={isIncorporationModalOpen}
        onClose={() => setIsIncorporationModalOpen(false)}
        imageSrc="/incorporationtiquo.jpg"
        imageAlt="Certificate of Incorporation - TIQUO"
      />

      {/* Cap Table Modal */}
      <CapTableModal
        isOpen={isCapTableModalOpen}
        onClose={() => setIsCapTableModalOpen(false)}
        title="Company Ownership Structure"
      />

      {/* Feature Usecases Modal */}
      <FeatureUsecasesModal
        isOpen={isFeatureUsecasesModalOpen}
        onClose={() => setIsFeatureUsecasesModalOpen(false)}
        title="Feature Usecases by Industry"
      />

      {/* Feature Competitor Comparison Modal */}
      <FeatureCompetitorComparisonModal
        isOpen={isFeatureCompetitorComparisonModalOpen}
        onClose={() => setIsFeatureCompetitorComparisonModalOpen(false)}
        title="Feature Competitor Comparison"
      />

      {/* Feature Roadmap Modal */}
      <FeatureRoadmapModal
        isOpen={isFeatureRoadmapModalOpen}
        onClose={() => setIsFeatureRoadmapModalOpen(false)}
        title="Product Development Roadmap"
      />
      </div>
    </>
  );
}
