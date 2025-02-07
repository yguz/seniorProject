import React, { useState, useEffect } from 'react';
import './assets/recipeCard.css';

const RecipeCard = ({ recipe }) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [price, setPrice] = useState(null); // State to store the price

  const toggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
  };

  
  /**
   * Generate a random price (later on will be replaced with a price computed from using an API like chat gpt)
   * using the ingredients rendered here
   * */
  const generateRandomPrice = () => {
    return (Math.random() * (20 - 5) + 5).toFixed(2); // Random price between 5 and 20
  };

  // Set the price only once when the recipe is first loaded
  useEffect(() => {
    setPrice(generateRandomPrice());
  }, [recipe]); // change price when `recipe` data changes

  return (
    <div className="recipe-box">
      <div className="front">
        <img src={recipe.image} alt={recipe.title} />
        <h3>{recipe.title}</h3>
        <p>{`$${price}`}</p>
      </div>
      <div className="back">
        <h3>{recipe.title}</h3>
        <p><b>Ingredients:</b> {recipe.ingredients.join(', ')}</p>
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
