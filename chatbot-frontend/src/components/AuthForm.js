import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const AuthForm = ({ onLoginSuccess = () => {}, onClose = () => {} }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
        localStorage.setItem("token", res.data.token);
        if (res.data.username) {
          localStorage.setItem("username", res.data.username);
        }
        onLoginSuccess();
        onClose();

      } else {
        await axios.post(`${API_URL}/api/auth/register`, { username, email, password });
        // After successful register, switch to login
        setIsLogin(true);
        setError("Registered successfully. Please log in.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
          {error && <p className="error">{error}</p>}
        </form>

        <div className="auth-footer">
          <button
            className="link-btn"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>

          <button className="link-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
