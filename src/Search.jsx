import React, { useState } from 'react';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    if (!query.trim()) {
      setError('Please enter at least one ingredient.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/recipes/search?ingredients=${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes.');
      }

      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h1>Find meal ideas on a budget.</h1>
      <div className="search-card">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Enter ingredients (comma separated)"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-btn" onClick={fetchRecipes}>
            Search
          </button>
        </div>
      </div>

      {loading && <p>Loading recipes...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="recipe-results">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-item">
            <p>
              {recipe.title} - <strong>{recipe.estimatedPrice}</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
