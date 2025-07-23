import React from "react";
import "./Leaderboard.css";
import podium from './assets/podium.png';
import pfp from './assets/pfp.png';

// Sample data to populate the leaderboard
const leaderboardData = [
  { rank: 1, name: 'Matthew Ng', school: 'Trinity Grammar School', qpm: 85, time: '01:20' },
  { rank: 2, name: 'Chae Jeong', school: 'Scots College', qpm: 69, time: '4:20' },
];

export default function Leaderboard() {
  return (
    <div className="leaderboard sideboxes">
        <div className='lb_title_div'>
            <img src={podium} alt="podium" className='podium'/>
            <p className='lb_title'>Leaderboard</p>
        </div>  
      <ul className="leaderboard-list">
        {leaderboardData.map(entry => (
          <li key={entry.rank} className="leaderboard-entry">
            <div className={`rank-badge rank-${entry.rank}`}>{entry.rank}</div>
            <img className="player-avatar" src={pfp} alt="pfp"></img>
            <div className="player-info">
              <span className="player-name">{entry.name}</span>
              <span className="player-school">{entry.school}</span>
            </div>
            <div className="player-stats">
              <span className="stat-qpm">⭐ {entry.qpm} qpm</span>
              <span className="stat-time">🕒 {entry.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}