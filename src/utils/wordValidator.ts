/**
 * Word validation logic for WordHive
 */

import type { Puzzle, ValidationResult } from '../types/game';

/**
 * Validate a submitted word against the puzzle rules
 * @param word - The word to validate
 * @param puzzle - The current puzzle
 * @param foundWords - Words already found
 * @returns Validation result with reason if invalid
 */
export function validateWord(
  word: string,
  puzzle: Puzzle,
  foundWords: string[]
): ValidationResult {
  const normalizedWord = word.toLowerCase().trim();

  // Check minimum length
  if (normalizedWord.length < 4) {
    return {
      valid: false,
      reason: 'Too short! Words must be at least 4 letters.',
    };
  }

  // Check if word uses center letter
  if (!normalizedWord.includes(puzzle.centerLetter)) {
    return {
      valid: false,
      reason: `Must use center letter "${puzzle.centerLetter.toUpperCase()}"!`,
    };
  }

  // Check if all letters are from puzzle
  const letterSet = new Set(puzzle.letters);
  for (const char of normalizedWord) {
    if (!letterSet.has(char)) {
      return {
        valid: false,
        reason: 'Invalid letters!',
      };
    }
  }

  // Check if word is in valid word list
  if (!puzzle.validWords.has(normalizedWord)) {
    return {
      valid: false,
      reason: 'Not in word list!',
    };
  }

  // Check if already found
  if (foundWords.includes(normalizedWord)) {
    return {
      valid: false,
      reason: 'Already found!',
    };
  }

  return { valid: true };
}
