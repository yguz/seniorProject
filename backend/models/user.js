const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

console.log('Initializing User Model...');

const User = sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 50]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      len: [5, 255]
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  dietaryPreferences: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
}, {
  tableName: 'Users',
  timestamps: true,
  hooks: {
    beforeValidate: (user, options) => {
      console.log('Validating user:', {
        id: user.id,
        username: user.username,
        email: user.email,
        // Don't log password
      });
    },
    afterCreate: (user, options) => {
      console.log('User created:', {
        id: user.id,
        username: user.username,
        email: user.email,
        // Don't log password
      });
    },
    beforeFind: (options) => {
      console.log('Finding user with options:', {
        where: options.where,
        // Don't log sensitive data
      });
    }
  },
  indexes: [
    {
      unique: true,
      fields: ['email']
    }
  ]
});

// Log model initialization
console.log('User Model initialized with attributes:', Object.keys(User.rawAttributes));
console.log('User Model table name:', User.tableName);

module.exports = { User };
