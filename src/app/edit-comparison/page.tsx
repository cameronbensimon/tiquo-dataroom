"use client";

import { useState, useEffect } from "react";
import { competitorData } from "./competitorData";

export default function EditComparisonPage() {
  const [data, setData] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get all competitor column names (excluding metadata columns)
  const competitorColumns = [
    'tiquo', 'mews', 'fols', 'opera', 'hotix', 'lightspeed', 'toast', 'square', 
    'clover', 'salesforce', 'hubspot', 'zoho', 'pipedrive', 'memberstack', 'passkit', 
    'mindbody', 'abcGlofox', 'exercisecom', 'gymflow', 'ideas', 'atomize', 'mailchimp', 
    'klaviyo', 'brevo', 'eventtemple', 'tripleseat', 'ticketTailor', 'weezevent', 
    'ticketmaster', 'eventbrite', 'officernd', 'nexudus', 'optix'
  ];

  const competitorDisplayNames = {
    tiquo: "TIQUO",
    mews: "MEWS",
    fols: "FOLS", 
    opera: "OPERA", 
    hotix: "HOTIX",
    lightspeed: "LIGHTSPEED",
    toast: "TOAST",
    square: "SQUARE",
    clover: "CLOVER",
    salesforce: "SALESFORCE",
    hubspot: "HUBSPOT",
    zoho: "ZOHO",
    pipedrive: "PIPEDRIVE",
    memberstack: "MEMBERSTACK",
    passkit: "PASSKIT",
    mindbody: "MINDBODY",
    abcGlofox: "ABC GLOFOX",
    exercisecom: "EXERCISE.COM",
    gymflow: "GYMFLOW",
    ideas: "IDEAS",
    atomize: "ATOMIZE",
    mailchimp: "MAILCHIMP",
    klaviyo: "KLAVIYO",
    brevo: "BREVO",
    eventtemple: "EVENTTEMPLE",
    tripleseat: "TRIPLESEAT",
    ticketTailor: "TICKET TAILOR",
    weezevent: "WEEZEVENT",
    ticketmaster: "TICKETMASTER",
    eventbrite: "EVENTBRITE",
    officernd: "OFFICERND",
    nexudus: "NEXUDUS",
    optix: "OPTIX",
  };

  const options = ["Fully featured", "Limited implementation", "N/A"];

  // Load the complete competitor data
  useEffect(() => {
    setIsClient(true);
    setData(competitorData);
    setIsLoading(false);
  }, []);

  const handleValueChange = (rowIndex: number, column: string, value: string) => {
    const newData = [...data];
    (newData[rowIndex] as any)[column] = value;
    setData(newData);
  };

  // Color coding function
  const getColorClass = (value: string) => {
    switch (value) {
      case "Fully featured":
        return "bg-green-100 border-green-300 text-green-800";
      case "Limited implementation":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "N/A":
        return "bg-gray-100 border-gray-300 text-gray-600";
      default:
        return "bg-white border-gray-300 text-gray-700";
    }
  };

  const getSelectColorClass = (value: string) => {
    switch (value) {
      case "Fully featured":
        return "bg-green-50 border-green-300 text-green-800 focus:ring-green-500 focus:border-green-500";
      case "Limited implementation":
        return "bg-yellow-50 border-yellow-300 text-yellow-800 focus:ring-yellow-500 focus:border-yellow-500";
      case "N/A":
        return "bg-gray-50 border-gray-300 text-gray-600 focus:ring-gray-500 focus:border-gray-500";
      default:
        return "bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500";
    }
  };

  const downloadData = () => {
    // Create CSV content
    const headers = ['Category', 'Subcategory', 'Description', ...competitorColumns.map(col => competitorDisplayNames[col])];
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        `"${row.category}"`,
        `"${row.subcategory}"`, 
        `"${row.description}"`,
        ...competitorColumns.map(col => `"${(row as any)[col]}"`)
      ].join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feature-competitor-comparison-updated.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const copyDataToClipboard = () => {
    // Format as JavaScript object that can be copied into the modal
    const formattedData = data.map(row => {
      const formattedRow: any = {
        category: row.category,
        subcategory: row.subcategory,
        description: row.description
      };
      
      competitorColumns.forEach(col => {
        formattedRow[col] = (row as any)[col];
      });
      
      return formattedRow;
    });

    const jsString = JSON.stringify(formattedData, null, 2);
    navigator.clipboard.writeText(jsString).then(() => {
      alert('Data copied to clipboard! You can now paste this into the modal component.');
    });
  };

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading competitor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🏁 Feature Competitor Comparison Editor
          </h1>
          <p className="text-gray-600 mb-4">
            This is a temporary localhost-only page for editing the comparison table. 
            Make your changes and use the buttons below to export the updated data.
          </p>
          
          {/* Color Legend */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">🎨 Color Coding Legend:</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-sm text-green-800 font-medium">Fully featured</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                <span className="text-sm text-yellow-800 font-medium">Limited implementation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <span className="text-sm text-gray-600 font-medium">N/A</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={downloadData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              📥 Download CSV
            </button>
            <button
              onClick={copyDataToClipboard}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              📋 Copy Data Structure
            </button>
            <div className="flex items-center text-sm text-gray-500">
              ({data.length} total features)
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
            <table className="min-w-full relative">
              <thead className="bg-gray-50 border-b sticky top-0 z-30">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-20 min-w-[120px]">
                    Category
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-[120px] bg-gray-50 z-20 min-w-[200px]">
                    Subcategory
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-[320px] bg-gray-50 z-20 min-w-[300px]">
                    Description
                  </th>
                  {competitorColumns.map((col) => (
                    <th key={col} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                      {competitorDisplayNames[col]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, index) => {
                  const isEvenRow = index % 2 === 0;
                  const isCategoryRow = row.category && row.category !== "";
                  
                  return (
                    <tr 
                      key={index} 
                      className={`${isEvenRow ? 'bg-white' : 'bg-gray-50'} ${isCategoryRow ? 'border-t-2 border-blue-200' : ''}`}
                    >
                      <td className={`px-3 py-4 text-sm font-medium sticky left-0 z-10 min-w-[120px] ${isEvenRow ? 'bg-white' : 'bg-gray-50'} ${isCategoryRow ? 'text-blue-800 font-bold' : 'text-gray-900'}`}>
                        {row.category}
                      </td>
                      <td className={`px-3 py-4 text-sm sticky left-[120px] z-10 min-w-[200px] ${isEvenRow ? 'bg-white' : 'bg-gray-50'} ${isCategoryRow ? 'text-blue-700 font-semibold' : 'text-gray-900'}`}>
                        {row.subcategory}
                      </td>
                      <td className={`px-3 py-4 text-sm sticky left-[320px] z-10 min-w-[300px] text-gray-700 ${isEvenRow ? 'bg-white' : 'bg-gray-50'}`}>
                        {row.description}
                      </td>
                      {competitorColumns.map((col) => {
                        const value = (row as any)[col];
                        return (
                          <td key={col} className="px-3 py-4 text-center">
                            <select
                              value={value}
                              onChange={(e) => handleValueChange(index, col, e.target.value)}
                              className={`w-full px-2 py-1 text-sm rounded border focus:outline-none focus:ring-2 ${getSelectColorClass(value)} font-medium`}
                            >
                              {options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>✨ Instructions:</strong>
          </p>
          <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
            <li>Use the color-coded dropdowns to edit competitor feature ratings</li>
            <li>🟢 <strong>Green</strong> = Fully featured, 🟡 <strong>Yellow</strong> = Limited implementation, ⚪ <strong>Gray</strong> = N/A</li>
            <li>Click "📥 Download CSV" to get a spreadsheet file</li>
            <li>Click "📋 Copy Data Structure" to copy the JavaScript format for the modal</li>
            <li>Paste the copied data into the FeatureCompetitorComparisonModal.tsx file to update the main application</li>
          </ol>
        </div>

        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>✅ Complete Dataset Loaded:</strong> You can now edit all {data.length} features from the original modal.
            This is a temporary development page that should be deleted after use.
          </p>
        </div>
      </div>
    </div>
  );
}