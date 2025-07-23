import React from "react";
import "./ConnectionsGrid.css";

const Heart = () => <span className="heart">❤️</span>;

export default function ConnectionsGrid({ words, selected, locked, onSelect, lives, seconds }) {
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
      <div className="board">
        {words.map((word) => {
          const isSelected = selected.includes(word);
          const isLocked = locked.includes(word);
          let className = "tile";
          if (isLocked) className += " locked";
          else if (isSelected) className += " selected";

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