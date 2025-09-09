// backend/controllers/authController.js

const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// A helper function to generate a token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token will expire in 30 days
  });
};

// --- REGISTRATION CONTROLLER ---
exports.registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;

    // 1. Basic Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    // 2. Check if doctor already exists
    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists) {
      return res.status(400).json({ message: 'A doctor with this email already exists.' });
    }

    // 3. Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the new doctor
    const doctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
      specialization,
      // We will set firebaseUid to email for now, you can integrate full Firebase later
      firebaseUid: email, 
    });

    // 5. If doctor created successfully, send back data and a token
    if (doctor) {
      res.status(201).json({
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        token: generateToken(doctor._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid doctor data.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// --- LOGIN CONTROLLER ---
exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the doctor by email
    const doctor = await Doctor.findOne({ email });

    // 2. If doctor exists, compare the entered password with the hashed password in the DB
    if (doctor && (await bcrypt.compare(password, doctor.password))) {
      // 3. Passwords match, send back doctor info and a new token
      res.json({
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        token: generateToken(doctor._id),
      });
    } else {
      // 4. Doctor not found or password doesn't match
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};