const express = require('express');
const { User } = require('../models/user');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { encryptEmail } = require('../utils/encryption');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
require('dotenv').config();

const router = express.Router();

// Set up mailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: false, // Disable debug logging
  logger: false, // Disable logger
  silent: true // Completely silence all logs
});

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, dietaryPreferences } = req.body;

    if (!email || !password) {
      logger.info("Registration attempt missing required fields");
      return res.status(400).json({ error: "Email and password are required." });
    }

    const encryptedEmail = encryptEmail(email);

    const existingUser = await User.findOne({ where: { email: encryptedEmail } });
    if (existingUser) {
      logger.info("Registration attempt with existing email");
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name: name || null,
      email: encryptedEmail,
      password: hashedPassword,
      dietaryPreferences: dietaryPreferences || null,
    });

    logger.server(`New user registered with ID: ${user.id}`);
    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    logger.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user', details: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logger.info("Login attempt missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    const encryptedEmail = encryptEmail(email);

    const user = await User.findOne({ where: { email: encryptedEmail } });
    if (!user) {
      logger.info("Login attempt with non-existent email");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      logger.info("Login attempt with invalid password");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    logger.server(`User logged in with ID: ${user.id}`);
    res.status(200).json({ message: "Login successful", userId: user.id, name: user.name });
  } catch (error) {
    logger.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login', details: error.message });
  }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    
    // Find user with the email
    const encryptedEmail = encryptEmail(email);
    const user = await User.findOne({ where: { email: encryptedEmail } });
    
    if (!user) {
      // For security reasons, we still return a success response
      // even if the email doesn't exist in our database
      return res.status(200).json({ message: "If an account exists, a password reset link has been sent." });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
    
    // Save the reset token to the user's record
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();
    
    // Create reset URL with token
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    
    // Send email with reset link
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Reset Your Password</h1>
        <p>You requested a password reset for your Budget Meals account.</p>
        <p>Click the link below to set a new password:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    logger.server('Password reset email sent');
    
    res.status(200).json({ message: "If an account exists, a password reset link has been sent." });
  } catch (error) {
    logger.error('Error with password reset request:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// Verify reset token
router.get('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find user with valid token that hasn't expired
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          [Op.gt]: new Date() // Op.gt = greater than current time
        }
      }
    });
    
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }
    
    res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    logger.error('Error verifying reset token:', error);
    res.status(500).json({ error: 'Failed to verify reset token' });
  }
});

// Reset password with token
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    
    // Find user with valid token that hasn't expired
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          [Op.gt]: new Date() // Op.gt = greater than current time
        }
      }
    });
    
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }
    
    // Hash the new password
    const hashedPassword = await hashPassword(password);
    
    // Update user's password and clear reset token fields
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    
    logger.server(`Password reset successful for user ID: ${user.id}`);
    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    logger.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

module.exports = router;
