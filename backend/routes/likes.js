const express = require('express');
const router = express.Router();
const { LikedRecipe } = require('../models/likedRecipe');

router.post('/', async (req, res) => {
  try {
    const { userId, recipeId, image, title, price, ingredients, instructions } = req.body;
    if (!userId || !recipeId) {
      return res.status(400).json({ error: "Missing required fields: userId or recipeId" });
    }
    // Check if this recipe is already liked
    const existingLike = await LikedRecipe.findOne({ where: { userId, recipeId } });
    if (existingLike) {
      return res.status(400).json({ error: "Recipe already liked" });
    }
    
    // If ingredients is not provided, store null
    const ingredientsData = ingredients ? JSON.stringify(ingredients) : null;
    
    const newLikedRecipe = await LikedRecipe.create({
      userId,
      recipeId,
      image,
      title,
      price,
      ingredients: ingredientsData,
      instructions
    });
    res.status(201).json({ message: "Recipe liked successfully", likedRecipe: newLikedRecipe });
  } catch (error) {
    console.error("Error liking recipe:", error);
    // Return the error message for debugging purposes
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const likedRecipes = await LikedRecipe.findAll({ where: { userId } });
    res.json({ likedRecipes });
  } catch (error) {
    console.error("Error retrieving liked recipes:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// DELETE endpoint to unlike a recipe
router.delete('/:recipeId/:userId', async (req, res) => {
  try {
    const { recipeId, userId } = req.params;
    
    if (!userId || !recipeId) {
      return res.status(400).json({ error: "Missing required parameters: userId or recipeId" });
    }
    
    const existingLike = await LikedRecipe.findOne({ 
      where: { 
        userId, 
        recipeId 
      } 
    });
    
    if (!existingLike) {
      return res.status(404).json({ error: "Like not found" });
    }
    
    await existingLike.destroy();
    res.status(200).json({ message: "Recipe unliked successfully" });
  } catch (error) {
    console.error("Error unliking recipe:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

module.exports = router;
