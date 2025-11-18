import '../styles/ShuffleButton.css';

interface ShuffleButtonProps {
  onClick: () => void;
}

export function ShuffleButton({ onClick }: ShuffleButtonProps) {
  return (
    <button className="shuffle-button" onClick={onClick} aria-label="Shuffle letters">
      <svg className="shuffle-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 12C21 13 20 14 19 14H13M21 12L18 9M21 12L18 15M3 12C3 11 4 10 5 10H11M13 14L11 16L9 14M11 10L9 8L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/>
      </svg>
    </button>
  );
}
