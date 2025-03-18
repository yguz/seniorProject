import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext({
  user: null,
  isAuthenticated: false, // New state
  likedRecipes: [],
  setUser: () => {},
  setLikedRecipes: () => {},
  setIsAuthenticated: () => {} // Function to update authentication state
});

export const UserProvider = ({ children }) => {
  const storedUser = sessionStorage.getItem("user");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;
  const [user, setUser] = useState(initialUser);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialUser); // Check if user is logged in

  // Load liked recipes when user changes
  useEffect(() => {
    const fetchLikedRecipes = async () => {
      if (user && user.userId) {
        try {
          const response = await axios.get(`http://localhost:3000/api/likes/${user.userId}`);
          
          // Process ingredients if needed
          const formattedRecipes = response.data.likedRecipes.map(recipe => ({
            ...recipe,
            ingredients: typeof recipe.ingredients === 'string' 
              ? JSON.parse(recipe.ingredients) 
              : recipe.ingredients
          }));
          
          setLikedRecipes(formattedRecipes);
        } catch (error) {
          console.error('Error fetching liked recipes:', error);
          setLikedRecipes([]);
        }
      } else {
        // Clear liked recipes when user logs out
        setLikedRecipes([]);
      }
    };

    fetchLikedRecipes();
  }, [user]);

  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      sessionStorage.setItem("user", JSON.stringify(userData));
      setIsAuthenticated(true); // Mark as authenticated
    } else {
      sessionStorage.removeItem("user");
      setIsAuthenticated(false); // Mark as not authenticated
      setLikedRecipes([]); // Clear liked recipes on logout
    }
  };

  return (
    <UserContext.Provider value={{ user, isAuthenticated, setUser: updateUser, likedRecipes, setLikedRecipes, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};
