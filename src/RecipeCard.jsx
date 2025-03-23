import React, { useState, useEffect, useContext } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Add this import for navigation
import './assets/recipeCard.css';
import { UserContext } from "./context/UserContext.jsx";

const RecipeCard = ({ recipe, isDashboard = false, onUnlike, refreshLikedRecipes }) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [price, setPrice] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [likeStatus, setLikeStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const { user, likedRecipes, setLikedRecipes } = useContext(UserContext);
  const userId = user ? user.userId : null;

  // Track local like state
  const [isLiked, setIsLiked] = useState(false);
  
  // Check if recipe is already liked when component mounts
  useEffect(() => {
    // If in dashboard, recipe is already liked
    if (isDashboard) {
      setIsLiked(true);
    } else {
      // Check if recipe exists in likedRecipes from context
      const alreadyLiked = likedRecipes.some(like => like.recipeId === recipe.id);
      setIsLiked(alreadyLiked);
    }
  }, [isDashboard, likedRecipes, recipe.id]);

  const toggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
  };

  // Set the price when the recipe is first loaded
  useEffect(() => {
    if (recipe.price && !isNaN(recipe.price) && recipe.price > 0) {
      setPrice(recipe.price);
    } else {
      setPrice(null);
    }
  }, [recipe]);

  // If the price is null, don't render the card
  if (price === null) return null;

  // Handle toggling like status
  const toggleLike = async () => {
    if (!userId) {
      setErrorMessage('You need to be logged in to like a recipe');
      return;
    }

    setLikeStatus('loading');
    setErrorMessage('');

    try {
      if (!isLiked) {
        // Like the recipe
        const payload = {
          recipeId: recipe.id,
          userId: userId,
          image: recipe.image,
          title: recipe.title,
          price: price,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
        };

        const response = await axios.post('http://localhost:3000/api/likes', payload);
        
        if (response.status === 201) {
          // Update global state only if we're not already in the dashboard
          if (!isDashboard) {
            setLikedRecipes(prev => [...prev, payload]);
          }
          setIsLiked(true);
          setLikeStatus('success');
          if (refreshLikedRecipes) refreshLikedRecipes();
        }
      } else {
        // Unlike the recipe
        const response = await axios.delete(`http://localhost:3000/api/likes/${recipe.id}/${userId}`);
        
        if (response.status === 200) {
          if (isDashboard && onUnlike) {
            // If we're in the dashboard, call the parent's onUnlike function
            onUnlike(recipe.id);
          } else {
            // Otherwise just update the global state
            setLikedRecipes(prev => prev.filter(like => like.recipeId !== recipe.id));
          }
          setIsLiked(false);
          setLikeStatus('success');
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to update like status');
      setLikeStatus('error');
    }
  };

  return (
    <div className="recipe-box">
      <div className="front">
        <img src={recipe.image} alt={recipe.title} />
        <h3>{recipe.title}</h3>
        <p>{price !== null ? `$${price.toFixed(2)}` : 'Price unavailable'}</p>
      </div>
      <div className="back">
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="like-btn" onClick={toggleLike}>
          {isLiked ? (
            <FaHeart color="red" size={24} />
          ) : (
            <FaRegHeart color="grey" size={24} />
          )}
          {likeStatus === 'loading' && <span className="loading-indicator"> ...</span>}
        </div>
        <div>
          <h3>{recipe.title}</h3>
        </div>
        <p><b>Ingredients:</b></p>
        <ul>
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient.original || 'Unknown Ingredient'}</li>
            ))
          ) : (
            <li>No ingredients available.</li>
          )}
        </ul>
        
        {/* Link to see full recipe */}
        <Link to={`/recipe/${recipe.id}?price=${price}`} className="full-recipe-link">See full recipe for instructions</Link>


        <button className="comment-btn" onClick={toggleCommentBox}>
          Add Comment
        </button>
        {showCommentBox && (
          <div className="comment-box active">
            <textarea placeholder="Enter your comment here..."></textarea>
            <button className="submit-comment">Submit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
