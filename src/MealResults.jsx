import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import './assets/searchResults.css';

const MealResults = ({ mealType }) => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Call the backend API and pass only the mealType (lunch, breakfast, or dinner)
        const response = await fetch(`http://localhost:3000/api/recipes/search/${mealType}`);
        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`);
        }
        const data = await response.json();
        setRecipes(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRecipes();
  }, [mealType]); // Re-run when mealType changes


  return (
    <div className="results-container">
      <h1>Recipes for {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h1>

      {error && <p className="error">Error: {error}</p>}

      <div className="container">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default MealResults;
