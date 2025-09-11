const express = require("express");
const bodyParser = require("body-parser");
const schedule = require("node-schedule");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// Put your Meta credentials in .env or hardcode for testing
const PHONE_NUMBER_ID = "728989406959375";
const WHATSAPP_TOKEN = "EAAQ4dVISqZAYBPZArEPvTncgnfprblinDZA2mTmRgkpoQ7hAyenpNTJPK0fRVHhlio8lvNMlhDbUHxC8uYCW4Dz1A8n6vzkDT6GV8N0HhRY8F5hZBBWKKRNkjpncmktNgJrD18oIMkK5F1ZAt1dE9eDXrtYU22dZBniUAHRbjB2X7BUTQcfYP45A33TXcm2fbCvbWc3bqV77ZAuj6jI3CsN0ZAQXimidcBtTfyrdSkcoBiSTsQZDZD";

async function sendWhatsAppText(to, text) {
  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;

  try {
    const resp = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Message sent:", resp.data);
    return resp.data;
  } catch (err) {
    console.error("WhatsApp API error:", err.response?.data || err.message);
    throw err;
  }
}

// API route to schedule message
app.post("/schedule", async (req, res) => {
  try {
    const { phone, time, text } = req.body;
    if (!phone || !time || !text) {
      return res.status(400).json({ error: "phone, time, text required" });
    }

    // If time is a full datetime string, parse it; if only "HH:MM", assume today
    let date;
    if (/^\d{2}:\d{2}$/.test(time)) {
      const [hour, minute] = time.split(":").map(Number);
      date = new Date();
      date.setHours(hour, minute, 0, 0);
      if (date < new Date()) {
        date.setDate(date.getDate() + 1); // schedule for tomorrow if time passed
      }
    } else {
      date = new Date(time); // full datetime string like "2025-09-11T15:30:00"
    }

    // Schedule job
    schedule.scheduleJob(date, async () => {
      console.log(`Sending scheduled message to ${phone} at ${date}`);
      await sendWhatsAppText(phone, text);
    });

    res.json({ message: "Scheduled successfully", phone, time: date.toString(), text });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
