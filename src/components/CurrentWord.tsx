import '../styles/CurrentWord.css';

interface CurrentWordProps {
  word: string;
}

export function CurrentWord({ word }: CurrentWordProps) {
  return (
    <div className="current-word">
      <div className="word-display">
        {word.toUpperCase() || <span className="placeholder">Type or click letters</span>}
      </div>
    </div>
  );
}
