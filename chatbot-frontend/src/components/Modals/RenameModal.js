import React from "react";
import "./Modal.css";

const RenameModal = ({ show, title, onChange, onConfirm, onCancel }) => {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h4>Rename Chat</h4>
        <input
          type="text"
          value={title}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter new chat name"
          className="rename-input"
        />
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="confirm-btn" onClick={onConfirm}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default RenameModal;
