/**
 * Puzzle generation logic for WordHive
 * Generates a deterministic daily puzzle based on the date
 */

import seedrandom from 'seedrandom';
import type { Puzzle, WordScore } from '../types/game';
import { calculateWordScore } from './scoring';
import wordList from '../data/words.json';

// Curated letter sets that produce good puzzles
const GOOD_LETTER_SETS = [
  { letters: ['a', 'e', 'i', 'n', 'r', 's', 't'], center: 'a' },
  { letters: ['a', 'e', 'r', 's', 't', 'l', 'n'], center: 'e' },
  { letters: ['a', 'e', 'o', 'r', 't', 'n', 's'], center: 'o' },
  { letters: ['a', 'i', 'o', 'n', 's', 't', 'r'], center: 'i' },
  { letters: ['e', 'a', 'r', 'l', 't', 's', 'n'], center: 'r' },
  { letters: ['a', 'e', 'i', 'l', 't', 's', 'n'], center: 't' },
  { letters: ['a', 'e', 'o', 'n', 'd', 'r', 's'], center: 'n' },
  { letters: ['a', 'e', 'i', 'r', 's', 'd', 'n'], center: 's' },
  { letters: ['a', 'o', 'e', 'l', 'r', 't', 's'], center: 'l' },
  { letters: ['a', 'e', 'i', 'g', 'n', 'r', 't'], center: 'g' },
];

/**
 * Generate a puzzle for a given date seed
 * @param dateSeed - String representation of date (e.g., "2025-11-17")
 * @returns A complete Puzzle object
 */
export function generatePuzzle(dateSeed: string): Puzzle {
  const rng = seedrandom(dateSeed);

  // Pick a good letter set from the curated list
  const letterSetIndex = Math.floor(rng() * GOOD_LETTER_SETS.length);
  const { letters, center } = GOOD_LETTER_SETS[letterSetIndex];

  const validWords = findValidWords(letters, center);

  return buildPuzzle(letters, center, validWords);
}

/**
 * Find all valid words that can be made from the given letters
 * Must include the center letter and be at least 4 characters
 */
function findValidWords(letters: string[], centerLetter: string): string[] {
  const letterSet = new Set(letters);

  return wordList.filter(word => {
    // Must be at least 4 letters
    if (word.length < 4) return false;

    // Must include center letter
    if (!word.includes(centerLetter)) return false;

    // All letters must be from the puzzle letters
    for (const char of word) {
      if (!letterSet.has(char)) return false;
    }

    return true;
  });
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
