import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import puzzles from "./puzzles.json";
import Header from "./Header";
import LeftPanel from "./LeftPanel";
import ConnectionsGrid from "./ConnectionsGrid";
import Leaderboard from "./Leaderboard";
import "./Game.css"; // New main stylesheet

// Helper to pick a random puzzle
function pickRandomPuzzle() {
  return puzzles[Math.floor(Math.random() * puzzles.length)];
}

export default function Game() {
  const [puzzle, setPuzzle] = useState(pickRandomPuzzle);
  const [allWords, setAllWords] = useState(() => puzzle.groups.flatMap(g => g.words));
  const [words, setWords] = useState(() =>
    [...allWords].sort(() => Math.random() - 0.5)
  );

  const [selected, setSelected] = useState([]);
  const [locked, setLocked] = useState([]);
  const [message, setMessage] = useState("");
  const [groupsFound, setGroupsFound] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);

  // Timer state
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);
  
  // Stop timer on game over
  useEffect(() => {
    if (isGameOver) {
      clearInterval(timerRef.current);
    }
  }, [isGameOver]);

  const handleSelect = (word) => {
    if (locked.includes(word) || isGameOver) return;
    setSelected(prev =>
      prev.includes(word) ? prev.filter(w => w !== word) : prev.length < 4 ? [...prev, word] : prev
    );
  };

  const checkGroup = () => {
    if (selected.length !== 4) return;
    if (isGameOver) return;

    const foundGroup = puzzle.groups.find(g =>
      g.words.length === 4 && g.words.every(w => selected.includes(w))
    );

    if (foundGroup) {
      setLocked(prev => [...prev, ...foundGroup.words]);
      const newGroupsFound = groupsFound + 1;
      setGroupsFound(newGroupsFound);
      setSelected([]);

      if (newGroupsFound === 4) {
        setMessage("🎉 You found all groups!");
        setIsGameOver(true);
        confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
      } else {
        setMessage(`Group Found: ${foundGroup.name}`);
      }
    } else {
      setLives(l => l - 1);
      setMessage("Incorrect. Try again.");
      if (lives - 1 <= 0) {
        setMessage("💔 Game Over");
        setIsGameOver(true);
      }
    }
  };
  
  // We can add functions for New Puzzle, Hint, etc. here later

  return (
    <div className="game-container">
      <Header />
      <main className="game-main">
        <LeftPanel onSubmit={checkGroup} />
        <ConnectionsGrid
          words={words}
          selected={selected}
          locked={locked}
          onSelect={handleSelect}
          lives={lives}
          seconds={seconds}
        />
        <Leaderboard />
      </main>
    </div>
  );
}