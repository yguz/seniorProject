import React from 'react';
import './Search.css';

const Search = () => {
  return (
    <div className="search-container">
      <div className="search-input-container">
          <input type="text" placeholder="Type to search" className="search-input" />
          <button className="btn btn-dark">Search</button>
        </div>
    </div>
  );
};

export default Search;
