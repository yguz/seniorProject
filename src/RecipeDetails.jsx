import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/recipeDetails.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');

  const price = new URLSearchParams(location.search).get('price');
  const searchQuery = new URLSearchParams(location.search).get('search');
  const previousRecipes = location.state?.recipes;
  const fromQuery = location.state?.query;

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

  useEffect(() => {
    if (recipe) {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        new window.bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }, [recipe]);

  if (error) return <div className="error">{error}</div>;
  if (!recipe) return <div className="loading">Loading...</div>;

  return (
    <div className="recipe-details">
     {previousRecipes && fromQuery && (
  <div className="back-button-wrapper">
    <button
      className="back-btn"
      onClick={() =>
        navigate('/results?search=' + fromQuery, {
          state: {
            recipes: previousRecipes,
            query: fromQuery,
          },
        })
      }
    >
      ← Back
    </button>
  </div>
)}

      <div className="image-container">
        <img src={recipe.image} alt={recipe.title} />
      </div>

      <div className="text-container">
        <h1>{recipe.title}</h1>

        {recipe.servings && <p><strong>Servings:</strong> {recipe.servings}</p>}
        {recipe.preparationMinutes && <p><strong>Preparation time:</strong> {recipe.preparationMinutes} minutes</p>}
        {recipe.cookingMinutes && <p><strong>Cooking time:</strong> {recipe.cookingMinutes} minutes</p>}
        {recipe.price && <p className="price"><strong>Price per serving:</strong> ${recipe.price}</p>}

        {recipe.extendedIngredients?.length > 0 && (
          <>
            <h3>Ingredients:</h3>
            <ul>
              {recipe.extendedIngredients.map((ingredient, index) => (
                <li key={index}>{ingredient.original}</li>
              ))}
            </ul>
          </>
        )}

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
