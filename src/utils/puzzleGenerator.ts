/**
 * Puzzle generation logic for WordHive
 * Generates a deterministic daily puzzle based on the date
 */

import seedrandom from 'seedrandom';
import type { Puzzle, WordScore } from '../types/game';
import { calculateWordScore } from './scoring';
import wordList from '../data/words.json';

/**
 * Generate a puzzle for a given date seed
 * @param dateSeed - String representation of date (e.g., "2025-11-17")
 * @returns A complete Puzzle object
 */
export function generatePuzzle(dateSeed: string): Puzzle {
  const rng = seedrandom(dateSeed);

  // Try multiple times to find a valid puzzle
  for (let attempt = 0; attempt < 100; attempt++) {
    const letters = selectLetters(rng);
    const centerLetter = letters[Math.floor(rng() * letters.length)];

    const validWords = findValidWords(letters, centerLetter);

    // Ensure puzzle has enough words (at least 20)
    if (validWords.length >= 20) {
      return buildPuzzle(letters, centerLetter, validWords);
    }
  }

  // Fallback: use a known good set of letters
  return buildPuzzle(
    ['a', 'e', 'i', 'n', 'r', 's', 't'],
    'a',
    findValidWords(['a', 'e', 'i', 'n', 'r', 's', 't'], 'a')
  );
}

/**
 * Select 7 letters with good distribution
 * Includes vowels and common consonants
 */
function selectLetters(rng: () => number): string[] {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const commonConsonants = ['r', 's', 't', 'n', 'l', 'd', 'c', 'h', 'p', 'm', 'b', 'g', 'f'];

  const letters: string[] = [];

  // Pick 2-3 vowels
  const vowelCount = Math.floor(rng() * 2) + 2; // 2 or 3
  for (let i = 0; i < vowelCount; i++) {
    const vowel = vowels[Math.floor(rng() * vowels.length)];
    if (!letters.includes(vowel)) {
      letters.push(vowel);
    }
  }

  // Fill remaining with consonants
  while (letters.length < 7) {
    const consonant = commonConsonants[Math.floor(rng() * commonConsonants.length)];
    if (!letters.includes(consonant)) {
      letters.push(consonant);
    }
  }

  return letters;
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
