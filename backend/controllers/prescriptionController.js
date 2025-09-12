const Patient = require('../models/Patient');
const { sendWhatsAppMessage } = require('../services/whatsappService');
const schedule = require('node-schedule');
const fs = require("fs");
const path = require("path");   // <-- this was missing
const axios = require("axios");

// Utility: parse expiry_date with default times
function parseExpiryDate(expiry) {
  if (!expiry) return null;

  expiry = expiry.trim();

  // Extract date
  const matchDMY = expiry.match(/(\d{2}-\d{2}-\d{4})/);
  const matchYMD = expiry.match(/(\d{4}-\d{2}-\d{2})/);
  let dateStr = matchDMY ? matchDMY[1].split("-").reverse().join("-") : matchYMD ? matchYMD[1] : null;
  if (!dateStr) return null;

  // Extract time like "6:42 pm", "06:42pm", etc.
  const matchTime = expiry.match(/(\d{1,2}:\d{2})\s*(am|pm)?/i);
  let timeStr = "11:00"; // default breakfast
  if (matchTime) {
    let [hours, minutes] = matchTime[1].split(":").map(Number);
    const period = matchTime[2] ? matchTime[2].toLowerCase() : null;

    if (period === "pm" && hours < 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;

    timeStr = `${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}`;
  } else {
    // fallback to keyword-based times
    if (/after lunch/i.test(expiry)) timeStr = "13:00";
    else if (/after dinner|night|before sleep/i.test(expiry)) timeStr = "20:00";
  }

  return new Date(`${dateStr}T${timeStr}:00`);
}

// Schedule daily WhatsApp reminder until expiry
function scheduleDailyReminder(patient, prescription, reminderDate) {
  const expiry = reminderDate; // Last day to send reminder
  const hours = reminderDate.getHours();
  const minutes = reminderDate.getMinutes();

  const job = schedule.scheduleJob({ hour: hours, minute: minutes, tz: 'Asia/Kolkata' }, async function fire() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDay = new Date(expiry);
    lastDay.setHours(0, 0, 0, 0);

    if (today <= lastDay) {
      try {
        console.log(`Sending daily WhatsApp reminder to ${patient.whatsappNumber} for ${prescription.medicine}`);
        const message = `💊 Reminder: Take your medicine *${prescription.medicine}*\nDosage: ${prescription.dosage}\nTime: ${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}`;
        await sendWhatsAppMessage(patient.whatsappNumber, message);
      } catch (err) {
        console.error(`Error sending WhatsApp reminder for ${prescription.medicine}:`, err.message);
      }
    } else {
      job.cancel();
      console.log(`Stopped reminders for ${prescription.medicine} (expiry reached)`);
    }
  });
}

// --- Add prescriptions and schedule WhatsApp reminders ---
async function savePrescriptionImage(imagePathOrUrl, medicineName) {
  try {
    const uploadsDir = path.join(__dirname, "../uploads/prescriptions");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const fileName = `${Date.now()}-${medicineName.replace(/\s+/g, "_")}${path.extname(imagePathOrUrl)}`;
    const destPath = path.join(uploadsDir, fileName);

    if (fs.existsSync(imagePathOrUrl)) {
      // local file copy
      fs.copyFileSync(imagePathOrUrl, destPath);
    } else {
      // remote download
      const response = await axios.get(imagePathOrUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(destPath, response.data);
    }

    return `/uploads/prescriptions/${fileName}`;
  } catch (err) {
    console.error("Error saving image:", err.message);
    return null;
  }
}

// --- Add prescriptions and schedule WhatsApp reminders ---
exports.addPrescriptions = async (req, res) => {
  const patientId = req.params.id;
  const { prescription } = req.body;

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    for (const p of prescription) {
      const reminderDate = parseExpiryDate(p.expiry_date);

      // save image locally and get URL
      let imageUrl = null;
      if (p.image) {
        imageUrl = await savePrescriptionImage(p.image, p.medicine);
      }

      // Save prescription to DB
      const savedPrescription = {
        medicine: p.medicine,
        dosage: p.dosage,
        expiry_date: reminderDate,
        status: p.status,
        image: imageUrl
      };
      patient.prescriptions.push(savedPrescription);

      // Schedule daily WhatsApp reminder
      if (reminderDate && reminderDate.getTime() > Date.now()) {
        console.log(`Scheduling daily WhatsApp reminders for ${p.medicine} until ${reminderDate}`);
        scheduleDailyReminder(patient, p, reminderDate);
      }
    }

    await patient.save();

    res.json({
      message: "Prescriptions saved successfully",
      patientId: patient._id,
      prescriptions: patient.prescriptions
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- Get prescriptions ---
exports.getPrescriptions = async (req, res) => {
  const patientId = req.params.id;

  try {
    const patient = await Patient.findById(patientId).select('name prescriptions');
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    res.json({
      patientId: patient._id,
      name: patient.name,
      prescriptions: patient.prescriptions
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
