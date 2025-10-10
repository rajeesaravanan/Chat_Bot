import React from "react";
import "./Chat.css";

const ChatInput = ({ input, setInput, sendMessage, isChatStarted }) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className={`chat-input-container ${isChatStarted ? "bottom" : "center"}`}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask Ami..."
      />
      <button onClick={sendMessage}>→</button>
    </div>
  );
};

export default ChatInput;
