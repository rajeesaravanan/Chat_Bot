import React, { useEffect, useCallback, useState } from "react";
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

  const [googleAvailable, setGoogleAvailable] = useState(false);

  useEffect(() => {
    // Log the origin so you can see what origin the mobile browser is using
    try {
      console.log("GoogleLoginButton origin:", window.location.origin);
    } catch (e) {
      console.log("GoogleLoginButton origin: (unavailable)");
    }

    const container = document.getElementById("googleSignInDiv");
    const initGSI = () => {
      if (!window.google || !container) return;
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
      setGoogleAvailable(true);
    };

    if (window.google && window.google.accounts && window.google.accounts.id) {
      initGSI();
      return;
    }

    // Dynamically load the GIS script if it's not present (helps on slow mobile)
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener('load', initGSI);
      existingScript.addEventListener('error', () => console.error('Failed to load Google Identity script'));
      return () => {
        existingScript.removeEventListener('load', initGSI);
      };
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGSI;
    script.onerror = () => console.error('Failed to load Google Identity script');
    document.head.appendChild(script);

    const timeout = setTimeout(() => {
      if (!googleAvailable) console.warn('Google Identity script not loaded after 5s');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [handleCredentialResponse, googleAvailable]);


  return (
    <div className="google-button-wrapper">
      <div id="googleSignInDiv"></div>
      {!googleAvailable && (
        <div style={{marginTop:8, fontSize:12, color:'#ffcccc'}}>
          Google Sign-in unavailable — try opening in your device's system browser or check network/origin settings.
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;
