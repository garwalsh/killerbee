/**
 * Component for displaying the current word being typed
 */

import '../styles/CurrentWord.css';

interface CurrentWordProps {
  word: string;
}

/**
 * Displays the word currently being built by the player
 * Shows a placeholder message when empty and includes a blinking cursor
 */
export function CurrentWord({ word }: CurrentWordProps) {
  return (
    <div className="current-word">
      <div className="word-display">
        {word ? (
          <>
            <span>{word.toUpperCase()}</span>
            <span className="cursor"></span>
          </>
        ) : (
          <>
            <span className="placeholder">Type or click</span>
            <span className="cursor"></span>
          </>
        )}
      </div>
    </div>
  );
}
