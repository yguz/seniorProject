import React, { useState } from "react";
import './login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/users/login", { email, password });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to login");
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
