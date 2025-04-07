const express = require('express');
const { User } = require('../models/user');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { encryptEmail } = require('../utils/encryption');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const bcrypt = require('bcrypt');

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

// Debug route to check database state
router.get('/debug', async (req, res) => {
  try {
    const userCount = await User.count();
    const tables = await User.sequelize.showAllSchemas();
    res.json({
      userCount,
      tables,
      models: Object.keys(User.sequelize.models),
      userAttributes: Object.keys(User.rawAttributes)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register Route
router.post('/register', async (req, res) => {
  console.log('\n=== New Registration Attempt ===');
  console.log('Request body:', {
    ...req.body,
    password: req.body.password ? '[HIDDEN]' : undefined
  });

  try {
    // Accept either username or name field
    const username = req.body.username || req.body.name;
    const { email, password } = req.body;

    // Log validation
    console.log('Validating fields:', {
      username: !!username,
      email: !!email,
      password: !!password
    });

    if (!username || !email || !password) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        error: 'Missing required fields',
        missing: {
          username: !username,
          email: !email,
          password: !password
        }
      });
    }

    // Check existing user
    console.log('Checking for existing user with email:', email);
    const existingUser = await User.findOne({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      console.log('❌ Registration failed: Email already exists');
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Create user
    console.log('Creating new user...');
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    console.log('✓ User created successfully:', {
      id: user.id,
      username: user.username,
      email: user.email
    });

    res.status(201).json({
      userId: user.id,
      username: user.username,
      email: user.email
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Failed to register user',
      details: error.message
    });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt received:', {
      ...req.body,
      password: req.body.password ? '[HIDDEN]' : undefined
    });

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      console.log('Missing login fields:', {
        email: !!email,
        password: !!password
      });
      return res.status(400).json({
        error: 'Missing required fields',
        missing: {
          email: !email,
          password: !password
        }
      });
    }

    // Find user
    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('User logged in successfully:', {
      id: user.id,
      username: user.username,
      email: user.email
    });

    // Return user data (excluding password)
    res.json({
      userId: user.id,
      username: user.username,
      email: user.email
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Failed to log in',
      details: error.message
    });
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
    const hashedPassword = await bcrypt.hash(password, 10);
    
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

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'email', 'dietaryPreferences'] // Exclude password
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    logger.error('Error fetching user:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user',
      details: error.message
    });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { username, email, dietaryPreferences } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (dietaryPreferences) user.dietaryPreferences = dietaryPreferences;

    await user.save();

    res.json({
      userId: user.id,
      username: user.username,
      email: user.email,
      dietaryPreferences: user.dietaryPreferences
    });

  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(500).json({ 
      error: 'Failed to update user',
      details: error.message
    });
  }
});

module.exports = router;
