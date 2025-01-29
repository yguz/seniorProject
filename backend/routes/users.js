const express = require('express');
const router = express.Router();

// Example route for fetching all users
router.get('/', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ]);
});

module.exports = router;
