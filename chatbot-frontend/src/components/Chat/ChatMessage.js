import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";


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
  <div key={`${i}-${msg.content.length}`} className={`chat-message ${msg.role}`}>
    <div className="ai-markdown-content">
      <ReactMarkdown
        key={`${i}-${msg.content.length}`}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {msg.content}
      </ReactMarkdown>
    </div>
  </div>
))}


      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
