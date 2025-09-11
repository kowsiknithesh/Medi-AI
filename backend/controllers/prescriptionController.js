const Patient = require('../models/Patient');


exports.addPrescriptions = async (req, res) => {
  const patientId = req.params.id;
  const { prescription } = req.body;

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    prescription.forEach(p => {
      patient.prescriptions.push({
        medicine: p.medicine,
        dosage: p.dosage,
        expiry_date: p.expiry_date,
        status: p.status
      });
    });

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


exports.getPrescriptions = async (req, res) => {
  const patientId = req.params.id;

  try {
    const patient = await Patient.findById(patientId).select('name prescriptions');
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({
      patientId: patient._id,
      name: patient.name,
      prescriptions: patient.prescriptions  // 👈 includes all fields
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
