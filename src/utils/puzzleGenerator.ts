/**
 * Puzzle generation logic for WordHive
 * Generates a deterministic daily puzzle based on the date
 */

import seedrandom from 'seedrandom';
import type { Puzzle, WordScore } from '../types/game';
import { calculateWordScore } from './scoring';
import wordList from '../data/words.json';
import wordFrequency from '../data/wordFrequency.json';

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
 * Limited to the 100 most common words for reasonable puzzle difficulty
 */
function findValidWords(letters: string[], centerLetter: string): string[] {
  const letterSet = new Set(letters);
  const freqMap = wordFrequency as Record<string, number>;

  // Find all matching words
  const allValidWords = wordList.filter(word => {
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

  // Sort by frequency (most common first) and take top 100
  const sortedWords = allValidWords
    .map(word => ({
      word,
      freq: freqMap[word] || 999999, // Unknown words get high rank (rare)
    }))
    .sort((a, b) => a.freq - b.freq) // Lower frequency rank = more common
    .slice(0, 100) // Take only the 100 most common
    .map(item => item.word);

  // Auto-include common variants (plurals, -ed, -ing, etc.) immediately after base words
  // This ensures variants get similar rarity scores (adjacent in the list)
  const expandedWords: string[] = [];

  for (const word of sortedWords) {
    expandedWords.push(word);

    // Try common suffixes
    const variants = [
      word + 's',      // plural: word -> words
      word + 'es',     // plural: box -> boxes
      word + 'ed',     // past tense: walk -> walked
      word + 'ing',    // gerund: walk -> walking
      word + 'er',     // comparative: fast -> faster
      word + 'est',    // superlative: fast -> fastest
      word + 'ly',     // adverb: quick -> quickly
    ];

    // If word ends in 'e', try dropping it for -ed/-ing
    if (word.endsWith('e')) {
      variants.push(word.slice(0, -1) + 'ed');   // hope -> hoped
      variants.push(word.slice(0, -1) + 'ing');  // hope -> hoping
    }

    // If word ends in 'y', try -ies plural
    if (word.endsWith('y') && word.length > 3) {
      variants.push(word.slice(0, -1) + 'ies'); // story -> stories
    }

    // Add valid variants immediately after the base word
    for (const variant of variants) {
      if (allValidWords.includes(variant)) {
        expandedWords.push(variant);
      }
    }
  }

  return expandedWords;
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
