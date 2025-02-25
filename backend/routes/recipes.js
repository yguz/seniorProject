const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();
const API_KEY = process.env.SPOONACULAR_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SPOONACULAR_URL = 'https://api.spoonacular.com/recipes/findByIngredients?apiKey=' + API_KEY;
const SPOONACULAR_URL_MEAL_TYPE = 'https://api.spoonacular.com/recipes/complexSearch';
const SPOONACULAR_RECIPE_URL = 'https://api.spoonacular.com/recipes';

// Gemini API URL to fetch ingredient prices (change this to the actual Gemini endpoint)
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + GEMINI_API_KEY;

// Helper function to get the total price for a list of ingredients
const getIngredientsPrice = async (ingredientList) => {
  let totalPrice = 0;

  try {
    const apiUrl = `${GEMINI_API_URL}`;

    // Construct the request to estimate the price of the ingredient
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Please provide a reasonable total price for this list of ingredients: ${ingredientList}`,
            },
          ],
        },
      ],
    };

    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if candidates are available and extract price range
    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
      const priceText = response.data.candidates[0]?.content?.parts[0]?.text || '';

      // Extract the range (e.g., "$73 - $115") from the text
      const priceRangeMatch = priceText.match(/\$(\d+(?:\.\d+)?)\s*-\s*\$(\d+(?:\.\d+)?)/);

      if (priceRangeMatch) {
        // If a range is found, calculate the average
        const minPrice = parseFloat(priceRangeMatch[1]);
        const maxPrice = parseFloat(priceRangeMatch[2]);
        totalPrice = (minPrice + maxPrice) / 2;
        console.log('Price range found: ', minPrice, maxPrice, 'Average Price: ', totalPrice);
      } else {
        // If no range is found, fallback to $0 or another logic
        console.log('No price range found in text.');
        totalPrice = 0;
      }
    } else {
      console.log('No candidates or unexpected response structure.');
    }

    console.log('Total Price: ', totalPrice);
  } catch (error) {
    console.error(`Error fetching price for ingredients ${ingredientList}:`, error);
  }

  return totalPrice;
};

// Route to search by ingredients
router.get('/search', async (req, res) => {
  try {
    let { ingredients } = req.query;
    if (!ingredients) {
      return res.status(400).json({ error: 'Please provide ingredients' });
    }

    // Convert ingredients string into an array
    ingredients = ingredients.split(',').map(ingredient => ingredient.trim());

    // Request parameters: ingredients and number (to limit the number of recipes returned)
    const response = await axios.get(SPOONACULAR_URL, {
      params: { ingredients: ingredients.join(','), number: 10 } // Adjust number as needed
    });

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ error: 'No recipes found for the given ingredients' });
    }

    // Calculate the total price for each recipe's ingredients
    const recipeDetailsPromises = response.data.map(async (recipe) => {
      const allIngredients = [
        ...recipe.usedIngredients.map(i => i.name),
        ...recipe.missedIngredients.map(i => i.name)
      ];

      // Remove duplicates by converting to a Set and back to an array
      const uniqueIngredients = [...new Set(allIngredients)];

      // Get the price for the ingredients in this recipe
      const recipePrice = await getIngredientsPrice(uniqueIngredients);

      return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        usedIngredientCount: recipe.usedIngredientCount,
        missedIngredientCount: recipe.missedIngredientCount,
        ingredients: [
          ...recipe.usedIngredients.map(i => i.name),
          ...recipe.missedIngredients.map(i => i.name)
        ],
        price: recipePrice,  // Include the price for each recipe
      };
    });

    // Wait for all recipe details to be fetched
    const detailedRecipes = await Promise.all(recipeDetailsPromises);

    // Filter null values if there are any issues fetching price
    const validRecipes = detailedRecipes.filter(recipe => recipe !== null);

    // Return the valid recipes with their prices
    res.json({ recipes: validRecipes });
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

// Route to search by meal type (lunch, breakfast, or dinner)
router.get('/search/:mealType', async (req, res) => {
  try {
    const { mealType } = req.params;
    
    const allowedMealTypes = ['lunch', 'breakfast', 'dinner'];
    if (!allowedMealTypes.includes(mealType)) {
      return res.status(400).json({ error: 'Invalid meal type. Please use lunch, breakfast, or dinner.' });
    }

    const apiUrl = `${SPOONACULAR_URL_MEAL_TYPE}?type=${mealType}&apiKey=${API_KEY}`;
    const response = await axios.get(apiUrl, {
      params: { number: 6 }
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
        const recipeDetails = {
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          usedIngredientCount: recipeDetailResponse.data.usedIngredientCount,
          missedIngredientCount: recipeDetailResponse.data.missedIngredientCount,
          ingredients: recipeDetailResponse.data.extendedIngredients.map(i => i.name), // List of ingredients
          instructions: recipeDetailResponse.data.instructions, // Cooking instructions
        };

        // Calculate the price for this recipe
        const uniqueIngredients = [
          ...recipeDetailResponse.data.extendedIngredients.map(i => i.name)
        ];
        recipeDetails.price = await getIngredientsPrice(uniqueIngredients); // Append price to the recipe

        return recipeDetails;

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
