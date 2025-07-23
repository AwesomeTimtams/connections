import React from "react";
import "./LeftPanel.css";

export default function LeftPanel({ onSubmit }) {
  return (
    <div className="left-panel sideboxes">
      <div className="game-modes">
        <button className="mode-button active">
          <span className="mode-icon">🗓️</span> DAILY PUZZLE
        </button>
        <button className="mode-button">
          <span className="mode-icon">♾️</span> ENDLESS
        </button>
        <button className="mode-button">
          <span className="mode-icon">🏋️</span> PRACTICE
        </button>
      </div>
      <div className="spacer"></div>
      <div className="action-buttons">
        <button className="submit-button" onClick={onSubmit}>
          SUBMIT?
        </button>
        <button className="hint-button">NEED A HINT?</button>
      </div>
    </div>
  );
}