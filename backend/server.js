// backend/server.js

require('dotenv').config(); // Loads environment variables from .env file
const express = require('express');

// --- Basic Setup ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// This allows your frontend to make requests to this backend
const cors = require('cors'); 
app.use(cors());

// This allows the server to accept and parse JSON in request bodies
app.use(express.json());

// --- Basic Test Route ---
// A simple route to check if the server is running
app.get('/', (req, res) => {
  res.send('Hello from the Medicine Reminder API!');
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});