import React, { useEffect, useCallback } from "react";
import { googleLogin } from "../api/authApi";

const GoogleLoginButton = ({ onLoginSuccess }) => {
  const handleCredentialResponse = useCallback(async (response) => {
    try {
      const res = await googleLogin(response.credential);

      localStorage.setItem("token", res.token);
      if (res.username) localStorage.setItem("username", res.username);

      onLoginSuccess();
    } catch (err) {
      console.error("Google login failed:", err.response?.data || err.message);
    }
  }, [onLoginSuccess]);

 useEffect(() => {
  if (window.google) {
    const container = document.getElementById("googleSignInDiv");

    container.innerHTML = "";

    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(container, {
      theme: "filled_blue",
      size: "large",
      type: "icon",
      shape: "pill",
      width: 180,
    });
  }
}, [handleCredentialResponse]);


  return (
  <div className="google-button-wrapper">
    <div id="googleSignInDiv"></div>
  </div>
);
};

export default GoogleLoginButton;
