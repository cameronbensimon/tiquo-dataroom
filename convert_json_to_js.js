// Script to convert the JSON file to a JavaScript constant
const fs = require('fs');

// Read the JSON file
const jsonData = JSON.parse(fs.readFileSync('public/extracted_competitor_data.json', 'utf8'));

console.log(`Converting ${jsonData.length} rows to JavaScript constant...`);

// Convert to JavaScript constant format
const jsContent = `// Auto-generated complete competitor data
export const competitorData = ${JSON.stringify(jsonData, null, 2)};`;

// Write to a new file
fs.writeFileSync('src/app/edit-comparison/competitorData.ts', jsContent);

console.log('✅ Data converted to src/app/edit-comparison/competitorData.ts');
