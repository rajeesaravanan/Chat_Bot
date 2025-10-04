import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import Chat from "../components/Chat";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  return (
    <div>
      {isLoggedIn ? (
        <Chat />
      ) : (
        <AuthForm onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
};

export default Home;
