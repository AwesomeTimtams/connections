import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import puzzlesData from "./puzzles.json";
import Header from "./Header";
import LeftPanel from "./LeftPanel";
import ConnectionsGrid from "./ConnectionsGrid";
import Leaderboard from "./Leaderboard";
import "./Game.css";

// --- PUZZLE GENERATION LOGIC (No changes) ---

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generatePuzzle() {
  const puzzleTemplate = puzzlesData[Math.floor(Math.random() * puzzlesData.length)];
  const chosenCategories = shuffle([...puzzleTemplate.categories]).slice(0, 4);
  const finalGroups = [];
  const allWordsForGrid = new Set();
  const overlaps = [];
  for (let i = 0; i < chosenCategories.length; i++) {
    for (let j = i + 1; j < chosenCategories.length; j++) {
      const catA = chosenCategories[i];
      const catB = chosenCategories[j];
      const intersection = catA.words.filter(word => catB.words.includes(word));
      if (intersection.length > 0) {
        overlaps.push({ word: intersection[0], cats: [catA, catB] });
      }
    }
  }
  let categoriesToProcess = [...chosenCategories];
  if (overlaps.length > 0) {
    const chosenOverlap = overlaps[0];
    const duplicateWord = chosenOverlap.word;
    const [catA, catB] = chosenOverlap.cats;
    const groupAWords = shuffle(catA.words.filter(w => w !== duplicateWord)).slice(0, 3);
    groupAWords.push(duplicateWord);
    finalGroups.push({ name: catA.name, words: shuffle(groupAWords) });
    groupAWords.forEach(w => allWordsForGrid.add(w));
    categoriesToProcess = categoriesToProcess.filter(c => c.name !== catA.name && c.name !== catB.name);
    const groupBWords = shuffle(catB.words.filter(w => !allWordsForGrid.has(w))).slice(0, 4);
    finalGroups.push({ name: catB.name, words: shuffle(groupBWords) });
    groupBWords.forEach(w => allWordsForGrid.add(w));
  }
  for (const category of categoriesToProcess) {
    const availableWords = category.words.filter(w => !allWordsForGrid.has(w));
    const selectedWords = shuffle(availableWords).slice(0, 4);
    if (selectedWords.length < 4) {
      console.warn(`Category "${category.name}" could not provide 4 unique words.`);
    }
    finalGroups.push({ name: category.name, words: shuffle(selectedWords) });
    selectedWords.forEach(w => allWordsForGrid.add(w));
  }
  return {
    groups: shuffle(finalGroups)
  };
}

// --- MAIN GAME COMPONENT ---

const GROUP_COLOR_CLASSES = ['color-0', 'color-1', 'color-2', 'color-3'];

export default function Game() {
  const [puzzle, setPuzzle] = useState(generatePuzzle);
  const [words, setWords] = useState(() => shuffle(puzzle.groups.flatMap(g => g.words)));
  const [selected, setSelected] = useState([]);
  const [locked, setLocked] = useState({});
  const [solvedGroups, setSolvedGroups] = useState([]);
  const [message, setMessage] = useState("Find four words that share a connection!");
  const [groupsFound, setGroupsFound] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  // --- *** NEW: TIMER LOGIC *** ---
  useEffect(() => {
    // If the game is not over, start the timer.
    if (!isGameOver) {
      timerRef.current = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    } else {
      // If the game is over, clear the interval.
      clearInterval(timerRef.current);
    }

    // Cleanup function: This will be called when the component unmounts
    // or before the effect runs again. It prevents memory leaks.
    return () => clearInterval(timerRef.current);
  }, [isGameOver]); // The effect depends on the isGameOver state.


  const checkGroup = () => {
    if (selected.length !== 4 || isGameOver) return;

    const foundGroup = puzzle.groups.find(g =>
      g.words.length === 4 && g.words.every(w => selected.includes(w))
    );

    if (foundGroup) {
      const colorClass = GROUP_COLOR_CLASSES[groupsFound];
      const newSolvedGroup = {
        name: foundGroup.name,
        words: foundGroup.words.join(', '),
        className: colorClass
      };
      setSolvedGroups(prev => [...prev, newSolvedGroup]);
      setWords(prevWords => prevWords.filter(w => !foundGroup.words.includes(w)));
      const newLockedEntries = {};
      foundGroup.words.forEach(word => { newLockedEntries[word] = { className: colorClass }; });
      setLocked(prev => ({ ...prev, ...newLockedEntries }));
      const newGroupsFound = groupsFound + 1;
      setGroupsFound(newGroupsFound);
      setSelected([]);
      setMessage(`✅ Group Found!`);

      if (newGroupsFound === 4) {
        setMessage("🎉 You found all groups!");
        setIsGameOver(true);
        confetti();
      }
    } else {
      setLives(l => l - 1);
      setMessage("❌ Incorrect. Try again.");
      if (lives - 1 <= 0) {
        setMessage("💔 Game Over");
        setIsGameOver(true);
      }
    }
  };

  const handleSelect = (word) => {
    if (locked[word] || isGameOver) return;
    setSelected(prev =>
      prev.includes(word) ? prev.filter(w => w !== word) : prev.length < 4 ? [...prev, word] : prev
    );
  };
  
  const newPuzzle = () => {
    const newPuzzleData = generatePuzzle();
    setPuzzle(newPuzzleData);
    setWords(shuffle(newPuzzleData.groups.flatMap(g => g.words)));
    setSelected([]);
    setLocked({});
    setSolvedGroups([]);
    setMessage("Find four words that share a connection!");
    setGroupsFound(0);
    setLives(3);
    setIsGameOver(false);
    // Resetting seconds is crucial for a new game.
    setSeconds(0); 
  };
  
  return (
    <div className="game-container">
      <Header />
      <main className="game-main">
        <LeftPanel onSubmit={checkGroup} />
        <ConnectionsGrid
          words={words}
          selected={selected}
          locked={locked}
          solvedGroups={solvedGroups}
          onSelect={handleSelect}
          lives={lives}
          seconds={seconds}
          message={message}
        />
        <Leaderboard />
      </main>
    </div>
  );
}