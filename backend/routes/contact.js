const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

// Create a Nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true", // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error setting up email transporter:", error);
  } else {
    console.log("Email transporter is ready");
  }
});

// POST endpoint to handle contact form submissions
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Please provide name, email, subject, and message." });
  }

  // Configure email options
  const mailOptions = {
    from: `"${name}" <${email}>`, // sender address from the contact form
    to: process.env.EMAIL_TO,      // your email address to receive messages
    subject: subject,
    text: message,
    html: `<p>${message}</p>`,
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Error sending email." });
  }
});

module.exports = router;
