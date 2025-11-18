import '../styles/HelpModal.css';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <h2 className="modal-title">How to Play</h2>

        <div className="modal-section">
          <h3>Rules</h3>
          <ul>
            <li>Create words using the 7 letters</li>
            <li>Words must be at least 4 letters long</li>
            <li>Words must include the center letter (purple with pink border)</li>
            <li>Letters can be used more than once</li>
          </ul>
        </div>

        <div className="modal-section">
          <h3>Scoring</h3>
          <ul>
            <li><strong>4-letter words:</strong> 1 point</li>
            <li><strong>5+ letter words:</strong> 1 point per letter</li>
            <li><strong>Rarity bonus:</strong> 0-10 extra points based on how uncommon the word is</li>
            <li><strong>Pangrams:</strong> +10 bonus points for using all 7 letters!</li>
          </ul>
        </div>

        <div className="modal-section">
          <h3>Example</h3>
          <ul>
            <li>"WORD" (4 letters, common) = 1 + 0 = <strong>1 point</strong></li>
            <li>"WORLD" (5 letters, common) = 5 + 0 = <strong>5 points</strong></li>
            <li>"WONDER" (6 letters, rare) = 6 + 8 = <strong>14 points</strong></li>
            <li>"WORKING" (7 letters, pangram) = 7 + 3 + 10 = <strong>20 points</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
