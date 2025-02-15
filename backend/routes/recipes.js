const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();
const API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_URL = 'https://api.spoonacular.com/recipes/findByIngredients';

router.get('/search', async (req, res) => {
  try {
    let { ingredients } = req.query;
    if (!ingredients) {
      return res.status(400).json({ error: 'Please provide ingredients' });
    }

    // Remove extra spaces from ingredients input
    ingredients = ingredients.replace(/\s+/g, '');

    // Request recipes from Spoonacular API
    const response = await axios.get(SPOONACULAR_URL, {
      params: {
        ingredients,
        number: 10,  // Limit number of results
        apiKey: API_KEY, // Pass API key as a query parameter
      },
    });

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ error: 'No recipes found for the given ingredients' });
    }

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching recipes:', error);

    if (error.response) {
      return res.status(error.response.status).json({
        error: `Spoonacular API error: ${error.response.statusText}`,
      });
    }

    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

module.exports = router;
