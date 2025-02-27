import React, { useState } from "react";
import axios from "axios";  
import './login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/users/login", { email, password });

      const { userId, message: loginMessage } = response.data;

      if (userId) {
        // Store the userId in sessionStorage (or localStorage if you want it to persist after closing the browser)
        sessionStorage.setItem("userId", userId);
        setMessage(`Login successful! Welcome, User ID: ${userId}`);
      } else {
        setMessage("Login failed. No userId received.");
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
