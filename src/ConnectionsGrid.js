import React from "react";
import "./ConnectionsGrid.css";

const Heart = () => <span className="heart">❤️</span>;

export default function ConnectionsGrid({ words, selected, locked, solvedGroups, onSelect, lives, seconds, message }) {
  const time = new Date(seconds * 1000).toISOString().substr(14, 5);

  return (
    <div className="connections-grid-container">
      <h1 className="game-title">CAREER CONNECTION</h1>
      <div className="stats-bar">
        <div className="lives">
          LIVES: {Array.from({ length: lives }).map((_, i) => <Heart key={i} />)}
        </div>
        <div className="timer">TIME: {time}</div>
      </div>

      <div className="message-bar">{message}</div>

      {/* --- NEW: SOLVED GROUPS AREA --- */}
      <div className="solved-groups-container">
        {solvedGroups.map((group) => (
          <div key={group.name} className={`solved-group ${group.className}`}>
            <strong className="solved-group-name">{group.name}</strong>
            <span className="solved-group-words">{group.words}</span>
          </div>
        ))}
      </div>

      {/* --- UPDATED: ACTIVE GRID AREA --- */}
      <div className="board">
        {words.map((word) => {
          const isSelected = selected.includes(word);
          // No need to check for isLocked here anymore for styling, but it doesn't hurt
          // The main logic is that solved words are removed from the 'words' array
          const className = `tile${isSelected ? " selected" : ""}`;

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