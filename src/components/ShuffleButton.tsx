import '../styles/ShuffleButton.css';

interface ShuffleButtonProps {
  onClick: () => void;
}

export function ShuffleButton({ onClick }: ShuffleButtonProps) {
  return (
    <button className="shuffle-button" onClick={onClick} aria-label="Shuffle letters">
      SHUFFLE
    </button>
  );
}
