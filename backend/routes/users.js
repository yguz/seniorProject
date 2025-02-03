const express = require('express');
const { User } = require('../models/user');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { decryptEmail } = require('../utils/encryption');

const router = express.Router();

// Route: Register a New User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, dietaryPreferences } = req.body;
    console.log("Received registration data:", { name, email, dietaryPreferences });

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    const user = await User.create({
      name,
      email, // This will be encrypted in the model hook
      password: hashedPassword,
      dietaryPreferences,
    });

    res.status(201).json({
      message: 'User registered successfully',
      userId: user.id,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user', details: error.message });
  }
});

module.exports = router;
