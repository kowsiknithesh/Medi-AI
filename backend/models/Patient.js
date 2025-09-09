const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  name: { type: String, required: true },
  age: { type: Number },
  whatsappNumber: { type: String, required: true }, // E.g., whatsapp:+919876543210
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);