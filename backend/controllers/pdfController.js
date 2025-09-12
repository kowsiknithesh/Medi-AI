const fs = require("fs");
const pdfParse = require("pdf-parse");
const { fromPath } = require("pdf2pic");
const path = require("path");
const { createWorker } = require("tesseract.js");
const Patient = require("../models/Patient");
const OpenAI = require("openai");
const cron = require("node-cron");
const { sendWhatsAppMessage } = require("../services/whatsappService");

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
// --- AI Extraction Function ---
async function extractPrescriptionDetails(rawText) {
  const prompt = `
You are a medical prescription parser.
Extract structured data from the following text.

Rules:
1. Always return JSON in this format:
{
  "prescription": [
    {
      "medicine": "string",
      "dosage": "string",
      "expiry_date": "YYYY-MM-DD , hh:mm a", 
      "status": "Active"
    }
  ]
}

2. For expiry_date:
   - If prescription has a date → include it.
   - If it has meal/time words but no clock time, map as:
        • after breakfast → 08:00 am
        • after lunch → 01:00 pm
        • after dinner / night / before sleep → 08:00 pm
   - Always return expiry_date as: YYYY-MM-DD , hh:mm a (example: "2025-09-14 , 08:00 am").

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
    console.log("Extracting prescription details...", text);
    const extractedData = await extractPrescriptionDetails(text);
    if (!extractedData) {
      return res.status(400).json({ message: "AI could not extract prescription details" });
    }

    // ✅ Fix expiry_date formats
    const cleanedPrescriptions = extractedData.prescription.map((p) => ({
      medicine: p.medicine,
      dosage: p.dosage,
      expiry_date: p.expiry_date,
      status: p.status,
    }));

    console.log("Extracted Prescriptions:", cleanedPrescriptions);


    

    // extractedData.prescription.forEach((p) => {
    //   // Format time correctly
    //   const timeString = p.expiry_date; // e.g., "2025-09-14 , 11:10am"
    //   const reminderDate = new Date(timeString);

    //   if (isNaN(reminderDate.getTime())) {
    //     console.warn("⚠️ Invalid date format, skipping schedule:", timeString);
    //     return;
    //   }

    //   // Create cron expression
    //   const cronExpr = `${reminderDate.getMinutes()} ${reminderDate.getHours()} ${reminderDate.getDate()} ${reminderDate.getMonth() + 1} *`;

    //   console.log("⏰ Scheduling:", p.medicine, cronExpr);

    //   cron.schedule(cronExpr, async () => {
    //     const message = `💊 Reminder: Take your medicine *${p.medicine}* \nDosage: ${p.dosage} \nTime: ${p.expiry_date}`;
    //     await sendWhatsAppMessage(patient.whatsappNumber, message);
    //   });
    // });

    // Save structured prescription under patient
    // patient.prescriptions.push(...cleanedPrescriptions);
    // await patient.save();

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
