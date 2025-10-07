import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ConversationList.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const ConversationList = ({ onSelectConversation, onNewChat, currentConversation }) => {
  const [conversations, setConversations] = useState([]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(res.data.conversations || []);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) fetchConversations();
  }, []);

  const handleSelect = (conversation) => {
    onSelectConversation(conversation);
  };

  const handleNewChatClick = async () => {
    await onNewChat();
    fetchConversations(); // refresh list after creating new chat
  };

  return (
    <div className="conversation-list-container">
      <button className="new-chat-btn" onClick={handleNewChatClick}>
        + New Chat
      </button>
      <div className="conversation-list">
        {conversations.map((conv) => (
          <div
            key={conv._id}
            className={`conversation-item ${
              currentConversation?._id === conv._id ? "active" : ""
            }`}
            onClick={() => handleSelect(conv)}
          >
            {conv.title || "Untitled Chat"}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
