const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();
const API_KEY = process.env.SPOONACULAR_API_KEY;

const SPOONACULAR_URL = 'https://api.spoonacular.com/recipes/findByIngredients?apiKey=' + API_KEY;

router.get('/search', async (req, res) => {
  try {
    let { ingredients } = req.query;
    if (!ingredients) {
      return res.status(400).json({ error: 'Please provide ingredients' });
    }

    // Remove any extra spaces to ensure proper API formatting
    ingredients = ingredients.replace(/\s+/g, '');

    // Request parameters: ingredients and number (to limit the number of recipes returned)
    const response = await axios.get(SPOONACULAR_URL, {
      params: { ingredients, number: 10 } // Adjust number as needed
    });

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ error: 'No recipes found for the given ingredients' });
    }

    // Format the response for frontend display
    const formattedRecipes = response.data.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      usedIngredientCount: recipe.usedIngredientCount,
      missedIngredientCount: recipe.missedIngredientCount,
      ingredients: [...recipe.usedIngredients.map(i => i.name), ...recipe.missedIngredients.map(i => i.name)]
    }));

    res.json(formattedRecipes);
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
