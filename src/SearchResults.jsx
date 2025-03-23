import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import './assets/searchResults.css';

const SearchResults = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State to hold search input
  const [loading, setLoading] = useState(true);  // Track loading state
  const location = useLocation(); // Get the window location object (URL)
  const navigate = useNavigate(); // navigate back to search page if needed

  const query = new URLSearchParams(location.search).get('search'); // Get query from URL
  const firstRender = useRef(true); // Ref to track the initial render

  const fetchRecipes = async (query) => {
    if (query) {
      setLoading(true); // Set loading to true before making the request
      try {
        const response = await fetch(`http://localhost:3000/api/recipes/search?ingredients=${query}`);
        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched recipes:', data.recipes); // Log fetched recipes
        setRecipes(data.recipes); // Access the 'recipes' array
        setError(null);
      } catch (err) {
        setError(err.message);
        setRecipes([]);  // Clear the recipes in case of an error
      } finally {
        setLoading(false); // Set loading to false once the request is completed
      }
    }
  };

  // This function handles the search button click
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/results?search=${searchQuery}`); // Update the URL with search query
    }
  };

  // Fetch recipes when the query changes or on initial load
  useEffect(() => {
    if (query) {
      fetchRecipes(query); // Fetch recipes based on the query from URL
    }
  }, [query]); // This will trigger the fetch when the query changes

  // Handle search input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  console.log('Recipes state:', recipes); // Log the current recipes state

  return (
    <div className="results-container">
      <h1>Recipes for "{query || searchQuery}"</h1>

      <div className="search-again-container">
        <input
          type="text"
          className="search-input-results"
          placeholder="Search for more recipes..."
          value={searchQuery}
          onChange={handleInputChange}  // Update state with input change
        />
        <button className="search-btn-results" onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error">Error: {error}</p>}

      {/* Display loading spinner when loading */}
      {loading && <div className="spinner"></div>}

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

export default SearchResults;
