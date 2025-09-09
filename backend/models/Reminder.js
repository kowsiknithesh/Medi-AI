const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  medicineName: { type: String, required: true },
  dosage: { type: String, required: true },
  medicineImage: { type: String },
  sendAt: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  patientWhatsappNumber: { type: String, required: true },
}, { timestamps: true });

// Index for efficient querying by the cron job
ReminderSchema.index({ status: 1, sendAt: 1 });

module.exports = mongoose.model('Reminder', ReminderSchema);
