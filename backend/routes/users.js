const express = require('express');
const { User } = require('../models/user');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { encryptEmail } = require('../utils/encryption');

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, dietaryPreferences } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" });
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
      name,
      email: encryptedEmail,
      password: hashedPassword,
      dietaryPreferences,
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user', details: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const encryptedEmail = encryptEmail(email);
    console.log("Encrypted Email for Lookup:", encryptedEmail);

    const user = await User.findOne({ where: { email: encryptedEmail } });
    if (!user) {
      console.log("No user found with this encrypted email.");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    console.log("Stored Password in DB:", user.password);
    console.log("Plaintext Password:", password);

    // Compare password
    const isValid = await comparePassword(password, user.password);
    console.log("Password Comparison Result:", isValid);

    if (!isValid) {
      console.log("Password does not match.");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    console.log("User authenticated successfully.");
    res.status(200).json({ message: "Login successful", userId: user.id });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login', details: error.message });
  }
});

module.exports = router;
