import React, { useState, useEffect, useMemo, useContext } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './assets/recipeCard.css';
import { UserContext } from "./context/UserContext.jsx";
import CommentModal from './components/CommentModal';

const RecipeCard = ({ recipe, isDashboard = false, onUnlike, refreshLikedRecipes }) => {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [price, setPrice] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [likeStatus, setLikeStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const { user, likedRecipes, setLikedRecipes } = useContext(UserContext);
  const userId = user ? user.userId : null;

  // Track local like state
  const [isLiked, setIsLiked] = useState(false);

  // Use location to get query params
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use memoization to store price and avoid re-calculating it unnecessarily
  const displayedPrice = useMemo(() => {
    return price ? `$${price.toFixed(2)}` : null; // Return null when price is unavailable
  }, [price]);

  // Check if recipe is already liked when component mounts
  useEffect(() => {
    console.log('Recipe prop received in RecipeCard:', recipe); // Log the recipe prop
    // If in dashboard, recipe is already liked
    if (isDashboard) {
      setIsLiked(true);
    } else {
      // Check if recipe exists in likedRecipes from context
      const alreadyLiked = likedRecipes.some(like => like.recipeId === (recipe.recipeId || recipe.id));
      setIsLiked(alreadyLiked);
    }
  }, [isDashboard, likedRecipes, recipe]);

  const handleOpenComments = () => {
    if (!userId) {
      setErrorMessage('Please log in to view and post comments');
      return;
    }
    setShowCommentModal(true);
    setErrorMessage('');
  };

  // Set the price when the recipe is first loaded
  useEffect(() => {
    if (recipe.price && !isNaN(recipe.price) && recipe.price > 0) {
      setPrice(recipe.price);
    } else {
      setPrice(null);
    }
  }, [recipe]);

  // Handle toggling like status
  const toggleLike = async () => {
    if (!userId) {
      setErrorMessage('You need to be logged in to like a recipe');
      return;
    }

    if (likeStatus === 'loading') {
      return; // Prevent multiple calls if already loading
    }

    setLikeStatus('loading');
    setErrorMessage('');

    try {
      // Get the recipe ID and ensure it's a number
      const recipeId = Number(recipe.recipeId || recipe.id);

      if (!isLiked) {
        // Like the recipe
        const payload = {
          recipeId,
          userId: Number(userId),
          image: recipe.image,
          title: recipe.title,
          price: price,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
        };

        const response = await axios.post('http://localhost:3000/api/likes', payload);
        
        if (response.status === 201) {
          if (!isDashboard) {
            setLikedRecipes(prev => [...prev, payload]);
          }
          setIsLiked(true);
          setLikeStatus('success');
          if (refreshLikedRecipes) refreshLikedRecipes();
        }
      } else {
        // Unlike the recipe
        if (isDashboard) {
          // In dashboard, trigger parent's onUnlike first for immediate UI update
          onUnlike(recipeId);
        }

        const response = await axios.delete(`http://localhost:3000/api/likes/${recipeId}/${userId}`);
          
        if (response.status === 200) {
          setLikedRecipes(prev => prev.filter(like => Number(like.recipeId) !== recipeId));
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

  // Don't render the card if price is unavailable
  if (!price || price <= 0) {
    return null; // Prevent rendering the recipe card if price is invalid or not available
  }

  // Prevent click from propagating to the card click event on these elements
  const handleClickPrevent = (e) => {
    e.stopPropagation(); // Prevent the click from propagating to the card's click handler
  };

  const handleLinkClick = (e) => {
    e.preventDefault(); // Prevent the default anchor link behavior
    navigate(`/recipe/${recipe.recipeId}?price=${price}`, {
      state: {
        recipes: [recipe], // passing just the current recipe for this link
        query: location.search,
      },
    });
  };

  return (
    <>
      <div className="recipe-box" onClick={() => console.log('Card clicked!')}>
        <div className="front">
          <img src={recipe.image} alt={recipe.title} />
          <h3>{recipe.title}</h3>
          <p>{displayedPrice}</p> {/* Use the memoized displayed price */}
        </div>
        <div className="back">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="like-btn" onClick={(e) => { toggleLike(); handleClickPrevent(e); }}>
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
          <a
            href="#"
            className="full-recipe-link"
            onClick={handleLinkClick}
          >
            See full recipe for instructions
          </a>

          <button className="comment-btn" onClick={(e) => { handleOpenComments(); handleClickPrevent(e); }}>
            View Comments
          </button>
        </div>
      </div>

      {/* Comment Modal: Prevent propagation */}
      <CommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        recipeId={isDashboard ? recipe.recipeId : recipe.id}
        recipeTitle={recipe.title}
        onClick={(e) => e.stopPropagation()}  // Prevent propagation of click events inside the modal
      />
    </>
  );
};

export default RecipeCard;
