import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import './assets/searchResults.css';

const SearchResults = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [priceSort, setPriceSort] = useState('lowToHigh');

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('search');
  const firstRender = useRef(true);
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch recipes from API
  const fetchRecipes = async (query) => {
    if (query && !hasFetched) {
      setLoading(true);
      setHasFetched(true);
      try {
        const response = await fetch(`http://localhost:3000/api/recipes/search?ingredients=${query}`);
        if (!response.ok) throw new Error(`Server Error: ${response.status}`);
        const data = await response.json();
        const sorted = data.recipes.sort((a, b) => (a.price || 0) - (b.price || 0));
        setRecipes(sorted);
        setFilteredRecipes(sorted);
        setError(null);
      } catch (err) {
        setError(err.message);
        setRecipes([]);
        setFilteredRecipes([]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Restore recipes from state if available
    if (location.state?.recipes && location.state?.query) {
      setRecipes(location.state.recipes);
      setFilteredRecipes(location.state.recipes);
      setSearchQuery(location.state.query);
      setHasFetched(true);
      setLoading(false); // ✅ Fix: Don't show spinner if data is from memory
      return;
    }

    // Otherwise, fetch from API
    if (query && firstRender.current) {
      firstRender.current = false;
      fetchRecipes(query);
      setSearchQuery(query);
    }
  }, [query, location.state]);

  const sortRecipesByPrice = (sortOrder) => {
    const sorted = [...recipes];
    if (sortOrder === 'lowToHigh') {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else {
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
      <h1>Recipes for "{query || searchQuery}"</h1>

      <div className="search-again-container">
        <input
          type="text"
          className="search-input-results"
          placeholder="Type a new ingredient for a new recipe..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="search-btn-results"
          onClick={() => navigate(`/results?search=${searchQuery}`)}
        >
          Search
        </button>
      </div>

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
            <div
              key={recipe.id}
              onClick={() =>
                navigate(`/recipe/${recipe.id}?price=${recipe.price}&search=${searchQuery}`, {
                  state: {
                    recipes: filteredRecipes,
                    query: searchQuery,
                  },
                })
              }
              style={{ cursor: 'pointer' }}
            >
              <RecipeCard recipe={recipe} />
            </div>
          ))
        ) : (
          !loading && <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
