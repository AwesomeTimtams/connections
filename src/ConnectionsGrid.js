// src/components/ConnectionsGrid.js

import React from "react";
import "./ConnectionsGrid.css";

const Heart = () => <span className="heart">❤️</span>;

export default function ConnectionsGrid({ words, selected, locked, onSelect, lives, seconds, message }) {
  const time = new Date(seconds * 1000).toISOString().substr(14, 5);

  return (
    <div className="connections-grid-container">
      <h1 className="game-title">CAREER CONNECTION</h1>
      <div className="stats-bar">
        {/* ... (lives and timer divs remain the same) ... */}
      </div>

      {/* --- ADDED MESSAGE DISPLAY --- */}
      <div className="message-bar">{message}</div>

      <div className="board">
        {words.map((word) => {
          // --- LOGIC CHANGE HERE ---
          const lockedInfo = locked[word];
          const isLocked = !!lockedInfo;
          const isSelected = selected.includes(word);

          let className = "tile";
          if (isLocked) {
            // Apply both 'locked' and the specific color class (e.g., 'color-0')
            className += ` locked ${lockedInfo.className}`;
          } else if (isSelected) {
            className += " selected";
          }

          return (
            <div
              key={word}
              className={className}
              onClick={() => onSelect(word)}
            >
              {word}
            </div>
          );
        })}
      </div>
    </div>
  );
}