const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  name: String,
  age: Number,
  gender: String,
  whatsappNumber: String, // WhatsApp number
  prescriptions: [
    {
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Patient', patientSchema);
