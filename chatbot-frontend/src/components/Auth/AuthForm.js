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
  const [loading, setLoading] = useState(false);

  // Track errors per field
  const [errors, setErrors] = useState({ email: "", username: "", password: "" });

  // Validate a single field
  const validateField = (field, value) => {
    switch (field) {
      case "email":
        setErrors((prev) => ({ ...prev, email: validateEmail(value) ? "" : "Invalid email address" }));
        break;
      case "password":
        setErrors((prev) => ({ ...prev, password: validatePassword(value) ? "" : "Password must be at least 6 characters" }));
        break;
      case "username":
        setErrors((prev) => ({ ...prev, username: validateUsername(value) ? "" : "Username must be 3-20 characters" }));
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check all fields before submitting
    if (!validateEmail(email)) return setErrors((prev) => ({ ...prev, email: "Invalid email address" }));
    if (!validatePassword(password)) return setErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters" }));
    if (!isLogin && !validateUsername(username)) return setErrors((prev) => ({ ...prev, username: "Username must be 3-20 characters" }));

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
        setErrors({ email: "", username: "", password: "" });
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, email: err.response?.data?.error || "Something went wrong" }));
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
            <>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => validateField("username", username)}
              />
              {errors.username && <p className="field-error">{errors.username}</p>}
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateField("email", email)}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => validateField("password", password)}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}

          <div className="login-buttons-wrapper">
            <button type="submit" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
            </button>
            <GoogleLoginButton onLoginSuccess={onLoginSuccess} />
          </div>
        </form>

        <div className="auth-footer">
          <button
            className="link-btn"
            onClick={() => {
    setIsLogin(!isLogin);
    setErrors({ email: "", username: "", password: "" }); 
    setEmail("");    
    setUsername(""); 
    setPassword(""); 
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
