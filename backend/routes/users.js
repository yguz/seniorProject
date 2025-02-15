const express = require('express');
const { User } = require('../models/user');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { encryptEmail } = require('../utils/encryption');

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, dietaryPreferences } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const encryptedEmail = encryptEmail(email);
    console.log("Encrypted Email at Registration:", encryptedEmail);

    const existingUser = await User.findOne({ where: { email: encryptedEmail } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(password);
    console.log("Hashed Password at Registration:", hashedPassword);

    const user = await User.create({
      name: name || null, // Allow name to be null
      email: encryptedEmail,
      password: hashedPassword,
      dietaryPreferences: dietaryPreferences || null, // Allow dietaryPreferences to be null
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user', details: error.message });
  }
});

module.exports = router;
