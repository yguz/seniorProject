// UserContext.jsx
import React, { createContext, useState } from 'react';

export const UserContext = createContext({
  user: null,
  likedRecipes: [],
  setUser: () => {},
  setLikedRecipes: () => {}
});

export const UserProvider = ({ children }) => {
  const storedUser = sessionStorage.getItem("user");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;
  const [user, setUser] = useState(initialUser);
  const [likedRecipes, setLikedRecipes] = useState([]);

  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      sessionStorage.setItem("user", JSON.stringify(userData));
    } else {
      sessionStorage.removeItem("user");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, likedRecipes, setLikedRecipes }}>
      {children}
    </UserContext.Provider>
  );
};
