import React, { useState } from "react";
import { login, register } from "../../api/authApi"; 
import GoogleLoginButton from "../GoogleLoginButton";
import { validateEmail, validatePassword, validateUsername } from "../../utils/validator";
import "./AuthForm.css";

const AuthForm = ({ onLoginSuccess = () => {}, onClose = () => {} }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Track invalid fields
  const [touched, setTouched] = useState({ email: false, username: false, password: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation
    if (!validateEmail(email)) return setError("Invalid email address");
    if (!validatePassword(password)) return setError("Password must be at least 6 characters");
    if (!isLogin && !validateUsername(username)) return setError("Username must be 3-20 characters");

    setLoading(true);
    try {
      if (isLogin) {
        const res = await login(email, password);
        localStorage.setItem("token", res.token);
        if (res.username) localStorage.setItem("username", res.username);
        onLoginSuccess();
        onClose();
      } else {
        await register(username, email, password);
        setIsLogin(true);
        setError("Registered successfully. Please log in.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) => {
    if (!touched[field]) return "";
    switch (field) {
      case "email": return validateEmail(email) ? "" : "invalid";
      case "password": return validatePassword(password) ? "" : "invalid";
      case "username": return validateUsername(username) ? "" : "invalid";
      default: return "";
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
              onBlur={() => setTouched({ ...touched, username: true })}
              className={inputClass("username")}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched({ ...touched, email: true })}
            className={inputClass("email")}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched({ ...touched, password: true })}
            className={inputClass("password")}
            required
          />

          <div className="login-buttons-wrapper">
            <button type="submit" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
            </button>
            <GoogleLoginButton onLoginSuccess={onLoginSuccess} />
          </div>

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

          <button className="link-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
