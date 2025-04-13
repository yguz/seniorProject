import React, { useState, useEffect, useRef } from 'react';
import RecipeCard from './RecipeCard';
import './assets/searchResults.css';

const MealResults = ({ mealType }) => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [priceSort, setPriceSort] = useState('lowToHigh');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const fetchTriggered = useRef(false);

  useEffect(() => {
    fetchTriggered.current = false;
  }, [mealType]);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }

    if (fetchTriggered.current) {
      return;
    }

    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/recipes/search/${mealType}`);
        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`);
        }
        const data = await response.json();

        // Sort low to high by default
        const sorted = data.sort((a, b) => (a.price || 0) - (b.price || 0));
        setRecipes(sorted);
        setFilteredRecipes(sorted);
        setError(null);
      } catch (err) {
        setError(err.message);
        setRecipes([]);
        setFilteredRecipes([]);
      } finally {
        setLoading(false);
        fetchTriggered.current = true;
      }
    };

    if (mealType) {
      fetchRecipes();
    }
  }, [mealType, isFirstLoad]);

  const sortRecipesByPrice = (sortOrder) => {
    let sorted = [...recipes];
    if (sortOrder === 'lowToHigh') {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === 'highToLow') {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    setFilteredRecipes(sorted);
  };

  const handlePriceSortChange = (e) => {
    const selectedSortOrder = e.target.value;
    setPriceSort(selectedSortOrder);
    sortRecipesByPrice(selectedSortOrder);
  };

  return (
    <div className="results-container">
      <h1>Recipes for {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h1>

      <div className="sort-widget">
        <label htmlFor="priceSort">Sort by:</label>
        <select id="priceSort" value={priceSort} onChange={handlePriceSortChange}>
          <option value="lowToHigh">Low to High</option>
          <option value="highToLow">High to Low</option>
        </select>
      </div>

      {error && <p className="error">Error: {error}</p>}
      {loading && <div className="spinner"></div>}

      <div className="container">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        ) : (
          !loading && <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default MealResults;
