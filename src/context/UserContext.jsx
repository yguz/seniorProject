import React, { createContext, useState } from 'react';

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

  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      sessionStorage.setItem("user", JSON.stringify(userData));
      setIsAuthenticated(true); // Mark as authenticated
    } else {
      sessionStorage.removeItem("user");
      setIsAuthenticated(false); // Mark as not authenticated
    }
  };

  return (
    <UserContext.Provider value={{ user, isAuthenticated, setUser: updateUser, likedRecipes, setLikedRecipes, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};
