import React, { useEffect, useState, useRef } from "react";
import {
  getConversations,
  deleteConversation,
  renameConversation,
} from "../../api/conversationApi";
import "./ConversationList.css";
import { EllipsisVertical } from "lucide-react";
import ConfirmModal from "../Modals/DeleteConfirmModal";
import RenameModal from "../Modals/RenameModal";

const ConversationList = ({ onSelectConversation, onNewChat, currentConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [renameModal, setRenameModal] = useState({ open: false, id: null, title: "" });
  const [selectedId, setSelectedId] = useState(null);
  const [dropdown, setDropdown] = useState({ open: false, x: 0, y: 0, id: null });
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown({ open: false, x: 0, y: 0, id: null });
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

  const handleSelect = (conversation) => {
    onSelectConversation(conversation);
  };

  const handleNewChatClick = async () => {
    await onNewChat();
    fetchConversations();
  };

  const handleDeleteClick = (id) => {
    setDropdown({ open: false });
    setSelectedId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await deleteConversation(selectedId, token);
      setConversations((prev) => prev.filter((conv) => conv._id !== selectedId));
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    } finally {
      setShowModal(false);
      setSelectedId(null);
    }
  };

  const handleRenameClick = (id, title) => {
    setDropdown({ open: false });
    setRenameModal({ open: true, id, title });
  };

  const handleRename = async () => {
    const { id, title } = renameModal;
    try {
      const token = localStorage.getItem("token");
      await renameConversation(id, title, token);
      setConversations((prev) =>
        prev.map((c) => (c._id === id ? { ...c, title } : c))
      );
      setRenameModal({ open: false, id: null, title: "" });
    } catch (err) {
      console.error("Failed to rename conversation:", err);
    }
  };

  const handleEllipsisClick = (e, id) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdown({
      open: true,
      x: rect.right - 100, 
      y: rect.bottom + 5,  
      id,
    });
  };

  return (
    <>
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{(conv.title || "Untitled Chat").replace(/^"|"$/g, "")}</span>

                <EllipsisVertical
                  size={16}
                  color="#bbb"
                  className="ellipsis-icon"
                  onClick={(e) => handleEllipsisClick(e, conv._id)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {dropdown.open && (
        <div
          ref={dropdownRef}
          className="conversation-dropdown"
          style={{
            position: "fixed",
            top: dropdown.y,
            left: dropdown.x,
            background: "#222",
            color: "#fff",
            borderRadius: "8px",
            padding: "5px 0",
            zIndex: 9999,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            width: "120px",
          }}
        >
          <div
            className="dropdown-item"
            onClick={() =>
              handleRenameClick(
                dropdown.id,
                conversations.find((c) => c._id === dropdown.id)?.title || ""
              )
            }
          >
            Rename
          </div>
          <div
            className="dropdown-item"
            onClick={() => handleDeleteClick(dropdown.id)}
          >
            Delete
          </div>
        </div>
      )}

      <ConfirmModal
        show={showModal}
        message="Are you sure you want to delete this chat?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowModal(false)}
      />

      <RenameModal
        show={renameModal.open}
        title={renameModal.title}
        onChange={(val) =>
          setRenameModal((prev) => ({ ...prev, title: val }))
        }
        onConfirm={handleRename}
        onCancel={() => setRenameModal({ open: false, id: null, title: "" })}
      />
    </>
  );
};

export default ConversationList;
