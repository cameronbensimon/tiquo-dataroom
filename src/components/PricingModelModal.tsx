"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PricingTable {
  title: string;
  headers: string[];
  rows: (string | number | boolean)[][];
  editableColumns?: number[]; // Column indices that are editable
}

interface PricingModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  leftTable: PricingTable;
  rightTables: [PricingTable, PricingTable];
  title?: string;
}

export default function PricingModelModal({ isOpen, onClose, leftTable, rightTables, title = "Pricing Model Viewer" }: PricingModelModalProps) {
  const [editableData, setEditableData] = useState<(string | number | boolean)[][]>([]);
  const [editableData2, setEditableData2] = useState<(string | number | boolean)[][]>([]);

  // Initialize editable data when modal opens
  useEffect(() => {
    if (isOpen && rightTables[0]) {
      setEditableData([...rightTables[0].rows]);
    }
    if (isOpen && rightTables[1]) {
      setEditableData2([...rightTables[1].rows]);
    }
  }, [isOpen, rightTables]);

  // Calculate formula-based values
  const calculateValue = (rowIndex: number, colIndex: number, value: string | number | boolean): number | string | boolean => {
    // If it's an empty string, return empty
    if (value === "" || value === null || value === undefined) return "";
    
    // If it's not a string formula, return as-is
    if (typeof value !== 'string' || !value.startsWith('=')) return value;
    
    const subLocations = editableData[rowIndex]?.[1] as number || 0;
    
    // Handle different formulas based on column
    switch (colIndex) {
      case 2: // £300/month column
        return subLocations * 300;
      case 3: // 500k Revenue (1%) column  
        if (value.includes('500000')) {
          return (subLocations * 500000) * 0.01;
        }
        return "";
      case 4: // 1M Revenue (0.5%) column
        if (value.includes('1000000')) {
          return (subLocations * 1000000) * 0.005;
        }
        return "";
      case 5: // Revenue per year column
        const monthlyRevenue = subLocations * 300;
        const originalRow = rightTables[0].rows[rowIndex];
        const commission1 = originalRow[3] && originalRow[3] !== "" ? (subLocations * 500000) * 0.01 : 0;
        const commission2 = originalRow[4] && originalRow[4] !== "" ? (subLocations * 1000000) * 0.005 : 0;
        return (monthlyRevenue * 12) + commission1 + commission2;
    }
    
    return value;
  };

  // Handle cell editing for first table
  const handleCellEdit = (rowIndex: number, colIndex: number, newValue: string) => {
    const numValue = Number(newValue);
    const updatedData = [...editableData];
    updatedData[rowIndex] = [...updatedData[rowIndex]];
    updatedData[rowIndex][colIndex] = isNaN(numValue) ? newValue : numValue;
    setEditableData(updatedData);
  };

  // Handle cell editing for second table
  const handleCellEdit2 = (rowIndex: number, colIndex: number, newValue: string) => {
    const numValue = Number(newValue);
    const updatedData = [...editableData2];
    updatedData[rowIndex] = [...updatedData[rowIndex]];
    updatedData[rowIndex][colIndex] = isNaN(numValue) ? newValue : numValue;
    setEditableData2(updatedData);
  };

  // Calculate revenue formula for second table
  const calculateRevenueFormula = (rowIndex: number, colIndex: number, value: string | number | boolean): number | string | boolean => {
    if (typeof value !== 'string' || !value.includes('SUMREVENUE')) return value;
    
    // Get the revenue per year values from the Property Size and Revenue table (column 5)
    const veryLargeRevenue = calculateValue(0, 5, editableData[0]?.[5]) as number || 0;
    const largeRevenue = calculateValue(1, 5, editableData[1]?.[5]) as number || 0;
    const mediumRevenue = calculateValue(2, 5, editableData[2]?.[5]) as number || 0;
    const smallRevenue = calculateValue(3, 5, editableData[3]?.[5]) as number || 0;
    
    // Get the corresponding year values from the current table
    const veryLargeCount = editableData2[0]?.[colIndex] as number || 0;
    const largeCount = editableData2[1]?.[colIndex] as number || 0;
    const mediumCount = editableData2[2]?.[colIndex] as number || 0;
    const smallCount = editableData2[3]?.[colIndex] as number || 0;
    
    // Calculate total revenue: (count * revenue per year) for each property type
    return (veryLargeCount * veryLargeRevenue) + 
           (largeCount * largeRevenue) + 
           (mediumCount * mediumRevenue) + 
           (smallCount * smallRevenue);
  };

  // Render table cell
  const renderCell = (cell: string | number | boolean, rowIndex: number, colIndex: number, isEditable: boolean = false, useEditableData: boolean = false, isTable2: boolean = false) => {
    // Use appropriate editable data based on table
    const actualCell = useEditableData 
      ? (isTable2 ? editableData2[rowIndex]?.[colIndex] : editableData[rowIndex]?.[colIndex]) 
      : cell;
    
    if (typeof actualCell === 'boolean') {
      return (
        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
          actualCell ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {actualCell ? '✓' : '✗'}
        </span>
      );
    }

    if (isEditable && rowIndex < 4) { // Don't allow editing the revenue row (row 5, index 4) or empty row
      return (
        <input
          type="number"
          value={actualCell as number || ""}
          onChange={(e) => isTable2 
            ? handleCellEdit2(rowIndex, colIndex, e.target.value)
            : handleCellEdit(rowIndex, colIndex, e.target.value)
          }
          className="w-full bg-transparent border-none outline-none text-sm text-gray-900 p-1 rounded hover:bg-blue-50 focus:bg-blue-50"
          placeholder={actualCell === "" ? "0" : ""}
        />
      );
    }

    // Calculate formulas
    let calculatedValue;
    if (isTable2 && typeof actualCell === 'string' && actualCell.includes('SUMREVENUE')) {
      calculatedValue = calculateRevenueFormula(rowIndex, colIndex, actualCell);
    } else {
      calculatedValue = calculateValue(rowIndex, colIndex, actualCell);
    }
    
    // Handle empty values
    if (calculatedValue === "" || calculatedValue === null) {
      return "";
    }
    
    // Format numbers as currency for revenue columns
    if (typeof calculatedValue === 'number' && colIndex > 0) {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(calculatedValue);
    }

    return calculatedValue;
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
            className="absolute top-4 right-4 z-30 bg-black/40 hover:bg-black/60 text-white rounded-full p-3 transition-colors backdrop-blur-sm cursor-pointer"
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
              width: "min(95vw, 1400px)",
              height: "min(90vh, 800px)",
              maxWidth: "1400px",
              maxHeight: "800px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900">Pricing & Strategy</h2>
            </div>

            {/* Three-table layout */}
            <div className="overflow-auto h-[calc(100%-100px)] p-6 pb-8">
              <div className="grid grid-cols-2 gap-6 h-full pb-4">
                {/* Left table - Sub-locations */}
                <div className="flex flex-col mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{leftTable.title}</h3>
                  <div className="overflow-auto flex-1 border border-gray-200 rounded-lg">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          {leftTable.headers.map((header, index) => (
                            <th
                              key={index}
                              className="border-b border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700 bg-gray-50"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {leftTable.rows.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="border-b border-gray-200 px-3 py-2 text-sm text-gray-900"
                              >
                                {typeof cell === 'boolean' 
                                  ? (
                                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                      cell 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {cell ? '✓' : '✗'}
                                    </span>
                                  )
                                  : cell
                                }
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right column - Two stacked tables */}
                <div className="flex flex-col gap-6 mb-6">
                  {/* Top right table */}
                  <div className="flex flex-col flex-1 mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{rightTables[0].title}</h3>
                    <div className="overflow-auto flex-1 border border-gray-200 rounded-lg">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            {rightTables[0].headers.map((header, index) => (
                              <th
                                key={index}
                                className={`border-b border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700 ${
                                  index === 5 ? "bg-amber-100 text-amber-900" : "bg-gray-50"
                                }`}
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {editableData.map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                            >
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className={`border-b border-gray-200 px-3 py-2 text-sm ${
                                    cellIndex === 5 ? "bg-amber-50 text-amber-900 font-medium" : "text-gray-900"
                                  }`}
                                >
                                  {renderCell(
                                    cell, 
                                    rowIndex, 
                                    cellIndex, 
                                    rightTables[0].editableColumns?.includes(cellIndex) || false,
                                    true
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Bottom right table */}
                  <div className="flex flex-col flex-1 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{rightTables[1].title}</h3>
                    <div className="overflow-auto flex-1 border border-gray-200 rounded-lg">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            {rightTables[1].headers.map((header, index) => (
                              <th
                                key={index}
                                className="border-b border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700 bg-gray-50"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {editableData2.map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className={`${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"} ${
                                rowIndex === 5 ? "bg-amber-50" : ""
                              }`}
                            >
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className={`border-b border-gray-200 px-3 py-2 text-sm ${
                                    rowIndex === 5 ? "bg-amber-50 text-amber-900 font-medium" : "text-gray-900"
                                  }`}
                                >
                                  {renderCell(
                                    cell, 
                                    rowIndex, 
                                    cellIndex, 
                                    rightTables[1].editableColumns?.includes(cellIndex) || false,
                                    true,
                                    true
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
