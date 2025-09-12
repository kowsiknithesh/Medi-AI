const axios = require("axios");

async function sendWhatsAppMessage(to, prescription,imageUrl) {
  try {
    const accessToken = process.env.WHATSAPP_TOKEN; // your Meta Cloud API token
    const phoneNumberId = process.env.WHATSAPP_PHONE_ID; // your business number ID

    const messageData = {
      messaging_product: "whatsapp",
      to: to,
      type: "template",
      template: {
        name: "medical", // your approved template name
        language: { code: "en" },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "image",
                image: { link: `${process.env.BASE_URL}${imageUrl}` }
              }
            ]
          },
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: prescription.medicine
              }
            ]
          }
        ]
      }
    };

    console.log("Sending WhatsApp message:", messageData, `${process.env.BASE_URL}${imageUrl}`);

    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
      messageData,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    console.log("WhatsApp reminder sent:", prescription.medicine, response.data);
    return response.data;
  } catch (err) {
    console.error("Error sending WhatsApp message:", err.response?.data || err.message);
  }
}

module.exports = { sendWhatsAppMessage };
