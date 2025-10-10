import React, { useEffect, useState } from "react";
import { getConversations } from "../../api/conversationApi"; 
import "./ConversationList.css";

const ConversationList = ({ onSelectConversation, onNewChat, currentConversation }) => {
  const [conversations, setConversations] = useState([]);

  // Fetch conversations from API
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const data = await getConversations(token);
      setConversations(data || []);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSelect = (conversation) => {
    onSelectConversation(conversation);
  };

  const handleNewChatClick = async () => {
    await onNewChat();
    fetchConversations(); // refresh after creating new chat
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
