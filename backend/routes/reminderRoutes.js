// backend/routes/reminderRoutes.js
const express = require('express');
const router = express.Router();
const { scheduleReminder } = require('../services/reminderService');

router.post('/set-reminder', async (req, res) => {
  try {
    const { userId, documentId, expireDate, reminderDate, sendEmail, sendSMS } = req.body;
    
    const reminder = await scheduleReminder(
      userId,
      documentId,
      new Date(expireDate),
      new Date(reminderDate),
      sendEmail,
      sendSMS
    );
    
    res.status(201).json(reminder);
  } catch (error) {
    console.error('Error setting reminder:', error);
    res.status(500).json({ error: 'Failed to set reminder' });
  }
});

module.exports = router;