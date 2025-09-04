"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CapTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

interface ShareholderData {
  name: string;
  shares: number;
  percentage: number;
  color: string;
}

export default function CapTableModal({ isOpen, onClose, title = "Cap Table" }: CapTableModalProps) {
  
  const shareholderData: ShareholderData[] = [
    {
      name: "Cameron Bensimon",
      shares: 600000,
      percentage: 60,
      color: "#3b82f6" // blue-500
    },
    {
      name: "Josh Bensimon", 
      shares: 400000,
      percentage: 40,
      color: "#8b5cf6" // violet-500
    }
  ];

  const totalShares = shareholderData.reduce((sum, shareholder) => sum + shareholder.shares, 0);

  // Create SVG donut chart
  const createDonutChart = () => {
    const radius = 80;
    const centerX = 100;
    const centerY = 100;
    const circumference = 2 * Math.PI * radius;
    
    let currentAngle = 0;
    const paths = shareholderData.map((shareholder, index) => {
      const percentage = shareholder.percentage;
      const angle = (percentage / 100) * 360;
      
      // Calculate start and end points for the arc
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const startX = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
      const startY = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
      const endX = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
      const endY = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${startX} ${startY}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        'Z'
      ].join(' ');
      
      currentAngle += angle;
      
      return (
        <path
          key={index}
          d={pathData}
          fill={shareholder.color}
          className="transition-opacity hover:opacity-80"
        />
      );
    });

    return (
      <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-lg">
        {paths}
        {/* Center white circle to create donut effect */}
        <circle
          cx={centerX}
          cy={centerY}
          r={35}
          fill="white"
        />
      </svg>
    );
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
        >
        <div className="relative flex items-center justify-center w-full h-full">
          {/* Close button - outside modal on the right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 bg-black/40 hover:bg-black/60 text-white rounded-full p-3 transition-colors backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative bg-white rounded-xl overflow-hidden shadow-2xl"
            style={{
              width: "min(85vw, 1000px)",
              height: "min(80vh, 600px)",
              maxWidth: "1000px",
              maxHeight: "600px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900">Company Ownership</h2>
            </div>

            {/* Chart and table layout */}
            <div className="overflow-auto h-[calc(100%-100px)] p-8">
              <div className="flex gap-8 items-center justify-center h-full">
                {/* Donut chart */}
                <div className="flex flex-col items-center">
                  {createDonutChart()}
                  
                  {/* Legend */}
                  <div className="mt-6 space-y-2">
                    {shareholderData.map((shareholder, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: shareholder.color }}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {shareholder.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          ({shareholder.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shareholding table */}
                <div className="flex flex-col">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border-b border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50">
                            Shareholder
                          </th>
                          <th className="border-b border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50">
                            Shares
                          </th>
                          <th className="border-b border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50">
                            Percentage
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {shareholderData.map((shareholder, index) => (
                          <tr
                            key={index}
                            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            <td className="border-b border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                              {shareholder.name}
                            </td>
                            <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-900">
                              {shareholder.shares.toLocaleString()}
                            </td>
                            <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-900">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: shareholder.color }}
                                />
                                {shareholder.percentage}%
                              </div>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-100 font-semibold">
                          <td className="border-b border-gray-300 px-4 py-3 text-sm text-gray-900">
                            Total
                          </td>
                          <td className="border-b border-gray-300 px-4 py-3 text-sm text-gray-900">
                            {totalShares.toLocaleString()}
                          </td>
                          <td className="border-b border-gray-300 px-4 py-3 text-sm text-gray-900">
                            100%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
