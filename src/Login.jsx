import React, { useState, useContext } from "react";
import axios from "axios";
import './login.css';
import { UserContext } from "./context/UserContext.jsx";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/users/login", { email, password });
      const { userId, name, message: loginMessage } = response.data;
      if (userId) {
        // Update the user context with a fallback for the name
        setUser({ userId, name: name || "" });
        const welcomeMsg = name ? `Login successful! Welcome, ${name}` : "Login successful! Welcome!";
        setMessage(welcomeMsg);
      } else {
        setMessage("Login failed. No user information received.");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to login");
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
