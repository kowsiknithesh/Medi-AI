const Patient = require('../models/Patient');

// --- Add a new patient ---
exports.createPatient = async (req, res) => {
  try {
    const { name, age, whatsappNumber } = req.body;

    // Doctor ID will come from the logged-in doctor (via JWT auth middleware)
    const doctorId = req.user.id; 

    if (!name || !whatsappNumber) {
      return res.status(400).json({ message: "Name and WhatsApp number are required." });
    }

    const patient = await Patient.create({
      doctor: doctorId,
      name,
      age,
      whatsappNumber
    });

    res.status(201).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- Get all patients for logged-in doctor ---
exports.getPatients = async (req, res) => {
  try {
    const doctorId = req.user.id; 
    const patients = await Patient.find({ doctor: doctorId });
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
