const mongoose = require('mongoose');

const EmbeddedPrescriptionSchema = new mongoose.Schema({
  medicine: { type: String, required: true },
  dosage: { type: String, required: true },
  expiry_date: { type: Date, required: true },
  status: { type: String, default: "Active" }
}, { _id: true }); // keep _id so each prescription has its own id

const patientSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  name: String,
  age: Number,
  gender: String,
  whatsappNumber: String,
  prescriptions: [EmbeddedPrescriptionSchema]   // 👈 store inside patient
});

module.exports = mongoose.model('Patient', patientSchema);
