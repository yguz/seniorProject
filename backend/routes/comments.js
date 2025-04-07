const express = require('express');
const router = express.Router();
const { Comment } = require('../models/comment');
const { User } = require('../models/user');

// Get all comments for a recipe
router.get('/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;
    console.log('Fetching comments for recipe:', recipeId);

    const comments = await Comment.findAll({
      where: { recipeId: parseInt(recipeId) },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    console.log('Found comments:', comments.length);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    console.error('SQL Query:', error.sql);
    res.status(500).json({ 
      error: 'Failed to fetch comments', 
      details: error.message,
      sql: error.sql 
    });
  }
});

// Create a new comment
router.post('/', async (req, res) => {
  try {
    const { userId, recipeId, content } = req.body;
    console.log('Creating comment:', { userId, recipeId, content });

    if (!userId || !recipeId || !content) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { userId, recipeId, content }
      });
    }

    const user = await User.findByPk(parseInt(userId));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const comment = await Comment.create({
      userId: parseInt(userId),
      recipeId: parseInt(recipeId),
      content: content.trim()
    });

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email']
      }]
    });

    console.log('Comment created:', commentWithUser.id);
    res.status(201).json(commentWithUser);
  } catch (error) {
    console.error('Error creating comment:', error);
    console.error('SQL Query:', error.sql);
    res.status(500).json({ 
      error: 'Failed to create comment', 
      details: error.message,
      sql: error.sql 
    });
  }
});

// Update a comment
router.put('/:id', async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;

    const comment = await Comment.findByPk(parseInt(id));
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await comment.update({ content: content.trim() });

    const updatedComment = await Comment.findByPk(parseInt(id), {
      include: [{
        model: User,
        as: 'user',
        attributes: ['username']
      }]
    });

    res.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment', details: error.message });
  }
});

// Delete a comment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(parseInt(id));
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await comment.destroy();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment', details: error.message });
  }
});

module.exports = router; 