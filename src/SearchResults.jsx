import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import './assets/searchResults.css';

const SearchResults = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]); // Store filtered recipes after sorting
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State to hold search input
  const [loading, setLoading] = useState(true);  // Track loading state
  const [priceSort, setPriceSort] = useState('lowToHigh'); // State for price sorting ('lowToHigh' or 'highToLow')
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
        setFilteredRecipes(data.recipes); // Initially, set filtered recipes to all fetched recipes
        setError(null);
      } catch (err) {
        setError(err.message);
        setRecipes([]);  // Clear the recipes in case of an error
        setFilteredRecipes([]);  // Clear filtered recipes on error
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

  // Sort recipes based on price (Low to High or High to Low)
  const sortRecipesByPrice = (sortOrder) => {
    let sortedRecipes = [...recipes];
    
    if (sortOrder === 'lowToHigh') {
      sortedRecipes.sort((a, b) => (a.price || 0) - (b.price || 0)); // Sorting by price ascending
    } else if (sortOrder === 'highToLow') {
      sortedRecipes.sort((a, b) => (b.price || 0) - (a.price || 0)); // Sorting by price descending
    }

    setFilteredRecipes(sortedRecipes); // Update the filteredRecipes state
  };

  // Handle price sorting change
  const handlePriceSortChange = (e) => {
    const selectedSortOrder = e.target.value;
    setPriceSort(selectedSortOrder); // Update state with the selected sorting option
    sortRecipesByPrice(selectedSortOrder); // Sort the recipes based on the selected option
  };

  console.log('Filtered recipes after price sort:', filteredRecipes); // Log the filtered recipes after sorting

  return (
    <div className="results-container">
      <h1>Recipes for "{query || searchQuery}"</h1>

      <div className="search-again-container">
        <input
          type="text"
          className="search-input-results"
          placeholder="Search for more recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}  // Update state with input change
        />
        <button className="search-btn-results" onClick={handleSearch}>Search</button>
      </div>

      {/* Price sorting dropdown */}
      <div className="sort-by-price-container">
        <label>Sort by Price:</label>
        <select value={priceSort} onChange={handlePriceSortChange}>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      {error && <p className="error">Error: {error}</p>}

      {/* Display loading spinner when loading */}
      {loading && <div className="spinner"></div>}

      <div className="container">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
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
