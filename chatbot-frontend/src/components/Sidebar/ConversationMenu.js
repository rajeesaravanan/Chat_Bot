import React from "react";
import "./ConversationMenu.css";

const ConversationMenu = ({ onRename, onDelete, onClose }) => {
  return (
    <div className="conversation-menu" onClick={(e) => e.stopPropagation()}>
      <div className="menu-item" onClick={onRename}>
         Rename
      </div>
      <div className="menu-item delete" onClick={onDelete}>
         Delete
      </div>
    </div>
  );
};

export default ConversationMenu;