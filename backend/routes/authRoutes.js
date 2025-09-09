// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerDoctor, loginDoctor } = require('../controllers/authController');
const { createPatient, getPatients } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const { scanPrescription } = require('../controllers/pdfController');
const upload = require('../middleware/upload');

router.post('/register', registerDoctor);
router.post('/login', loginDoctor);
router.post('/patients', protect, createPatient);
router.get('/patients', protect, getPatients);
router.post('/scan', upload.single('file'), scanPrescription);


module.exports = router;
