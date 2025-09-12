// backend/server.js

require('dotenv').config(); // Loads environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");

// --- Basic Setup ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); 
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => res.send('Server running!'));
app.listen(5000, () => console.log('Server started on port 5000'));


// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Routes ---
app.get('/', (req, res) => {
  res.send('Hello from the Medicine Reminder API!');
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
