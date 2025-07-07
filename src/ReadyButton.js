import React from 'react';
import './ReadyButton.css';

const ReadyButton = ({ disabled, onClick }) => (
  <button className="ready-btn" disabled={disabled} onClick={onClick}>
    ✅ I am Ready
  </button>
);

export default ReadyButton;
