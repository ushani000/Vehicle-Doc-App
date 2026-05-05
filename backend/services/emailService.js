// backend/services/emailService.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendReminderEmail = (user, document, expireDate) => {
  const msg = {
    to: user.email,
    from: 'reminders@yourdomain.com', // Use your verified SendGrid sender
    subject: `Document Expiry Reminder: ${document.title}`,
    text: `Hello ${user.name},\n\nYour ${document.title} expires on ${expireDate.toDateString()}.\n\nPlease renew it soon!`,
    html: `<p>Hello ${user.name},</p>
           <p>Your <strong>${document.title}</strong> expires on ${expireDate.toDateString()}.</p>
           <p>Please renew it soon!</p>`
  };

  return sgMail.send(msg);
};

module.exports = { sendReminderEmail };