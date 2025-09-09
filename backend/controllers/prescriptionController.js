// backend/controllers/prescriptionController.js
const Prescription = require('../models/Prescription');
const Reminder = require('../models/Reminder');
const Patient = require('../models/Patient');

exports.createPrescription = async (req, res) => {
  try {
    const { patientId, medicines, startDate } = req.body;
    const doctorId = req.user.id; // From authMiddleware

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const newPrescription = new Prescription({
      patient: patientId,
      doctor: doctorId,
      medicines,
      startDate: new Date(startDate),
    });

    await newPrescription.save();

    // --- Core Reminder Scheduling Logic ---
    const reminders = [];
    const start = new Date(startDate);

    medicines.forEach(med => {
      for (let day = 0; day < med.duration; day++) {
        med.times.forEach(time => {
          const [hour, minute] = time.split(':');
          const sendAt = new Date(start);
          sendAt.setDate(start.getDate() + day);
          sendAt.setHours(hour, minute, 0, 0);

          reminders.push({
            patient: patientId,
            medicineName: med.name,
            dosage: med.dosage,
            medicineImage: med.image,
            sendAt: sendAt,
            patientWhatsappNumber: patient.whatsappNumber,
          });
        });
      }
    });

    if (reminders.length > 0) {
      await Reminder.insertMany(reminders);
    }
    
    res.status(201).json(newPrescription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};