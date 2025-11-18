import '../styles/ScorePanel.css';

interface ScorePanelProps {
  score: number;
  maxScore: number;
  foundWords: number;
  totalWords: number;
}

export function ScorePanel({ score, maxScore }: ScorePanelProps) {
  const progress = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div className="score-panel">
      <div className="score-item">
        <div className="score-label">Score</div>
        <div className="score-value">{score} / {maxScore}</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
