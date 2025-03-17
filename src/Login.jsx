import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";
import './login.css';
import { UserContext } from "./context/UserContext.jsx";

const Login = () => {
  const { setUser, setIsAuthenticated } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  // Check if user was redirected from a protected route
  useEffect(() => {
    if (location.state?.from) {
      setMessage("Please log in to access this page");
    }
  }, [location]);

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
      {message && <p className={message.includes("successful") ? "success-message" : "error-message"}>{message}</p>}
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
      <p>Don't have an account? <a href="/register">Register here</a></p>
    </div>
  );
};

export default Login;
