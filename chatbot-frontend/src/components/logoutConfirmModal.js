import React from "react";
import "./LogoutConfirmModal.css";

const LogoutConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="logout-modal">
      <div className="logout-backdrop" onClick={onCancel}></div>
      <div className="logout-card">
        <h3>Logout Confirmation</h3>
        <p>Are you sure you want to log out?</p>
        <div className="logout-buttons">
          <button className="confirm-btn" onClick={onConfirm}>
            Logout
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
