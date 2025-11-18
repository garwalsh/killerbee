import '../styles/ShuffleButton.css';

interface ShuffleButtonProps {
  onClick: () => void;
}

export function ShuffleButton({ onClick }: ShuffleButtonProps) {
  return (
    <button className="shuffle-button" onClick={onClick} aria-label="Shuffle letters">
      <svg className="shuffle-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        {/* Pixel art circular arrows */}
        <rect x="6" y="0" width="2" height="2" fill="currentColor"/>
        <rect x="8" y="0" width="2" height="2" fill="currentColor"/>
        <rect x="10" y="2" width="2" height="2" fill="currentColor"/>
        <rect x="12" y="4" width="2" height="2" fill="currentColor"/>
        <rect x="14" y="6" width="2" height="2" fill="currentColor"/>
        <rect x="14" y="8" width="2" height="2" fill="currentColor"/>
        <rect x="12" y="10" width="2" height="2" fill="currentColor"/>
        <rect x="10" y="12" width="2" height="2" fill="currentColor"/>
        <rect x="8" y="14" width="2" height="2" fill="currentColor"/>
        <rect x="6" y="14" width="2" height="2" fill="currentColor"/>
        <rect x="4" y="12" width="2" height="2" fill="currentColor"/>
        <rect x="2" y="10" width="2" height="2" fill="currentColor"/>
        <rect x="0" y="8" width="2" height="2" fill="currentColor"/>
        <rect x="0" y="6" width="2" height="2" fill="currentColor"/>
        <rect x="2" y="4" width="2" height="2" fill="currentColor"/>
        <rect x="4" y="2" width="2" height="2" fill="currentColor"/>
        {/* Arrow heads */}
        <rect x="10" y="0" width="2" height="2" fill="currentColor"/>
        <rect x="12" y="2" width="2" height="2" fill="currentColor"/>
        <rect x="2" y="12" width="2" height="2" fill="currentColor"/>
        <rect x="4" y="14" width="2" height="2" fill="currentColor"/>
      </svg>
    </button>
  );
}
