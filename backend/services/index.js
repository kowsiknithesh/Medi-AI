// backend/server.js
const cron = require('node-cron');
const Reminder = require('./models/Reminder');
const { sendWhatsAppReminder } = require('./services/whatsappService');

// ... (your other express app setup)

// Schedule a task to run every minute
cron.schedule('* * * * *', async () => {
  console.log('Running cron job to check for reminders...');
  
  const now = new Date();
  const oneMinuteFromNow = new Date(now.getTime() + 60000);

  try {
    const remindersToSend = await Reminder.find({
      status: 'pending',
      sendAt: { $gte: now, $lt: oneMinuteFromNow },
    });

    for (const reminder of remindersToSend) {
      const result = await sendWhatsAppReminder(reminder);
      if (result.success) {
        reminder.status = 'sent';
      } else {
        reminder.status = 'failed';
      }
      await reminder.save();
    }
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});

const authRoutes = require('./routes/authRoutes');

// Use auth routes
app.use('/api/auth', authRoutes);

// ... (app.listen)