import React from 'react';
import './Search.css';

const Search = () => {
  return (
    <div className="search-container">
      <div>
        <h1>Find meal ideas on a budget.</h1>
      </div>
      <div className="search-card">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Type to search"
            className="search-input"
          />
          <button className="search-btn">Search</button>
        </div>
      </div>
    </div>
  );
};

export default Search;
