const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { sequelize } = require('./config/database');
const logger = require('./utils/logger');
const { initializeAssociations } = require('./models/associations');
const bcrypt = require('bcrypt');

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
const commentsRouter = require('./routes/comments');

app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/comments', commentsRouter);

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

// Initialize model associations
initializeAssociations();

// Database Connection and Sync
const initializeDatabase = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');

    // Log registered models
    console.log('Registered Models:', Object.keys(sequelize.models));

    // Check if Users table exists by trying to count users
    let tableExists = false;
    try {
      await sequelize.models.Users.count();
      tableExists = true;
    } catch (error) {
      // Table doesn't exist, which is fine
      console.log('Tables do not exist yet, will create them');
    }

    if (!tableExists) {
      // Only sync if tables don't exist
      await sequelize.sync();
      console.log('✓ Database tables created');

      // Create test users if needed
      const { User } = require('./models/user');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await User.bulkCreate([
        {
          username: 'testuser',
          email: 'test@example.com',
          password: hashedPassword
        },
        {
          username: 'demo',
          email: 'demo@example.com',
          password: hashedPassword
        }
      ]);
      console.log('✓ Test users created');
    } else {
      console.log('✓ Database tables already exist, skipping initialization');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`✓ Server running at http://localhost:${PORT}`);
      console.log("Press Ctrl+C to stop the server");
    });
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Initialize database and start server
initializeDatabase();

module.exports = app;
