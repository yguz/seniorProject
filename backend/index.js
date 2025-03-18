const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { sequelize } = require('./config/database');
const logger = require('./utils/logger');

// Override console methods to prevent sensitive logging
const originalConsoleLog = console.log;
console.log = function() {
  // Only log if it doesn't contain sensitive patterns
  const stringArgs = Array.from(arguments).join(' ');
  const sensitivePatterns = [
    /password/i, /token/i, /secret/i, /key/i, /auth/i, 
    /email/i, /cred/i, /hash/i, /encrypt/i
  ];
  
  const containsSensitiveInfo = sensitivePatterns.some(pattern => 
    pattern.test(stringArgs)
  );
  
  if (!containsSensitiveInfo) {
    originalConsoleLog.apply(console, arguments);
  }
};

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Add middleware to log API requests
app.use((req, res, next) => {
  logger.api(req.method, req.originalUrl);
  next();
});

// Register Routes
const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');
const likesRoutes = require('./routes/likes');
const contactRoutes = require('./routes/contact');

app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/likes', likesRoutes);

// Log registered routes
logger.server("Registered API routes:");
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    logger.info(`Route: ${r.route.path}`);
  }
});

// Serve Frontend Files (Only if in Production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../src')));
  logger.server("Running in production mode, serving static files");
}

// Handle Unknown API Routes
app.get('*', (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Database Connection
sequelize
  .authenticate()
  .then(() => logger.server('Database connected successfully'))
  .catch((err) => logger.error('Database connection failed:', err));

// Connect to database and initialize tables if they don't exist
sequelize
  .sync({ force: false })
  .then(() => {
    logger.server('Database tables verified');
    app.listen(PORT, () => {
      logger.server(`Server running at http://localhost:${PORT}`);
      logger.server("Press Ctrl+C to stop the server");
    });
  })
  .catch((err) => logger.error('Database sync failed:', err));

module.exports = app;
