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
  debug: true, // Show debug output
  logger: true // Log information about the mail
});

// Verify transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("Error setting up email transporter:", error);
  } else {
    console.log("Email transporter is ready");
  }
});

// POST endpoint to handle contact form submissions
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    console.log("Received contact form submission:", { name, email, subject });

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: "Please provide name, email, and message." 
      });
    }

    // Use a default subject if none provided
    const emailSubject = subject || "New contact form submission";

    // Configure email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Use the configured email as sender
      replyTo: email, // Set reply-to to the user's email
      to: process.env.EMAIL_TO,
      subject: emailSubject,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    console.log("Attempting to send email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent successfully:", info.messageId);
    
    res.status(200).json({ 
      success: true,
      message: "Email sent successfully." 
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ 
      success: false,
      error: "Error sending email. Please try again later." 
    });
  }
});

module.exports = router;
