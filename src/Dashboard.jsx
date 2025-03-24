import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./context/UserContext.jsx";
import RecipeCard from "./RecipeCard.jsx";
import './assets/searchResults.css'; // Import the shared CSS

const Dashboard = () => {
  const { user, likedRecipes: contextLikedRecipes, setLikedRecipes: setContextLikedRecipes } = useContext(UserContext);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to handle unliking recipes from the dashboard
  const handleUnlike = async (recipeId) => {
    if (!user || !user.userId) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/likes/${recipeId}/${user.userId}`);
      
      // Update the local state to remove the unliked recipe
      setLikedRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.recipeId !== recipeId));
      
      // Update the global state in UserContext
      setContextLikedRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.recipeId !== recipeId));
      
    } catch (error) {
      console.error("Error unliking recipe:", error);
      setErrorMessage(error.response?.data?.error || "Failed to unlike recipe");
    }
  };
  
  // Refresh the liked recipes when needed
  const refreshLikedRecipes = () => {
    setRefreshTrigger(prev => prev + 1);
  };

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
  }, [user, refreshTrigger]); // Added refreshTrigger to dependencies

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
            <RecipeCard 
              key={`${recipe.recipeId}-${recipe.id}`} 
              recipe={{...recipe, id: recipe.recipeId}} 
              isDashboard={true}
              onUnlike={handleUnlike}
              refreshLikedRecipes={refreshLikedRecipes}
            />
          ))
        ) : (
          <p>No liked recipes yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
