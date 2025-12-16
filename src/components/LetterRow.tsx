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
 */
export function LetterRow({ letters, centerLetter, shuffledOrder, onLetterClick }: LetterRowProps) {
  return (
    <div className="letter-row">
      {shuffledOrder.map((index) => {
        const letter = letters[index];
        return (
          <LetterTile
            key={index}
            letter={letter}
            isCenterLetter={letter === centerLetter}
            onClick={() => onLetterClick(letter)}
          />
        );
      })}
    </div>
  );
}
