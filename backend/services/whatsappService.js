// backend/services/whatsappService.js
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function sendWhatsAppReminder(reminder) {
  try {
    const messageBody = `Hi! This is your medicine reminder.
    
💊 Medicine: *${reminder.medicineName}*
📝 Dosage: *${reminder.dosage}*

Please take your medicine as prescribed. Stay healthy!`;

    await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: reminder.patientWhatsappNumber,
      // mediaUrl: reminder.medicineImage // You can include an image URL
    });
    
    console.log(`Reminder sent to ${reminder.patientWhatsappNumber}`);
    return { success: true };
  } catch (error) {
    console.error(`Failed to send reminder: ${error.message}`);
    return { success: false, error };
  }
}

module.exports = { sendWhatsAppReminder };