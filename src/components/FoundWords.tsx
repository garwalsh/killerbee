import '../styles/FoundWords.css';

interface FoundWordsProps {
  words: string[];
}

export function FoundWords({ words }: FoundWordsProps) {
  if (words.length === 0) {
    return (
      <div className="found-words">
        <div className="found-words-empty">No words found yet...</div>
      </div>
    );
  }

  return (
    <div className="found-words">
      <div className="found-words-title">Found Words</div>
      <div className="found-words-list">
        {words.map((word, index) => (
          <div key={index} className="found-word">
            {word.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}
