const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: true }, // Name is now optional
  email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  dietaryPreferences: { type: DataTypes.STRING, allowNull: true }, // Dietary preference is now optional
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
});

// Export only after defining the model to prevent circular dependency issues
module.exports = { User };
