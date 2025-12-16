/**
 * Component for the shuffle button
 */

import '../styles/ShuffleButton.css';

interface ShuffleButtonProps {
  onClick: () => void;
}

/**
 * Button to shuffle the outer 6 letters (center letter stays fixed)
 */
export function ShuffleButton({ onClick }: ShuffleButtonProps) {
  return (
    <button className="shuffle-button" onClick={onClick} aria-label="Shuffle letters">
      SHUFFLE
    </button>
  );
}
