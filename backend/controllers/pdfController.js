const fs = require("fs");
const pdfParse = require("pdf-parse");
const { fromPath } = require("pdf2pic");
const path = require("path");
const { createWorker } = require("tesseract.js");
const Patient = require("../models/Patient");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Utility to clean text ---
function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

// --- Normalize date into ISO ---
function normalizeDate(dateStr) {
  if (!dateStr) return null;
  dateStr = dateStr.trim();

  // ✅ Case: DD-MM-YYYY
  const fullMatch = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;
  if (fullMatch.test(dateStr)) {
    const [_, d, m, y] = dateStr.match(fullMatch);
    return new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
  }

  // ✅ Case: MM-YYYY
  const monthYearMatch = /^(\d{1,2})-(\d{4})$/;
  if (monthYearMatch.test(dateStr)) {
    const [_, m, y] = dateStr.match(monthYearMatch);
    // Use last day of the month
    const lastDay = new Date(y, parseInt(m), 0).getDate();
    return new Date(`${y}-${m.padStart(2, "0")}-${lastDay}`);
  }

  // ✅ Case: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr);
  }

  // ❌ Fallback
  return null;
}

// --- OCR fallback for PDFs ---
async function runOcrOnPdf(pdfPath) {
  const tempDir = path.join(__dirname, "../temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const options = {
    density: 300,
    saveFilename: "ocr_temp",
    savePath: tempDir,
    format: "png",
    width: 1200,
    height: 1600,
  };

  const convert = fromPath(pdfPath, options);
  const page = await convert(1);

  const worker = await createWorker("eng");
  const {
    data: { text },
  } = await worker.recognize(page.path);

  await worker.terminate();
  return cleanText(text);
}

// --- AI Extraction Function ---
async function extractPrescriptionDetails(rawText) {
  const prompt = `
You are a medical prescription parser.
Extract structured data from the following text.
Return JSON with an array of medicines:

{
  "prescription": [
    {
      "medicine": "string",
      "dosage": "string",
      "expiry_date": "string",
      "status": "string"
    }
  ]
}

Prescription text:
"""${rawText}"""
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  try {
    return JSON.parse(response.choices[0].message.content);
  } catch (err) {
    console.error("AI JSON parse error:", err.message);
    return null;
  }
}

// --- Main Flow ---
const scanAndSavePrescription = async (req, res) => {
  try {
    const { patientId } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No PDF file uploaded" });
    if (!patientId) return res.status(400).json({ message: "Patient ID is required" });

    // Fetch patient
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const pdfPath = file.path;
    const pdfBuffer = fs.readFileSync(pdfPath);

    let text = "";
    try {
      const data = await pdfParse(pdfBuffer);
      text = cleanText(data.text || "");
    } catch (err) {
      console.warn("PDF parse failed, switching to OCR:", err.message);
    }

    if (!text) {
      text = await runOcrOnPdf(pdfPath);
    }

    fs.unlinkSync(pdfPath); // delete temp PDF

    if (!text) {
      return res.status(400).json({
        message: "Could not extract text from PDF (file may be corrupted or empty).",
      });
    }

    // AI extraction step
    const extractedData = await extractPrescriptionDetails(text);
    if (!extractedData) {
      return res.status(400).json({ message: "AI could not extract prescription details" });
    }

    // ✅ Fix expiry_date formats
    const cleanedPrescriptions = extractedData.prescription.map((p) => ({
      medicine: p.medicine,
      dosage: p.dosage,
      expiry_date: normalizeDate(p.expiry_date),
      status: p.status,
    }));

    console.log("Cleaned Prescriptions:", cleanedPrescriptions);

    // Save structured prescription under patient
    patient.prescriptions.push(...cleanedPrescriptions);
    await patient.save();

    res.status(200).json({
      message: "Prescription saved successfully",
      patientId: patient._id,
      prescription: cleanedPrescriptions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error scanning/saving prescription",
      error: error.message,
    });
  }
};

module.exports = {
  scanAndSavePrescription,
};
