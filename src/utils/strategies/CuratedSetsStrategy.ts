/**
 * Curated Letter Sets Strategy
 *
 * Generates random 7-letter combinations with constraints:
 * - 7 unique letters (no repeats)
 * - At least one vowel
 * - Uses seeded RNG for daily determinism
 *
 * Word selection:
 * - Filters by puzzle letters + center letter requirement
 * - Sorts by frequency (most common first)
 * - Takes top 100 most common words
 * - Auto-expands with word variants (plurals, -ed, -ing, etc.)
 *   immediately after each base word for consistent rarity scoring
 */

import type { PuzzleStrategy } from './PuzzleStrategy';
import wordList from '../../data/words.json';
import wordFrequency from '../../data/wordFrequency.json';

const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const ALL_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

export class CuratedSetsStrategy implements PuzzleStrategy {
  readonly name = 'curated';
  readonly description = 'Generates random 7 letters with at least one vowel';

  generateLetterSet(rng: () => number): { letters: string[]; center: string } {
    let letters: string[] = [];
    let hasVowel = false;

    // Generate 7 unique random letters, ensuring at least one vowel
    const availableLetters = [...ALL_LETTERS];

    while (letters.length < 7) {
      const index = Math.floor(rng() * availableLetters.length);
      const letter = availableLetters[index];

      letters.push(letter);
      availableLetters.splice(index, 1); // Remove to prevent duplicates

      if (VOWELS.includes(letter)) {
        hasVowel = true;
      }
    }

    // If no vowel was selected, replace a random consonant with a random vowel
    if (!hasVowel) {
      const consonantIndex = Math.floor(rng() * 7);
      const vowelIndex = Math.floor(rng() * VOWELS.length);
      letters[consonantIndex] = VOWELS[vowelIndex];
    }

    // Pick a random letter as the center (prefer vowels for better word formation)
    const vowelsInSet = letters.filter(l => VOWELS.includes(l));
    let center: string;

    if (vowelsInSet.length > 0 && rng() > 0.3) {
      // 70% chance to pick a vowel as center if available
      center = vowelsInSet[Math.floor(rng() * vowelsInSet.length)];
    } else {
      // Otherwise pick any letter
      center = letters[Math.floor(rng() * letters.length)];
    }

    return { letters, center };
  }

  findValidWords(letters: string[], centerLetter: string): string[] {
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
}
