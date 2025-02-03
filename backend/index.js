const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { sequelize } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');

app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

// Serve frontend files 
app.use(express.static(path.join(__dirname, '../seniorProject/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../seniorProject/dist/index.html'));
});

// Database Connection
sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully...'))
  .catch((err) => console.error('Database connection failed:', err));

sequelize
  .sync({ alter: true })
  .then(() => console.log('Database synced...'))
  .catch((err) => console.error('Database sync failed:', err));

// **Only start the server if NOT running tests**
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

// Export for testing
module.exports = app;
