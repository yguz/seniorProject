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

// Ensure Routes Are Registered Before Frontend
const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');

app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

// Debugging: Print Registered Routes
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`Registered Route: ${r.route.path}`);
  }
});

// Serve Frontend Files (Must Come Last)
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'));
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

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

// Export for Testing
module.exports = app;
