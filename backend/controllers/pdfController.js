const fs = require('fs');
const pdfParse = require('pdf-parse');
const Patient = require('../models/Patient');
const axios = require('axios');

const token = process.env.WHATSAPP_TOKEN;
const phoneId = process.env.WHATSAPP_PHONE_ID;

// WhatsApp sender
const sendWhatsAppMessage = async (number, message) => {
  const sanitizedNumber = '+' + number.replace(/[^0-9]/g, ''); // only digits
  await axios.post(
    `https://graph.facebook.com/v17.0/${phoneId}/messages`,
    {
      messaging_product: "whatsapp",
      to: sanitizedNumber,
      text: { body: message },
    },
    {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    }
  );
};

// Helper: clean PDF text
const cleanText = (text) => text.replace(/\r?\n|\r/g, ' ').trim();

// OCR fallback: extract text from images
const runOcrOnPdf = async (pdfPath) => {
  const options = {
    density: 200,
    saveFilename: 'temp',
    savePath: './uploads',
    format: 'png',
    width: 1200,
    height: 1600,
  };

  const convert = fromPath(pdfPath, options);
  let ocrText = '';

  // Convert first 3 pages (to avoid performance issues on big PDFs)
  for (let page = 1; page <= 3; page++) {
    try {
      const result = await convert(page);
      const { data: { text } } = await Tesseract.recognize(result.path, 'eng');
      ocrText += ' ' + text;
    } catch (err) {
      console.error(`OCR failed on page ${page}:`, err.message);
    }
  }

  return cleanText(ocrText);
};

// Main function
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

    let text = '';
    try {
      // Try parsing normally
      const data = await pdfParse(pdfBuffer);
      text = cleanText(data.text || '');
    } catch (err) {
      console.warn("PDF parse failed, switching to OCR:", err.message);
    }

    // If pdf-parse returned nothing, try OCR
    if (!text) {
      text = await runOcrOnPdf(pdfPath);
    }

    // Remove temp file
    fs.unlinkSync(pdfPath);

    if (!text) {
      return res.status(400).json({ message: "Could not extract text from PDF (file may be corrupted or empty)." });
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