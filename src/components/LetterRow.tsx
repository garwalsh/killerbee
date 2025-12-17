/**
 * Component for displaying the row of letter tiles
 */

import { LetterTile } from './LetterTile';
import '../styles/LetterRow.css';

interface LetterRowProps {
  letters: string[];
  centerLetter: string;
  shuffledOrder: number[];
  onLetterClick: (letter: string) => void;
}

/**
 * Displays all 7 letter tiles in a row
 * The shuffledOrder determines the display order (center letter stays at position 3)
 * On small screens, displays in a 3-1-3 grid with center letter in the middle
 */
export function LetterRow({ letters, centerLetter, shuffledOrder, onLetterClick }: LetterRowProps) {
  // Split into three groups: first 3, center (position 3), last 3
  const tiles = shuffledOrder.map((index) => {
    const letter = letters[index];
    return (
      <LetterTile
        key={index}
        letter={letter}
        isCenterLetter={letter === centerLetter}
        onClick={() => onLetterClick(letter)}
      />
    );
  });

  return (
    <div className="letter-row">
      <div className="letter-row-top">{tiles.slice(0, 3)}</div>
      <div className="letter-row-middle">{tiles[3]}</div>
      <div className="letter-row-bottom">{tiles.slice(4, 7)}</div>
    </div>
  );
}
