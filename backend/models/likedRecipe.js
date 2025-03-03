const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { User } = require('../models/user'); // Import the actual User model

const LikedRecipe = sequelize.define('LikedRecipe', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Use the model reference to ensure correct table name is used
      key: 'id'
    }
  },
  recipeId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  image: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  title: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  price: { 
    type: DataTypes.FLOAT, 
    allowNull: true 
  },
  ingredients: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  instructions: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  }
}, {
  timestamps: true,
});

module.exports = { LikedRecipe };
