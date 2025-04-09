const express = require('express');
const router = express.Router();
const { LikedRecipe } = require('../models/likedRecipe');
const logger = require('../utils/logger');

router.post('/', async (req, res) => {
  try {
    const { userId, recipeId, image, title, price, ingredients, instructions } = req.body;
    if (!userId || !recipeId) {
      logger.info("Like attempt missing required fields");
      return res.status(400).json({ error: "Missing required fields: userId or recipeId" });
    }
    // Check if this recipe is already liked
    const existingLike = await LikedRecipe.findOne({ where: { userId, recipeId } });
    if (existingLike) {
      logger.info(`User ${userId} attempted to like recipe ${recipeId} which was already liked`);
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
    logger.server(`User ${userId} liked recipe ${recipeId}`);
    res.status(201).json({ message: "Recipe liked successfully", likedRecipe: newLikedRecipe });
  } catch (error) {
    logger.error("Error liking recipe:", error);
    // Return the error message for debugging purposes
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const likedRecipes = await LikedRecipe.findAll({ where: { userId } });
    logger.info(`Retrieved ${likedRecipes.length} liked recipes for user ${userId}`);
    res.json({ likedRecipes });
  } catch (error) {
    logger.error("Error retrieving liked recipes:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// DELETE endpoint to unlike a recipe
router.delete('/:recipeId/:userId', async (req, res) => {
  try {
    const { recipeId, userId } = req.params;
    
    if (!userId || !recipeId) {
      logger.info("Unlike attempt missing required parameters");
      return res.status(400).json({ error: "Missing required parameters: userId or recipeId" });
    }
    
    const existingLike = await LikedRecipe.findOne({ 
      where: { 
        userId, 
        recipeId 
      } 
    });
    
    if (!existingLike) {
      logger.info(`User ${userId} attempted to unlike recipe ${recipeId} which was not found`);
      return res.status(404).json({ error: "Like not found" });
    }
    
    await existingLike.destroy();
    logger.server(`User ${userId} unliked recipe ${recipeId}`);
    res.status(200).json({ 
      message: "Recipe unliked successfully",
      unlikedRecipe: {
        userId: parseInt(userId),
        recipeId: parseInt(recipeId)
      }
    });
  } catch (error) {
    logger.error("Error unliking recipe:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

module.exports = router;
