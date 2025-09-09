// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { registerDoctor, loginDoctor } = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new doctor
// @access  Public
router.post('/register', registerDoctor);

// @route   POST /api/auth/login
// @desc    Authenticate doctor & get token
// @access  Public
router.post('/login', loginDoctor);

module.exports = router;