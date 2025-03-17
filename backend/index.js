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

// Register Routes
const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');
const likesRoutes = require('./routes/likes');
// Contact Route
const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);


app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/likes', likesRoutes);

// Debugging: Print Registered Routes
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`Registered Route: ${r.route.path}`);
  }
});



// Serve Frontend Files (Only if in Production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../src')));
}

// Handle Unknown API Routes
app.get('*', (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Database Connection
sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully...'))
  .catch((err) => console.error('Database connection failed:', err));

// Connect to database and initialize tables if they don't exist
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database synced (tables created if they don\'t exist)');
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => console.error('Database sync failed:', err));

module.exports = app;
