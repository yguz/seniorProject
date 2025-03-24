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
  const [hasFetched, setHasFetched] = useState(false);  // Track if fetch has been made

  const fetchRecipes = async (query) => {
    if (query && !hasFetched) {  // Check if we have not fetched yet
      setLoading(true);
      setHasFetched(true); // Set the flag to true after fetching
      try {
        const response = await fetch(`http://localhost:3000/api/recipes/search?ingredients=${query}`);
        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched recipes:', data.recipes);
        setRecipes(data.recipes);
        setFilteredRecipes(data.recipes);
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
    if (query && firstRender.current) {
      firstRender.current = false; // Prevent initial call when page loads
      fetchRecipes(query);
    }
  }, [query]); // Fetch only when `query` changes

  // Sort recipes
  const sortRecipesByPrice = (sortOrder) => {
    let sortedRecipes = [...recipes];
    if (sortOrder === 'lowToHigh') {
      sortedRecipes.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === 'highToLow') {
      sortedRecipes.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    setFilteredRecipes(sortedRecipes);
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
        <button className="search-btn-results" onClick={() => navigate(`/results?search=${searchQuery}`)}>Search</button>
      </div>

      <div className="sort-by-price-container">
        <label>Sort by Price:</label>
        <select value={priceSort} onChange={handlePriceSortChange}>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
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

export default SearchResults;
