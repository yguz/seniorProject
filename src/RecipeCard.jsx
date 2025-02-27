import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Import heart icons from react-icons
import './assets/recipeCard.css';

const RecipeCard = ({ recipe }) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [price, setPrice] = useState(null); // State to store the price
  const [liked, setLiked] = useState(false); // State to track if the recipe is liked
  const [errorMessage, setErrorMessage] = useState(''); // State to hold error message

  const userId = sessionStorage.getItem("userId");


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

  if (price === null) return null;

  // Handle toggling like status
  const toggleLike = () => {
    if (!userId) {
      setErrorMessage('You need to be logged in to like a recipe');
      return;
    }

    setLiked(!liked);
    likeRecipe(recipe.id, userId); // Call the function to "like" the recipe
  };

  // Function to send the "like" to the backend
  const likeRecipe = async (recipeId, userId) => {
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId: recipeId,
          userId: userId, // Using userId to associate the "like"
        }),
      });

      if (response.ok) {
        console.log('Recipe liked successfully');
      } else {
        console.error('Failed to like recipe');
      }
    } catch (error) {
      console.error('Error while liking recipe:', error);
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
          {liked ? (
            <FaHeart color="red" size={24} />
          ) : (
            <FaRegHeart color="grey" size={24} />
          )}
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

        <p><b>Instructions:</b> {recipe.instructions ? recipe.instructions : "No instructions available."}</p>

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
