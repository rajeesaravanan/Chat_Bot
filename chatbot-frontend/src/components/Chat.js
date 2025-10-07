import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import AuthForm from "./AuthForm";
import ConversationList from "./ConversationLists";
import LogoutConfirmModal from "./logoutConfirmModal";
import "./Chat.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

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

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUsername(localStorage.getItem("username") || "");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Send user message
  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!isChatStarted) setIsChatStarted(true);

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const loadingMessage = { role: "assistant", content: " ✨ AMI is typing..." };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/api/messages/chat`,
        { query: input, conversationId: currentConversation?._id || null },
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );

      // Replace loading message with AI answer
      setMessages(prev =>
        prev.map(msg =>
          msg.content === " ✨ AMI is typing..."
            ? { role: "assistant", content: res.data.answer }
            : msg
        )
      );

      // Update current conversation with ID and AI-generated title
      if (res.data.conversationId && !currentConversation?._id) {
        setCurrentConversation(prev => ({
          ...(prev || {}),
          _id: res.data.conversationId,
          title: res.data.conversationTitle || "New Chat"
        }));
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !showAuth) sendMessage();
  };

  // Toggle sidebar
  const toggleSidebar = () => setShowSidebar(prev => !prev);

  // New conversation
  const handleNewChat = async () => {
    if (!isLoggedIn) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/api/conversations/newChat`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentConversation(res.data.conversation);
      setMessages([]);
      setIsChatStarted(false);
    } catch (err) {
      console.error("Failed to create new chat:", err);
    }
  };

  // Select conversation
  const handleSelectConversation = async (conversation) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/conversations/${conversation._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentConversation(conversation);
      setMessages(res.data.conversation.messages || []);
      setIsChatStarted(res.data.conversation.messages?.length > 0);
    } catch (err) {
      console.error("Failed to load conversation:", err);
    }
  };

  // Logout
  const logout = () => setIsLogoutModalOpen(true);
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="chat-container">
      {/* Conversation Sidebar */}
      <div className={`conversation-sidebar ${showSidebar ? "visible" : ""}`}>
        {isLoggedIn && showSidebar && (
          <ConversationList
            currentConversation={currentConversation}
            onSelectConversation={handleSelectConversation}
            onNewChat={handleNewChat}
          />
        )}
      </div>

      {/* Toggle button always visible */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {showSidebar ? "«" : "»"}
      </button>

      {/* Header */}
      <div className="chat-header">
        <div className="bot-name">
          <span className="sparkle-text">AMI ✨</span>
        </div>
        <div className="auth-controls">
          {isLoggedIn ? (
            <button className="auth-btn" onClick={logout}>Logout</button>
          ) : (
            <button className="auth-btn" onClick={() => setShowAuth(true)}>Login / Register</button>
          )}
        </div>
      </div>

      {/* Greeting */}
      <div className={`chat-greeting ${isChatStarted ? "hidden" : ""}`}>
        {isLoggedIn && username
          ? `Hello ${username}!! How can I help you?`
          : "How can I help you?"}
      </div>

      {/* Chat Box */}
      <div className="chat-box">
        <div className={`chat-messages ${isChatStarted ? "chat-active" : "chat-inactive"}`}>
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              {msg.content}
            </div>
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
          <button onClick={sendMessage}>→</button>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <div className="auth-modal">
          <div className="auth-modal-backdrop" onClick={() => setShowAuth(false)} />
          <div className="auth-modal-content">
            <AuthForm
              onLoginSuccess={() => {
                setIsLoggedIn(true);
                setUsername(localStorage.getItem("username") || "");
                setShowAuth(false);
              }}
              onClose={() => setShowAuth(false)}
            />
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onConfirm={confirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};

export default Chat;
