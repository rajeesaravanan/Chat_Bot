import React, { useState, useRef, useEffect, useCallback } from "react";
import AuthForm from "../Auth/AuthForm";
import ConversationList from "../Sidebar/ConversationList";
import LogoutConfirmModal from "../Modals/LogoutConfirmModal";
import { sendMessageApi } from "../../api/chatApi";
import { getConversations, newConversationApi, getConversationById } from "../../api/conversationApi";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [conversations, setConversations] = useState([]);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);

  // fetchConversations memoized
  const fetchConversations = useCallback(async () => {
    if (!isLoggedIn) return;
    const token = localStorage.getItem("token");
    try {
      const convs = await getConversations(token);
      setConversations(convs);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUsername(localStorage.getItem("username") || "");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (!isChatStarted) setIsChatStarted(true);

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const loadingMessage = { role: "assistant", content: " ✨ AMI is typing..." };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const token = localStorage.getItem("token");
      const res = await sendMessageApi(input, currentConversation?._id, token);

      setMessages(prev =>
        prev.map(msg =>
          msg.content === " ✨ AMI is typing..."
            ? { role: "assistant", content: res.answer }
            : msg
        )
      );

      if (res.conversationId) {
  setCurrentConversation(prev => ({
    ...(prev || {}),
    _id: res.conversationId,
    title: res.conversationTitle || (prev?.title || "New Chat")
  }));
  fetchConversations(); // refresh sidebar list
}

    } catch (err) {
      setMessages(prev =>
        prev.map(msg =>
          msg.content === " ✨ AMI is typing..."
            ? { role: "assistant", content: "Oops! Something went wrong." }
            : msg
        )
      );
    }
  };

  const handleKeyPress = (e) => { if (e.key === "Enter" && !showAuth) handleSendMessage(); };
  const toggleSidebar = () => {
  if (!isLoggedIn) {
    setShowAuth(true);
    return;
  }
  setShowSidebar(prev => !prev);
};

  const handleNewChat = async () => {
    if (!isLoggedIn) return;
    try {
      const token = localStorage.getItem("token");
      const conversation = await newConversationApi(token);
      setCurrentConversation(conversation);
      setMessages([]);
      setIsChatStarted(false);
      fetchConversations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectConversation = async (conversation) => {
    try {
      const token = localStorage.getItem("token");
      const conv = await getConversationById(conversation._id, token);
      setCurrentConversation(conversation);
      setMessages(conv.messages || []);
      setIsChatStarted(conv.messages?.length > 0);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => setIsLogoutModalOpen(true);
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");

     setMessages([]);
  setInput("");
  setIsChatStarted(false);
  setCurrentConversation(null);

    setIsLogoutModalOpen(false);
  };

  return (
    <div className="chat-container">
      <div className={`conversation-sidebar ${showSidebar ? "visible" : ""}`}>
        {isLoggedIn && showSidebar && (
          <ConversationList
            currentConversation={currentConversation}
            onSelectConversation={handleSelectConversation}
            onNewChat={handleNewChat}
            conversations={conversations}
          />
        )}
      </div>

      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {showSidebar ? "«" : "»"}
      </button>

      <div className="chat-header">
        <div className="bot-name">AMI ✨</div>
        <div className="auth-controls">
          {isLoggedIn ? (
            <button className="auth-btn" onClick={logout}>Logout</button>
          ) : (
            <button className="auth-btn" onClick={() => setShowAuth(true)}>Login / Register</button>
          )}
        </div>
      </div>

      <div className={`chat-greeting ${isChatStarted ? "hidden" : ""}`}>
        {isLoggedIn && username ? `Hello ${username}!! How can I help you?` : "How can I help you?"}
      </div>

      <div className="chat-box">
        <div className={`chat-messages ${isChatStarted ? "chat-active" : "chat-inactive"}`}>
          {messages.map((msg, i) => (
            <div 
  key={i} 
  className={`chat-message ${msg.role}`} 
  dangerouslySetInnerHTML={{ __html: msg.content }} 
></div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className={`chat-input-container ${isChatStarted ? "bottom" : "center"}`}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Ami..."
          />
          <button onClick={handleSendMessage}>→</button>
        </div>
      </div>

      {showAuth && (
        <AuthForm
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            setUsername(localStorage.getItem("username") || "");
            setShowAuth(false);
          }}
          onClose={() => setShowAuth(false)}
        />
      )}

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onConfirm={confirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};

export default Chat;
