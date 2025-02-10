const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();
const API_KEY = process.env.SPOONACULAR_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SPOONACULAR_URL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients';
const SPOONACULAR_HOST = 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com';

// Function to calculate approximate price using Gemini AI
const getAIPriceEstimate = async (ingredients) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Estimate the total cost in USD for a recipe with the following ingredients based on average US grocery prices. 
                Provide only a number with two decimal places (e.g., 5.99). 

                Ingredients: ${ingredients.join(', ')}`
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const priceEstimate = response.data.contents[0]?.parts[0]?.text.trim();
    console.log('Gemini Response:', priceEstimate); // Debugging: Log Gemini's response
    return parseFloat(priceEstimate) || 0; // Convert to a number
  } catch (error) {
    console.error('Gemini AI price estimation failed:', error.response?.data || error.message);
    return 0; // Default price if AI call fails
  }
};

// GET /api/recipes/search?ingredients=chicken,tomato,garlic
router.get('/search', async (req, res) => {
  try {
    let { ingredients } = req.query;
    if (!ingredients) {
      return res.status(400).json({ error: 'Please provide ingredients' });
    }

    // Remove spaces from ingredients to ensure proper API formatting
    ingredients = ingredients.replace(/\s+/g, '');

    const response = await axios.get(SPOONACULAR_URL, {
      params: { ingredients, number: 10 }, // Fetch up to 10 results
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': SPOONACULAR_HOST,
      },
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
