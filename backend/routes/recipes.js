const express = require('express');
const router = express.Router();

// Example route for fetching all recipes
router.get('/', (req, res) => {
  res.json([
    { id: 1, title: 'Spaghetti', ingredients: ['Pasta', 'Tomato Sauce'] },
    { id: 2, title: 'Tacos', ingredients: ['Tortilla', 'Beef', 'Cheese'] },
  ]);
});

module.exports = router;
