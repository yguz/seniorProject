const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();
const API_KEY = process.env.SPOONACULAR_API_KEY;

const SPOONACULAR_URL = 'https://api.spoonacular.com/recipes/findByIngredients?apiKey=' + API_KEY;
const SPOONACULAR_URL_MEAL_TYPE = 'https://api.spoonacular.com/recipes/complexSearch';
const SPOONACULAR_RECIPE_URL = 'https://api.spoonacular.com/recipes';

// Gemini API URL to fetch ingredient prices
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + process.env.GEMINI_API_KEY;

// Helper function to prepare ingredients for Gemini API
const prepareIngredientsForGemini = (usedIngredients, missedIngredients) => {
  const allIngredients = [];

  // Extract and format used ingredients
  usedIngredients.forEach(ingredient => {
    const ingredientString = `${ingredient.amount} ${ingredient.unitShort} of ${ingredient.name}`;
    allIngredients.push(ingredientString);
  });

  // Extract and format missed ingredients
  missedIngredients.forEach(ingredient => {
    const ingredientString = `${ingredient.amount} ${ingredient.unitShort} of ${ingredient.name}`;
    allIngredients.push(ingredientString);
  });

  return allIngredients;
};

// Helper function to get the total price for a list of ingredients using the Gemini API
const getIngredientsPrice = async (usedIngredients, missedIngredients) => {
  console.log('Used Ingredients: ', usedIngredients);
  console.log('Missed Ingredients: ', missedIngredients);
  
  const ingredientList = prepareIngredientsForGemini(usedIngredients, missedIngredients);
  let totalPrice = 0;

  try {
    // Construct the request to estimate the price of the ingredient
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Please provide a reasonable total price for the following list of ingredients, and include the price in the format: "**Total Estimated Price:** $minPrice - $maxPrice": ${ingredientList.join(', ')}`,
            },
          ],
        },
      ],
    };

    // Make a POST request to the Gemini API
    const response = await axios.post(GEMINI_API_URL, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if candidates are available and extract price range
    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
      const priceText = response.data.candidates[0]?.content?.parts[0]?.text || '';

      // Log the priceText to see the full explanation
      console.log('Extracted price text: ', priceText);

      // Extract the "Total Estimated Price" range (e.g., "$13 - $28") from the text
      const totalPriceRangeMatch = priceText.match(/\*\*Total Estimated Price:\*\*\s*\$(\d+(?:\.\d+)?)\s*-\s*\$(\d+(?:\.\d+)?)/);

      if (totalPriceRangeMatch) {
        // If a range is found, calculate the average
        const minPrice = parseFloat(totalPriceRangeMatch[1]);
        const maxPrice = parseFloat(totalPriceRangeMatch[2]);
        totalPrice = (minPrice + maxPrice) / 2;
        console.log('Total Price Range found: ', minPrice, maxPrice, 'Average Price: ', totalPrice);
      } else {
        // If no total price range is found, fallback to a default price of $0
        console.log('No total price range found in text.');
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
      console.log('Recipe ingredients: ', recipe.usedIngredients);

      // Get the price for the ingredients in this recipe by passing recipe id
      const recipePrice = await getIngredientsPrice(recipe.usedIngredients, recipe.missedIngredients);
    
      return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        ingredients: [...recipe.usedIngredients, ...recipe.missedIngredients], // Include both used and missed ingredients
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

// Helper function to prepare ingredients for Gemini API
const prepareIngredientsForGeminiMealType = (usedIngredients) => {
  // Generate a list of ingredients formatted for Gemini
  return usedIngredients.map(ingredient => {
    return ingredient.original.replace(/^(\d+(\.\d+)?) (.+)$/, (match, amount, _, name) => {
      return `${amount} ${name}`;
    });
  });
};

// Helper function to get the total price for a list of ingredients using the Gemini API
const getIngredientsPriceMealType = async (usedIngredients) => {
  console.log('Used Ingredients: ', usedIngredients);
  
  // Prepare the ingredients for the Gemini API request
  const ingredientList = prepareIngredientsForGeminiMealType(usedIngredients);
  let totalPrice = 0;

  try {
    // Construct the Gemini API request body
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Please provide a reasonable total price for the following list of ingredients, and include the price in the format: "**Total Estimated Price:** $minPrice - $maxPrice": ${ingredientList.join(', ')}`,
            },
          ],
        },
      ],
    };

    // Make the POST request to the Gemini API
    const response = await axios.post(GEMINI_API_URL, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if there are any candidates and extract the price range
    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
      const priceText = response.data.candidates[0]?.content?.parts[0]?.text || '';

      // Log the full price explanation
      console.log('Extracted price text: ', priceText);

      // Extract the price range from the response (e.g., "$13 - $28")
      const totalPriceRangeMatch = priceText.match(/\*\*Total Estimated Price:\*\*\s*\$(\d+(?:\.\d+)?)\s*-\s*\$(\d+(?:\.\d+)?)/);

      if (totalPriceRangeMatch) {
        // If a price range is found, calculate the average price
        const minPrice = parseFloat(totalPriceRangeMatch[1]);
        const maxPrice = parseFloat(totalPriceRangeMatch[2]);
        totalPrice = (minPrice + maxPrice) / 2;
        console.log('Total Price Range found: ', minPrice, maxPrice, 'Average Price: ', totalPrice);
      } else {
        // If no price range is found, set totalPrice to 0 as a fallback
        console.log('No total price range found in text.');
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

// Route to search by meal type (lunch, breakfast, dinner)
router.get('/search/:mealType', async (req, res) => {
  try {
    const { mealType } = req.params;
    
    const allowedMealTypes = ['lunch', 'breakfast', 'dinner'];
    if (!allowedMealTypes.includes(mealType)) {
      return res.status(400).json({ error: 'Invalid meal type. Please use lunch, breakfast, or dinner.' });
    }

    const apiUrl = `${SPOONACULAR_URL_MEAL_TYPE}?type=${mealType}&apiKey=${API_KEY}`;
    const response = await axios.get(apiUrl, {
      params: { number: 6 }  // You can adjust the number of results
    });

    if (!response.data || response.data.results.length === 0) {
      return res.status(404).json({ error: `No ${mealType} recipes found` });
    }

    // Fetch detailed information for each recipe by ID
    const recipeDetailsPromises = response.data.results.map(async (recipe) => {
      try {
        // Ensure that recipe.id exists and is valid
        if (recipe.id && recipe.id > 0) {
          // Fetch ingredients using the correct endpoint
          const recipeIngredientsResponse = await axios.get(`${SPOONACULAR_RECIPE_URL}/${recipe.id}/ingredientWidget.json`, {
            params: { apiKey: API_KEY }
          });

          console.log('Fetched ingredients for recipe ID:', recipe.id);

          // Get the ingredients from the response
          const ingredients = recipeIngredientsResponse.data.ingredients;

          // Prepare the ingredients for the Gemini price calculation
           // Prepare ingredients for the Gemini price calculation
           const preparedIngredients = ingredients.map(ingredient => {
            return {
              original: `${ingredient.amount.metric.value} ${ingredient.amount.metric.unit} ${ingredient.name}`,
            };
          });

          // Calculate the price for the recipe
          const recipePrice = await getIngredientsPriceMealType(preparedIngredients);

          // Format the response for frontend display
          return {
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            ingredients: preparedIngredients, // Include both used and missed ingredients
            price: recipePrice,  // Add price to the response
            instructions: recipeIngredientsResponse.data.instructions, // Cooking instructions
          };
        } else {
          console.log('Invalid recipe ID:', recipe.id);
          return null;
        }
      } catch (err) {
        console.error('Error fetching ingredients for recipe ID:', recipe.id);
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
        } else {
          console.error('Error message:', err.message);
        }
        return null; // In case there's an error fetching details for a recipe
      }
    });

    // Wait for all detailed recipe info to be fetched
    const detailedRecipes = await Promise.all(recipeDetailsPromises);

    // Filter out any null values (recipes with errors fetching details)
    const validRecipes = detailedRecipes.filter(recipe => recipe !== null);

    // Send the final list of valid recipes
    res.json(validRecipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);

    // Handle errors from Spoonacular API response
    if (error.response) {
      return res.status(error.response.status).json({
        error: `Spoonacular API error: ${error.response.statusText}`,
      });
    }

    // Handle any other errors
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});



module.exports = router;
