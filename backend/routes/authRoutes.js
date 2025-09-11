// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Controllers
const { registerDoctor, loginDoctor } = require('../controllers/authController');
const { createPatient, getPatients } = require('../controllers/patientController');
const { scanAndSavePrescription } = require('../controllers/pdfController');
const { sendPrescriptionByPatientId } = require('../controllers/whatsappController');
const prescriptionController = require('../controllers/prescriptionController');

// Middleware
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// --- Auth Routes ---
router.post('/register', registerDoctor);
router.post('/login', loginDoctor);

// --- Patient Routes ---
router.post('/patients', protect, createPatient);
router.get('/patients', protect, getPatients);

// --- Prescription (PDF Upload + OCR) ---
router.post('/scan', protect, upload.single('pdf'), scanAndSavePrescription);

// --- WhatsApp Prescription Sender ---
router.post('/send', protect, sendPrescriptionByPatientId);

console.log("protect:", typeof protect);  // should print 'function'
console.log("sendPrescriptionByPatientId:", typeof sendPrescriptionByPatientId); // should print 'function'
router.get('/prescriptions/:id', protect, prescriptionController.getPrescriptions);

// POST /api/prescriptions/:id
router.post('/prescriptions/:id', protect, prescriptionController.addPrescriptions);
module.exports = router;
