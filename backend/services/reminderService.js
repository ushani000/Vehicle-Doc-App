// backend/services/reminderService.js
const { Reminder, User } = require('../models');
const { sendReminderEmail } = require('./emailService');
const { Queue, Worker } = require('bullmq');  // 👈 ADDED Worker import

// Create Redis connection configuration
const redisConfig = {  // 👈 UPDATED: Consolidated config
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined  // 👈 ADDED password
};

// Create queue with config
const reminderQueue = new Queue('reminders', { connection: redisConfig });

// Function to schedule reminders
const scheduleReminder = async (userId, documentId, expireDate, reminderDate, sendEmail, sendSMS) => {
  // Save to database
  const reminder = await Reminder.create({
    userId,
    documentId,
    expireDate,
    reminderDate,
    sendEmail,
    sendSMS
  });

  // Calculate delay in milliseconds
  const delay = new Date(reminderDate) - new Date();
  
  // Add to queue
  await reminderQueue.add(
    'send-reminder',
    { reminderId: reminder.id },
    { delay }
  );

  return reminder;
};

// Worker to process reminders
const startReminderWorker = () => {
  const worker = new Worker('reminders', async job => {
    const { reminderId } = job.data;
    const reminder = await Reminder.findByPk(reminderId, {
      include: [{ model: User, as: 'user' }]
    });

    if (!reminder || reminder.sent) return;
    
    try {
      if (reminder.sendEmail) {
        await sendReminderEmail(
          reminder.user, 
          { title: reminder.documentId },
          reminder.expireDate
        );
      }
      
      // SMS implementation would go here
      
      await reminder.update({ sent: true });
    } catch (error) {
      console.error(`Failed to send reminder ${reminderId}:`, error);
    }
  }, { connection: redisConfig });  // 👈 ADDED: Connection config to worker

  return worker;
};

module.exports = {
  scheduleReminder,
  startReminderWorker,
  redisConfig 
};