// src/components/Game.js

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import puzzlesData from "./puzzles.json";
import Header from "./Header";
import LeftPanel from "./LeftPanel";
import ConnectionsGrid from "./ConnectionsGrid";
import Leaderboard from "./Leaderboard";
import "./Game.css";

// --- NEW PUZZLE GENERATION LOGIC ---

/**
 * Shuffles an array in place and returns it.
 * @param {Array} array The array to shuffle.
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Generates a new puzzle on the fly from large categories.
 * Implements the "copy" rule for overlapping words.
 */
function generatePuzzle() {
  // 1. Pick a random puzzle template (e.g., "university_and_professions_1")
  const puzzleTemplate = puzzlesData[Math.floor(Math.random() * puzzlesData.length)];

  // 2. Randomly select 4 categories from the template for this game
  const chosenCategories = shuffle([...puzzleTemplate.categories]).slice(0, 4);

  const finalGroups = [];
  const allWordsForGrid = new Set();
  
  // 3. Find all possible overlapping words between the 4 chosen categories
  const overlaps = [];
  for (let i = 0; i < chosenCategories.length; i++) {
    for (let j = i + 1; j < chosenCategories.length; j++) {
      const catA = chosenCategories[i];
      const catB = chosenCategories[j];
      const intersection = catA.words.filter(word => catB.words.includes(word));
      if (intersection.length > 0) {
        overlaps.push({ word: intersection[0], cats: [catA, catB] }); // Store the first overlap found
      }
    }
  }

  let categoriesToProcess = [...chosenCategories];

  // 4. Implement the "Copy" Rule if an overlap exists
  if (overlaps.length > 0) {
    const chosenOverlap = overlaps[0]; // Use the first overlap we found
    const duplicateWord = chosenOverlap.word;
    const [catA, catB] = chosenOverlap.cats;

    // The group that GETS the duplicate word
    const groupAWords = shuffle(catA.words.filter(w => w !== duplicateWord)).slice(0, 3);
    groupAWords.push(duplicateWord); // Add the duplicate
    finalGroups.push({ name: catA.name, words: shuffle(groupAWords) });
    groupAWords.forEach(w => allWordsForGrid.add(w));
    
    // Remove the two categories involved in the overlap from the main processing list
    categoriesToProcess = categoriesToProcess.filter(c => c.name !== catA.name && c.name !== catB.name);

    // The group that LOSES the duplicate word now needs 4 new words
    const groupBWords = shuffle(catB.words.filter(w => !allWordsForGrid.has(w))).slice(0, 4);
    finalGroups.push({ name: catB.name, words: shuffle(groupBWords) });
    groupBWords.forEach(w => allWordsForGrid.add(w));
  }

  // 5. Process the remaining categories normally
  for (const category of categoriesToProcess) {
    const availableWords = category.words.filter(w => !allWordsForGrid.has(w));
    const selectedWords = shuffle(availableWords).slice(0, 4);
    
    if (selectedWords.length < 4) {
        // This is a fallback in case a category runs out of unique words.
        // In a real-world scenario, you'd need more robust data or logic.
        console.warn(`Category "${category.name}" could not provide 4 unique words.`);
        // For now, we just proceed, the game will have fewer than 16 words.
    }
    
    finalGroups.push({ name: category.name, words: shuffle(selectedWords) });
    selectedWords.forEach(w => allWordsForGrid.add(w));
  }
  
  // 6. Return the puzzle in the format the rest of the app expects
  return {
    groups: shuffle(finalGroups)
  };
}


// --- MAIN GAME COMPONENT ---

// An array of the CSS class names we will use for the colors.
const GROUP_COLOR_CLASSES = ['color-0', 'color-1', 'color-2', 'color-3'];

export default function Game() {
  const [puzzle, setPuzzle] = useState(generatePuzzle);
  const [allWords, setAllWords] = useState(() => puzzle.groups.flatMap(g => g.words));
  const [words, setWords] = useState(() => shuffle([...allWords]));
  
  const [selected, setSelected] = useState([]);
  
  // --- STATE CHANGE HERE ---
  // 'locked' is now an object to store more data per word, like its color class.
  // Structure will be: { "WORD": { className: "color-0" }, ... }
  const [locked, setLocked] = useState({});

  const [message, setMessage] = useState("Find four words that share a connection!"); // Add a default message
  const [groupsFound, setGroupsFound] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  // --- LOGIC CHANGE IN checkGroup ---
  const checkGroup = () => {
    if (selected.length !== 4 || isGameOver) return;

    const foundGroup = puzzle.groups.find(g =>
      g.words.length === 4 && g.words.every(w => selected.includes(w))
    );

    if (foundGroup) {
      // 1. Get the color for the newly found group
      const colorClass = GROUP_COLOR_CLASSES[groupsFound];
      const newLockedEntries = {};
      foundGroup.words.forEach(word => {
        newLockedEntries[word] = { className: colorClass };
      });
      
      // 2. Update the locked state with the new words and their color class
      setLocked(prev => ({ ...prev, ...newLockedEntries }));
      
      const newGroupsFound = groupsFound + 1;
      setGroupsFound(newGroupsFound);
      setSelected([]);
      
      // 3. Update the message to show the group name
      setMessage(`✅ Group Found: ${foundGroup.name}`);

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
    // Check against the keys of the locked object now
    if (locked[word] || isGameOver) return;
    setSelected(prev =>
      prev.includes(word) ? prev.filter(w => w !== word) : prev.length < 4 ? [...prev, word] : prev
    );
  };
  
  const newPuzzle = () => {
    // ... (logic for generating new puzzle data)
    
    // --- STATE CHANGE HERE ---
    // Reset locked to an empty object
    setLocked({});
    setMessage("Find four words that share a connection!");
    // ... (reset all other states)
  };
  
  // ... (rest of the component, useEffects, etc. remain the same) ...

  return (
    <div className="game-container">
      <Header />
      <main className="game-main">
        <LeftPanel onSubmit={checkGroup} />
        <ConnectionsGrid
          words={words}
          selected={selected}
          locked={locked} // Pass the locked object down
          onSelect={handleSelect}
          lives={lives}
          seconds={seconds}
          message={message} // Pass the message down
        />
        <Leaderboard />
      </main>
    </div>
  );
}