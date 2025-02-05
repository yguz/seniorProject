import React, { useState } from 'react';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  const fetchRecipes = async () => {
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
  };

  return (
    <div className="search-container">
      <h1>Find meal ideas on a budget.</h1>
      <div className="search-card">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Type to search"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-btn" onClick={fetchRecipes}>Search</button>
        </div>
      </div>
      {error && <p className="error">Error: {error}</p>}
      {recipes.length > 0 && (
        <ul>
          {recipes.map(recipe => (
            <li key={recipe.id}>{recipe.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
