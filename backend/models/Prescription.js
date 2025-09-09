const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true }, // E.g., "1 tablet", "10 ml"
  frequency: {
    type: [String], // E.g., ["Morning", "Afternoon", "Night"]
    required: true,
  },
  times: { // Exact times for reminders
      type: [String], // E.g., ["08:00", "13:00", "20:00"]
      required: true,
  },
  duration: { type: Number, required: true }, // in days
  image: { type: String }, // URL to medicine image
});

const PrescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  medicines: [MedicineSchema],
  startDate: { type: Date, default: Date.now },
  prescriptionFile: { type: String }, // URL to the uploaded PDF/image
}, { timestamps: true });

module.exports = mongoose.model('Prescription', PrescriptionSchema);