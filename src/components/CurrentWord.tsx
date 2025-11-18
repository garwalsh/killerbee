import '../styles/CurrentWord.css';

interface CurrentWordProps {
  word: string;
}

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
