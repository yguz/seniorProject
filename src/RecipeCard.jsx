import React, { useState, useEffect, useContext } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './assets/recipeCard.css';
import { UserContext } from "./context/UserContext.jsx";

const RecipeCard = ({ recipe }) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [price, setPrice] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { user, likedRecipes, setLikedRecipes } = useContext(UserContext);
  const userId = user ? user.userId : null;
  
  // Determine if this recipe is liked by the user (persisted in context)
  const isLiked = likedRecipes && likedRecipes.some(like => like.recipeId === recipe.id);

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
    console.log("toggleLike triggered. isLiked:", isLiked, "userId:", userId);
    if (!userId) {
      setErrorMessage('You need to be logged in to like a recipe');
      return;
    }
    
    if (!isLiked) {
      try {
        const payload = {
          recipeId: recipe.id,
          userId: userId,
          image: recipe.image,
          title: recipe.title,
          price: price,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
        };
        console.log("Sending payload:", payload);
        
        const response = await fetch('http://localhost:3000/api/likes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          console.log('Recipe liked successfully');
          // Update the global liked recipes so that the card remains liked
          setLikedRecipes([...likedRecipes, payload]);
        } else {
          console.error('Failed to like recipe');
          const errorText = await response.text();
          console.error("Error response:", errorText);
        }
      } catch (error) {
        console.error('Error while liking recipe:', error);
      }
    } else {
      console.log('Recipe already liked');
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
        <p>
          <b>Instructions:</b> {recipe.instructions ? recipe.instructions : "No instructions available."}
        </p>
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
