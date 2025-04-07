const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('Database Configuration:', {
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  // Don't log password
});

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: (msg) => console.log('Sequelize:', msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');
    
    // Log the current models
    console.log('Registered Models:', Object.keys(sequelize.models));
    
    // Log table information
    const tables = await sequelize.showAllSchemas();
    console.log('Database Tables:', tables);
    
  } catch (error) {
    console.error('✗ Unable to connect to the database:', error.message);
    console.error('Error details:', error);
  }
};

testConnection();

module.exports = { sequelize };
