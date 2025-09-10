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

// Main function: scan, save, and send WhatsApp
const scanSaveAndSendPrescription = async (req, res) => {
  try {
    const { patientId } = req.body;
    if (!req.file) return res.status(400).json({ message: "No PDF uploaded" });
    if (!patientId) return res.status(400).json({ message: "Patient ID is required" });

    // Fetch patient
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Parse PDF
    const pdfBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(pdfBuffer);
    fs.unlinkSync(req.file.path);

    const text = cleanText(data.text);

    // Save prescription under patient
    patient.prescriptions.push({ text });
    await patient.save();

    // Send WhatsApp to patient's phone
    if (!patient.phone) return res.status(400).json({ message: "Patient does not have a phone number" });

    await sendWhatsAppMessage(patient.phone, text);

    res.status(200).json({
      message: "Prescription saved and sent via WhatsApp successfully",
      patientId: patient._id,
      prescriptionText: text
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error scanning/saving/sending prescription", error: error.message });
  }
};

module.exports = {
  scanSaveAndSendPrescription,
};