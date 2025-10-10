import React, { useEffect, useRef } from "react";
import "./Chat.css";

const ChatMessages = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className={`chat-messages ${messages.length > 0 ? "chat-active" : "chat-inactive"}`}>
      {messages.map((msg, i) => (
        <div 
  key={i} 
  className={`chat-message ${msg.role}`} 
  dangerouslySetInnerHTML={{ __html: msg.content }} 
>
          {msg.content}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
