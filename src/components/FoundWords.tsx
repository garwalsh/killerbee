/**
 * Component for displaying the list of successfully found words
 */

import '../styles/FoundWords.css';

interface FoundWordsProps {
  words: string[];
}

/**
 * Displays all words that the player has successfully found
 * Words are displayed alphabetically for easy scanning
 */
export function FoundWords({ words }: FoundWordsProps) {
  if (words.length === 0) {
    return (
      <div className="found-words">
        <div className="found-words-empty">No words found yet...</div>
      </div>
    );
  }

  // Sort words alphabetically
  const sortedWords = [...words].sort((a, b) => a.localeCompare(b));

  return (
    <div className="found-words">
      <div className="found-words-title">Found Words</div>
      <div className="found-words-list">
        {sortedWords.map((word, index) => (
          <div key={index} className="found-word">
            {word.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}
