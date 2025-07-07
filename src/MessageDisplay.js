import React from 'react';
import './MessageDisplay.css';

const MessageDisplay = ({ message }) => (
  <div className="message-display">
    {message}
  </div>
);

export default MessageDisplay;
