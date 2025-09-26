import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isChatStarted, setIsChatStarted] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
  if (!input.trim()) return;

  if (!isChatStarted) setIsChatStarted(true);

  const userMessage = { role: "user", content: input };
  setMessages(prev => [...prev, userMessage]);
  
  setInput(""); // clear input immediately

  // Add loading message
  const loadingMessage = { role: "assistant", content: " ✨ AMI is typing..." };
  setMessages(prev => [...prev, loadingMessage]);

  try {
    const res = await axios.post("http://localhost:8080/api/chat", { query: input });
    
    // Replace loading message with actual response
    setMessages(prev => prev.map(msg => 
      msg.content === " ✨ AMI is typing..." ? { role: "assistant", content: res.data.answer } : msg
    ));
  } catch (err) {
    setMessages(prev => prev.map(msg => 
      msg.content === " ✨ AMI is typing..." ? { role: "assistant", content: "Oops! Something went wrong." } : msg
    ));
  }
}


  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };
  

  return (

    <div className="chat-container">

      <div className="bot-name">
  <span className="sparkle-text">  AMI ✨</span>
</div>

      {/* Greeting */}
      <div className={`chat-greeting ${isChatStarted ? "hidden" : ""}`}>
        How can I help you?
      </div>

      {/* Chat box */}
  <div className="chat-box">
    <div className={`chat-messages ${isChatStarted ? "chat-active" : "chat-inactive"}`}>
      {messages.map((msg, i) => (
        <div key={i} className={`chat-message ${msg.role}`}>
          {msg.content}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>

    {/* Input */}
    <div className={`chat-input-container ${isChatStarted ? "bottom" : "center"}`}>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask Ami..."
      />
      <button onClick={sendMessage}>→</button>
    </div>
  </div>
    </div>
  );
};

export default Chat;
