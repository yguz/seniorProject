const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); 
const { encryptEmail, decryptEmail } = require('../utils/encryption');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  dietaryPreferences: { type: DataTypes.STRING },
});

// Hash password and encrypt email before saving
User.beforeCreate(async (user) => {
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.email = encryptEmail(user.email); 
});

// Decrypt email after retrieving
User.afterFind((user) => {
  if (Array.isArray(user)) {
    user.forEach((u) => {
      if (u.email) {
        u.email = decryptEmail(u.email);
      }
    });
  } else if (user && user.email) {
    user.email = decryptEmail(user.email);
  }
});

module.exports = { User };
