import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import './assets/searchResults.css';

const SearchResults = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // New state to hold search input
  const location = useLocation(); // Get the window location object (URL)
  const navigate = useNavigate(); // navigate back to search page if needed

  // Extract query parameter from the URL (on initial load)
  const query = new URLSearchParams(location.search).get('search');

  useEffect(() => {
    const fetchRecipes = async () => {
      if (query) {
        try {
          const response = await fetch(`http://localhost:3000/api/recipes/search?ingredients=${query}`);
          if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
          }
          const data = await response.json();
          setRecipes(data);
          setError(null);
        } catch (err) {
          setError(err.message);
        }
      }
    };

    fetchRecipes();
  }, [query]);

  // this function handles search button click
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/results?search=${searchQuery}`);
    }
  };

  return (
    <div className="results-container">
      <h1>Recipes for "{query || searchQuery}"</h1>

      <div className="search-again-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for more recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>
      </div>

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

export default SearchResults;
