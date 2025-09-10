const axios = require('axios');
const Patient = require('../models/Patient');

const token = process.env.WHATSAPP_TOKEN;
const phoneId = process.env.WHATSAPP_PHONE_ID;

const sendWhatsAppMessage = async (number, message) => {
  const sanitizedNumber = '+' + number.replace(/[^0-9]/g, '');
  await axios.post(
    `https://graph.facebook.com/v17.0/${phoneId}/messages`,
    {
      messaging_product: "whatsapp",
      to: sanitizedNumber,
      text: { body: message }
    },
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );
};

const sendPrescriptionByPatientId = async (req, res) => {
  try {
    const { patientId, prescriptionIndex } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Default: send last prescription
    const prescription = patient.prescriptions[prescriptionIndex ?? patient.prescriptions.length - 1];
    if (!prescription) return res.status(404).json({ message: "Prescription not found" });

    await sendWhatsAppMessage(patient.phone, prescription.text);

    res.status(200).json({ message: "Prescription sent via WhatsApp successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending WhatsApp", error: error.message });
  }
};
module.exports = { sendPrescriptionByPatientId };