const fs = require('fs');
const pdfParse = require('pdf-parse');

// --- Upload & Scan Prescription ---
exports.scanPrescription = async (req, res) => {
  try {
    // If no file uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    // Read file buffer
    const pdfBuffer = fs.readFileSync(req.file.path);

    // Parse PDF content
    const data = await pdfParse(pdfBuffer);

    // Delete file after reading to save space
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "PDF scanned successfully",
      text: data.text, // raw extracted text
      numPages: data.numpages,
      info: data.info
    });

  } catch (error) {
    console.error("Error parsing PDF:", error);
    res.status(500).json({ message: "Error scanning PDF", error: error.message });
  }
};
