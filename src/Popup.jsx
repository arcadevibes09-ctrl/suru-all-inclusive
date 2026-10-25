import React from 'react';
import './styles/Popup.css';

export default function Popup({ isOpen, word, definition, onClose, currentFont }) {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div 
        className="popup-box" 
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: currentFont }}
      >
        <div className="popup-header">
          <h3>{word}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="popup-body">
          <p>{definition}</p>
        </div>
      </div>
    </div>
  );
}

