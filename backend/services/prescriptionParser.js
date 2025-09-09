// backend/services/prescriptionParser.js
const Tesseract = require('tesseract.js');

async function parsePrescriptionImage(imageBuffer) {
  try {
    const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
    
    // Basic parsing logic (can be greatly improved with regex and NLP)
    const lines = text.split('\n');
    const medicines = [];
    
    // Example: Look for lines containing keywords
    // This is a VERY simplified example.
    lines.forEach(line => {
      if (line.toLowerCase().includes('tablet') || line.toLowerCase().includes('capsule')) {
         // Try to extract name, dosage, frequency
         // E.g., "Paracetamol 500mg - 1 tablet - Morning, Night"
         // You'd use complex regex here.
         medicines.push({
             name: 'Extracted Medicine Name',
             dosage: 'Extracted Dosage',
             frequency: ['Morning', 'Night'],
             duration: 7, // Default or extracted
         });
      }
    });

    return { success: true, text, extractedData: medicines };
  } catch (error) {
    console.error('Error parsing prescription:', error);
    return { success: false, error: 'Failed to parse image.' };
  }
}

module.exports = { parsePrescriptionImage };