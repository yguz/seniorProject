import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Import heart icons from react-icons
import './assets/recipeCard.css';

const RecipeCard = ({ recipe }) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [price, setPrice] = useState(null); // State to store the price
  const [liked, setLiked] = useState(false); // State to track if the recipe is liked

  const toggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
  };

  // Set the price when the recipe is first loaded
  useEffect(() => {
    // If the price is available in the recipe object and is a valid number
    if (recipe.price && !isNaN(recipe.price) && recipe.price > 0) {
      setPrice(recipe.price); // Set the price from the recipe data
    } else {
      setPrice(null); // Set price to null if it's 0 or invalid
    }
  }, [recipe]); // Update price when recipe data changes

  // Don't render anything if the price is 0 or unavailable
  if (price === null) return null;

  // Handle toggling like status
  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="recipe-box">
      <div className="front">
        <img src={recipe.image} alt={recipe.title} />
        <h3>{recipe.title}</h3>
        {/* Display the price with toFixed only if it's a valid number */}
        <p>{price !== null ? `$${price.toFixed(2)}` : 'Price unavailable'}</p>
      </div>
      <div className="back">
                 {/* Heart toggle icon */}
                 <div className="like-btn mb-5" onClick={toggleLike}>
          {liked ? (
            <FaHeart color="red" size={24} /> // Liked state
          ) : (
            <FaRegHeart color="grey" size={24} /> // Unliked state
          )}
        </div>
        <div>
        <h3>{recipe.title}</h3>
        </div>

        <div>
    
        </div>
       
        
        {/* Render ingredients by displaying their 'original' field */}
        <p><b>Ingredients:</b></p>
        <ul>
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.original || 'Unknown Ingredient'}
              </li>
            ))
          ) : (
            <li>No ingredients available.</li>
          )}
        </ul>

        {/* Display instructions */}
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
