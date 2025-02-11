const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { encryptEmail } = require('../utils/encryption');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  dietaryPreferences: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
});

// Ensure encryption only happens once before storing
User.beforeCreate(async (user) => {
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // Ensure email is only encrypted once
  if (!user.email.startsWith('51d51c')) { // Replace '51d51c' with the correct hash pattern
    user.email = encryptEmail(user.email);
  }
});

module.exports = { User };
