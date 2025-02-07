import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();  // navigate to the results page

  const handleSearch = () => {
    if (query) {
      // go to the results page with the query as a URL parameter
      navigate(`/results?search=${query}`);
    }
  };

  return (
    <div className="search-container">
      <h1 className="typing-effect">Find meal ideas on a budget.</h1>
      <div className="search-card">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Type to search"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>Search</button>
        </div>
      </div>
    </div>
  );
};

export default Search;
