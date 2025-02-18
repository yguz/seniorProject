const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();
const API_KEY = process.env.SPOONACULAR_API_KEY;

const SPOONACULAR_URL = 'https://api.spoonacular.com/recipes/findByIngredients?apiKey=' + API_KEY;
const SPOONACULAR_URL_MEAL_TYPE = 'https://api.spoonacular.com/recipes/complexSearch';
const SPOONACULAR_RECIPE_URL = 'https://api.spoonacular.com/recipes';

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

// route to search by lunch, breakfast, or dinner
router.get('/search/:mealType', async (req, res) => {
  try {
    const { mealType } = req.params;
    
    const allowedMealTypes = ['lunch', 'breakfast', 'dinner'];
    if (!allowedMealTypes.includes(mealType)) {
      return res.status(400).json({ error: 'Invalid meal type. Please use lunch, breakfast, or dinner.' });
    }

    const apiUrl = `${SPOONACULAR_URL_MEAL_TYPE}?type=${mealType}&apiKey=${API_KEY}`;
    const response = await axios.get(apiUrl, {
      params: { number: 15 }
    });

    if (!response.data || response.data.results.length === 0) {
      return res.status(404).json({ error: `No ${mealType} recipes found` });
    }

    // Fetch detailed information for each recipe by ID
    const recipeDetailsPromises = response.data.results.map(async (recipe) => {
      try {
        const recipeDetailResponse = await axios.get(`${SPOONACULAR_RECIPE_URL}/${recipe.id}/information`, {
          params: { apiKey: API_KEY }
        });

         // Format the response for frontend display
        return {
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          usedIngredientCount: recipeDetailResponse.data.usedIngredientCount,
          missedIngredientCount: recipeDetailResponse.data.missedIngredientCount,
          ingredients: recipeDetailResponse.data.extendedIngredients.map(i => i.name), // List of ingredients
          instructions: recipeDetailResponse.data.instructions, // Cooking instructions
        };
      } catch (err) {
        console.error('Error fetching recipe details:', err);
        return null; // In case there's an error fetching details for a recipe
      }
    });

    // Wait for all detailed recipe info to be fetched
    const detailedRecipes = await Promise.all(recipeDetailsPromises);

    // Filter null values
    const validRecipes = detailedRecipes.filter(recipe => recipe !== null);

    res.json(validRecipes);
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
