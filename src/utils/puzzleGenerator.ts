/**
 * Puzzle generation logic for WordHive
 * Generates a deterministic daily puzzle based on the date
 *
 * Uses a strategy pattern to support multiple puzzle generation methods.
 * The active strategy can be configured via:
 * 1. URL parameter: ?strategy=curated (for local testing)
 * 2. Environment variable: VITE_PUZZLE_STRATEGY (for deployment)
 */

import seedrandom from 'seedrandom';
import type { Puzzle, WordScore } from '../types/game';
import type { PuzzleStrategy } from './strategies/PuzzleStrategy';
import { CuratedSetsStrategy } from './strategies/CuratedSetsStrategy';
import { HistoricStrategy } from './strategies/HistoricStrategy';
import { calculateWordScore } from './scoring';

/**
 * Get the active puzzle generation strategy
 * Priority: URL parameter > Environment variable > Default (curated)
 */
function getActiveStrategy(): PuzzleStrategy {
  // Check URL parameter first (for local testing)
  const params = new URLSearchParams(window.location.search);
  const urlStrategy = params.get('strategy');

  // Fall back to environment variable (for deployment)
  const envStrategy = import.meta.env.VITE_PUZZLE_STRATEGY || 'curated';

  const strategyName = urlStrategy || envStrategy;

  // Return appropriate strategy instance
  switch (strategyName) {
    case 'curated':
      return new CuratedSetsStrategy();
    case 'historic':
      return new HistoricStrategy();
    default:
      console.warn(`Unknown strategy "${strategyName}", falling back to curated`);
      return new CuratedSetsStrategy();
  }
}

/**
 * Generate a puzzle for a given date seed
 * @param dateSeed - String representation of date (e.g., "2025-11-17")
 * @returns A complete Puzzle object
 */
export function generatePuzzle(dateSeed: string): Puzzle {
  const rng = seedrandom(dateSeed);
  const strategy = getActiveStrategy();

  // Use the strategy to generate letters and find valid words
  const { letters, center } = strategy.generateLetterSet(rng);
  const validWords = strategy.findValidWords(letters, center);

  return buildPuzzle(letters, center, validWords);
}

/**
 * Build a complete Puzzle object with all scoring calculated
 */
function buildPuzzle(
  letters: string[],
  centerLetter: string,
  validWords: string[]
): Puzzle {
  const validWordSet = new Set(validWords);
  const wordScores = new Map<string, WordScore>();

  let maxScore = 0;

  // Calculate scores for all valid words
  for (const word of validWords) {
    const score = calculateWordScore(word, letters, validWords);
    wordScores.set(word, score);
    maxScore += score.totalScore;
  }

  return {
    letters,
    centerLetter,
    validWords: validWordSet,
    wordScores,
    maxScore,
    totalWords: validWords.length,
  };
}

/**
 * Get today's date as a seed string (YYYY-MM-DD in local timezone)
 */
export function getTodayDateSeed(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
