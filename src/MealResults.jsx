import React, { useState, useEffect, useRef } from 'react';
import RecipeCard from './RecipeCard';
import './assets/searchResults.css';

const MealResults = ({ mealType }) => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Track first load

  // Ref to track whether the fetch for this mealType has been triggered
  const fetchTriggered = useRef(false);

  useEffect(() => {
    // Reset the fetch trigger every time mealType changes
    fetchTriggered.current = false;  // Allow fetch to run again when mealType changes
  }, [mealType]);  // This will run every time mealType changes

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);  // Set first load to false after the first fetch
      return;  // Skip the first load
    }

    // If fetch has already been triggered for this mealType, do not call the API again
    if (fetchTriggered.current) {
      return;
    }

    const fetchRecipes = async () => {
      setLoading(true);  // Set loading state before making the request
      try {
        // Call the backend API and pass only the mealType (lunch, breakfast, or dinner)
        const response = await fetch(`http://localhost:3000/api/recipes/search/${mealType}`);
        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`);
        }
        const data = await response.json();
        setRecipes(data);  // Update state with recipes
        setError(null);     // Clear any previous error
      } catch (err) {
        setError(err.message);  // Set the error state in case of failure
        setRecipes([]);         // Clear the recipes array on error
      } finally {
        setLoading(false);      // Set loading state to false after the request is complete
        fetchTriggered.current = true; // Mark that fetch has been triggered
      }
    };

    if (mealType) {
      fetchRecipes();  // Trigger the API call when mealType is set
    }
  }, [mealType, isFirstLoad]);  // Re-run when mealType changes, and skip the first load

  return (
    <div className="results-container">
      <h1>Recipes for {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h1>

      {error && <p className="error">Error: {error}</p>}

      {loading && <div className="spinner"></div>} {/* Show the spinner instead of text */}

      <div className="container">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        ) : (
          !loading && <p>No recipes found.</p>  // Display message if no recipes and not loading
        )}
      </div>
    </div>
  );
};

export default MealResults;
