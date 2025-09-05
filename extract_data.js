// Script to extract all competitor data from the modal file
const fs = require('fs');

// Read the modal file
const modalContent = fs.readFileSync('src/components/FeatureCompetitorComparisonModal.tsx', 'utf8');

// Extract all data rows that match the pattern
const dataRows = [];
const lines = modalContent.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Look for lines that contain category, subcategory, description and competitor data
  if (line.startsWith('{ category:') && line.includes('subcategory:') && line.includes('description:')) {
    // Clean up the line and add it
    const cleanLine = line.replace(/,$/, ''); // Remove trailing comma
    dataRows.push(cleanLine);
  }
}

console.log(`Found ${dataRows.length} data rows`);

// Parse each row to extract structured data
const structuredData = dataRows.map((row, index) => {
  try {
    // Convert to proper JavaScript object
    const jsCode = `(${row})`;
    const rowData = eval(jsCode);
    return rowData;
  } catch (error) {
    console.error(`Error parsing row ${index}: ${error.message}`);
    return null;
  }
}).filter(row => row !== null);

console.log(`Successfully parsed ${structuredData.length} rows`);

// Write the extracted data to a file
fs.writeFileSync('extracted_competitor_data.json', JSON.stringify(structuredData, null, 2));

console.log('Data extracted to extracted_competitor_data.json');
