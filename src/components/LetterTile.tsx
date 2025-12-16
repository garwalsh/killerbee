/**
 * Component for individual letter tiles in the game
 */

import '../styles/LetterTile.css';

interface LetterTileProps {
  letter: string;
  isCenterLetter: boolean;
  onClick: () => void;
}

/**
 * Clickable letter tile component
 * Center letter is highlighted with special styling
 */
export function LetterTile({ letter, isCenterLetter, onClick }: LetterTileProps) {
  return (
    <button
      className={`letter-tile ${isCenterLetter ? 'center-letter' : ''}`}
      onClick={onClick}
      aria-label={`Letter ${letter.toUpperCase()}${isCenterLetter ? ' (center letter)' : ''}`}
    >
      {letter.toUpperCase()}
    </button>
  );
}
