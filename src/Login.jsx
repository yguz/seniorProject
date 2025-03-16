import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import './login.css';
import { UserContext } from "./context/UserContext.jsx";

const Login = () => {
  const { setUser, setIsAuthenticated } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/users/login", { email, password });
      const { userId, name } = response.data;
      if (userId) {
        setUser({ userId, name: name || "" });
        setIsAuthenticated(true);
        setMessage(`Login successful! Welcome, ${name || "User"}`);
        
        // Redirect to dashboard after successful login
        navigate("/dashboard"); 
      } else {
        setMessage("Login failed. No user information received.");
        setIsAuthenticated(false);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to login");
      setIsAuthenticated(false);
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter your email" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter your password" 
          required 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
