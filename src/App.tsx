import { useEffect, useCallback } from 'react';
import { useGameState } from './hooks/useGameState';
import { ScorePanel } from './components/ScorePanel';
import { CurrentWord } from './components/CurrentWord';
import { LetterRow } from './components/LetterRow';
import { ShuffleButton } from './components/ShuffleButton';
import { Message } from './components/Message';
import { FoundWords } from './components/FoundWords';
import './styles/App.css';

function App() {
  const {
    gameState,
    addLetter,
    removeLetter,
    clearWord,
    shuffleLetters,
    submitWord,
  } = useGameState();

  // Keyboard event handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Spacebar: shuffle
    if (event.code === 'Space') {
      event.preventDefault();
      shuffleLetters();
      return;
    }

    // Enter: submit word
    if (event.code === 'Enter') {
      event.preventDefault();
      submitWord();
      return;
    }

    // Backspace/Delete: remove letter
    if (event.code === 'Backspace' || event.code === 'Delete') {
      event.preventDefault();
      removeLetter();
      return;
    }

    // Escape: clear word
    if (event.code === 'Escape') {
      event.preventDefault();
      clearWord();
      return;
    }

    // Letter keys: add to current word if it's a puzzle letter
    if (event.key.length === 1 && /[a-z]/i.test(event.key)) {
      const letter = event.key.toLowerCase();
      if (gameState.puzzle.letters.includes(letter)) {
        addLetter(letter);
      }
    }
  }, [shuffleLetters, submitWord, removeLetter, clearWord, addLetter, gameState.puzzle.letters]);

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">WordHive</h1>
        <p className="app-subtitle">Daily Word Puzzle</p>
      </header>

      <ScorePanel
        score={gameState.score}
        maxScore={gameState.puzzle.maxScore}
        foundWords={gameState.foundWords.length}
        totalWords={gameState.puzzle.totalWords}
      />

      <Message message={gameState.message} />

      <div className="game-area">
        <CurrentWord word={gameState.currentWord} />

        <LetterRow
          letters={gameState.puzzle.letters}
          centerLetter={gameState.puzzle.centerLetter}
          shuffledOrder={gameState.shuffledOrder}
          onLetterClick={addLetter}
        />

        <div className="game-controls">
          <button className="control-button" onClick={clearWord}>
            Clear
          </button>
          <ShuffleButton onClick={shuffleLetters} />
          <button className="control-button submit-button" onClick={submitWord}>
            Submit
          </button>
        </div>
      </div>

      <FoundWords words={gameState.foundWords} />

      <footer className="app-footer">
        <p>Press SPACE to shuffle • ENTER to submit • ESC to clear</p>
      </footer>
    </div>
  );
}

export default App;
