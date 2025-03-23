import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Bootstrap JS (bundle with Popper)
import './assets/recipeDetails.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const price = new URLSearchParams(location.search).get('price');

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/recipes/recipe/${id}`, {
          params: { price },
        });
        setRecipe(response.data);
      } catch (err) {
        setError('Failed to fetch recipe details');
        console.error(err);
      }
    };

    fetchRecipeDetails();
  }, [id, price]);

  // Initialize Bootstrap tooltips once the component mounts
  useEffect(() => {
    // Ensure tooltips are initialized once the recipe data is available
    if (recipe) {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        new window.bootstrap.Tooltip(tooltipTriggerEl); // Initialize tooltip
      });
    }
  }, [recipe]); // Re-run when recipe data is fetched

  if (error) return <div className="error">{error}</div>;
  if (!recipe) return <div className="loading">Loading...</div>;

  return (
    <div className="recipe-details">
      <div className="image-container">
        <img src={recipe.image} alt={recipe.title} />
      </div>

      <div className="text-container">
        <h1>{recipe.title}</h1>

        {/* Conditionally render Servings */}
        {recipe.servings && <p><strong>Servings:</strong> {recipe.servings}</p>}

        {/* Conditionally render Preparation Time */}
        {recipe.preparationMinutes && <p><strong>Preparation time:</strong> {recipe.preparationMinutes} minutes</p>}

        {/* Conditionally render Cooking Time */}
        {recipe.cookingMinutes && <p><strong>Cooking time:</strong> {recipe.cookingMinutes} minutes</p>}

        {/* Conditionally render Price */}
        {recipe.price && <p className="price"><strong>Price per serving:</strong> ${recipe.price}</p>}

        {/* Conditionally render Ingredients */}
        {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 && (
          <>
            <h3>Ingredients:</h3>
            <ul>
              {recipe.extendedIngredients.map((ingredient, index) => (
                <li key={index}>{ingredient.original}</li>
              ))}
            </ul>
          </>
        )}

        {/* Conditionally render Instructions */}
        {recipe.instructions ? (
          <div className="instructions">
            <h3>Instructions:</h3>
            <p>{recipe.instructions}</p>
          </div>
        ) : (
          <p>No instructions available.</p>
        )}

        <a href={recipe.spoonacularSourceUrl} target="_blank" rel="noopener noreferrer">
          See full recipe details
        </a>
      </div>
    </div>
  );
};

export default RecipeDetails;
