/**
 * Scoring calculation logic for WordHive
 * Implements base score + rarity bonus + pangram bonus
 */

import type { WordScore } from '../types/game';
import wordFrequency from '../data/wordFrequency.json';

/**
 * Calculate the complete score for a word
 * @param word - The word to score
 * @param puzzleLetters - All 7 letters in the puzzle
 * @param allValidWords - All valid words in the puzzle (for rarity calculation)
 * @returns Complete WordScore breakdown
 */
export function calculateWordScore(
  word: string,
  puzzleLetters: string[],
  allValidWords: string[]
): WordScore {
  // Base score: 1 for 4-letter words, length for 5+ letter words
  const baseScore = word.length === 4 ? 1 : word.length;

  // Check if pangram (uses all 7 letters)
  const isPangram = isPangramWord(word, puzzleLetters);
  const pangramBonus = isPangram ? 10 : 0;

  // Calculate rarity bonus
  const { decile, bonus } = calculateRarityBonus(word, allValidWords);

  const totalScore = baseScore + bonus + pangramBonus;

  return {
    word,
    baseScore,
    rarityBonus: bonus,
    isPangram,
    pangramBonus,
    totalScore,
    rarityDecile: decile,
  };
}

/**
 * Check if a word uses all 7 letters in the puzzle
 */
function isPangramWord(word: string, puzzleLetters: string[]): boolean {
  const uniqueLetters = new Set(word.split(''));
  return puzzleLetters.every(letter => uniqueLetters.has(letter));
}

/**
 * Calculate rarity bonus based on word frequency decile
 * @param word - The word to check
 * @param allValidWords - All valid words in this puzzle
 * @returns Decile (1-10) and bonus (0-10)
 */
function calculateRarityBonus(
  word: string,
  allValidWords: string[]
): { decile: number; bonus: number } {
  // Get frequency ranks for all valid words in this puzzle
  const wordFreqs: Array<{ word: string; freq: number }> = allValidWords
    .map(w => ({
      word: w,
      freq: (wordFrequency as Record<string, number>)[w] || 999999,
    }))
    .sort((a, b) => a.freq - b.freq); // Sort by frequency rank (low to high = common to rare)

  // Find this word's rank in the puzzle
  const wordRank = wordFreqs.findIndex(w => w.word === word);

  if (wordRank === -1) {
    // Word not found (shouldn't happen), default to middle decile
    return { decile: 5, bonus: 5 };
  }

  // Calculate decile (1-10)
  const totalWords = wordFreqs.length;
  const decile = Math.min(10, Math.floor((wordRank / totalWords) * 10) + 1);

  // Rarity bonus: most common (decile 1) = 0 bonus, rarest (decile 10) = 10 bonus
  const bonus = decile - 1;

  return { decile, bonus };
}

/**
 * Determine if a word is "rare" enough to show congratulations
 * Currently: decile 8, 9, or 10 (top 30% rarest)
 */
export function isRareWord(rarityDecile: number): boolean {
  return rarityDecile >= 8;
}

/**
 * Get congratulations message for a rare word
 */
export function getRareWordMessage(rarityDecile: number, isPangram: boolean): string {
  if (isPangram) {
    return 'PANGRAM! 🎉';
  }

  if (rarityDecile === 10) {
    return 'Amazing! 🌟';
  } else if (rarityDecile === 9) {
    return 'Excellent! ⭐';
  } else if (rarityDecile === 8) {
    return 'Nice! ✨';
  }

  return '';
}
