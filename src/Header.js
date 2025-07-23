import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="game-header">
      <div className="logo">
        {/* You can use an img tag for the logo if you have it */}
        <span className="logo-icon">🚀</span>
        <span>Advance Careers</span>
      </div>
      <div className="user-profile">
        <div className="avatar">MN</div>
        <div className="user-info">
          <span className="user-name">Matthew N.</span>
          <span className="user-level">Level 6</span>
          <div className="xp-bar">
            <div className="xp-progress" style={{ width: '83.33%' }}></div> {/* 100/120 */}
          </div>
        </div>
      </div>
    </header>
  );
}