const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();
const API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_URL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients';
const SPOONACULAR_HOST = 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com';

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

    // Fetch approximate prices for each recipe
    const recipesWithPrices = await Promise.all(
      response.data.map(async (recipe) => {
        const ingredientNames = recipe.usedIngredients.map((i) => i.name)
          .concat(recipe.missedIngredients.map((i) => i.name));
        const estimatedPrice = await getAIPriceEstimate(ingredientNames);

        return {
          id: recipe.id,
          title: recipe.title,
          usedIngredientCount: recipe.usedIngredientCount,
          missedIngredientCount: recipe.missedIngredientCount,
          ingredients: ingredientNames,
          estimatedPrice: `$${estimatedPrice.toFixed(2)}` // Format price as USD
        };
      })
    );

    res.json(recipesWithPrices);
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
