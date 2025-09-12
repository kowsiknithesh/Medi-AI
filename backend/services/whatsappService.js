const axios = require("axios");

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN; // Meta API access token
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID; // Phone number ID from Meta

// ✅ Send message via WhatsApp Cloud API
async function sendWhatsAppMessage(to, message) {
  try {
    const url = `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log("📨 WhatsApp Message Sent:", response.data);
  } catch (error) {
    console.error("❌ WhatsApp Error:", error.response?.data || error.message);
  }
}

module.exports = { sendWhatsAppMessage };
