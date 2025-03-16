import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./context/UserContext.jsx";
import RecipeCard from "./RecipeCard.jsx";
import './assets/searchResults.css'; // Import the shared CSS

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user || !user.userId) return;

    const fetchLikedRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/likes/${user.userId}`);
        
        // Format ingredients before setting state
        const formattedRecipes = response.data.likedRecipes.map(recipe => ({
          ...recipe,
          ingredients: parseIngredients(recipe.ingredients),
        }));

        setLikedRecipes(formattedRecipes);
      } catch (error) {
        console.error("Error fetching liked recipes:", error);
        setErrorMessage(error.response?.data?.error || "Failed to load liked recipes");
      }
    };

    fetchLikedRecipes();
  }, [user]);

  // Function to parse ingredients if they are stored as a JSON string
  const parseIngredients = (ingredients) => {
    try {
      return typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;
    } catch (error) {
      console.error("Error parsing ingredients:", error);
      return [];
    }
  };

  return (
    <div className="results-container">
      <h2>My Liked Recipes</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="container">
        {likedRecipes.length > 0 ? (
          likedRecipes.map((recipe) => (
            <RecipeCard key={recipe.recipeId} recipe={recipe} />
          ))
        ) : (
          <p>No liked recipes yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
