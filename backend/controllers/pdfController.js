const fs = require("fs");
const pdfParse = require("pdf-parse");
const { fromPath } = require("pdf2pic");
const { createWorker } = require("tesseract.js");
const Patient = require("../models/Patient"); // adjust path to your model
const { sendWhatsAppMessage } = require("../controllers/whatsappController"); // adjust path

// Utility to clean text
function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

// OCR fallback for PDFs
async function runOcrOnPdf(pdfPath) {
  const options = {
    density: 300,
    saveFilename: "ocr_temp",
    savePath: "./temp",
    format: "png",
    width: 1200,
    height: 1600,
  };

  const convert = fromPath(pdfPath, options);

  // Convert first page (can loop for all pages if needed)
  const page = await convert(1);

  // Run OCR on the image
  const worker = await createWorker("eng");
  const {
    data: { text },
  } = await worker.recognize(page.path);

  await worker.terminate();

  return cleanText(text);
}

const scanSaveAndSendPrescription = async (req, res) => {
  try {
    const { patientId } = req.body;
    if (!req.file) return res.status(400).json({ message: "No PDF uploaded" });
    if (!patientId) return res.status(400).json({ message: "Patient ID is required" });

    // Fetch patient
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const pdfPath = req.file.path;
    const pdfBuffer = fs.readFileSync(pdfPath);

    let text = "";
    try {
      // Try parsing normally
      const data = await pdfParse(pdfBuffer);
      text = cleanText(data.text || "");
    } catch (err) {
      console.warn("PDF parse failed, switching to OCR:", err.message);
    }

    // If pdf-parse returned nothing, try OCR
    if (!text) {
      text = await runOcrOnPdf(pdfPath);
    }

    // Remove temp PDF
    fs.unlinkSync(pdfPath);

    if (!text) {
      return res.status(400).json({
        message: "Could not extract text from PDF (file may be corrupted or empty).",
      });
    }

    // Save prescription under patient
    patient.prescriptions.push({ text });
    await patient.save();

    // Send via WhatsApp
    if (!patient.whatsappNumber) {
      return res.status(400).json({ message: "Patient does not have a WhatsApp number" });
    }

    await sendWhatsAppMessage(patient.whatsappNumber, text);

    res.status(200).json({
      message: "Prescription saved and sent via WhatsApp successfully",
      patientId: patient._id,
      prescriptionText: text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error scanning/saving/sending prescription",
      error: error.message,
    });
  }
};

module.exports = {
  scanSaveAndSendPrescription,
};
