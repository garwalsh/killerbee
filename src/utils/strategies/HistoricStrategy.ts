/**
 * Historic Spelling Bee Strategy
 *
 * Uses real puzzles from NYT Spelling Bee with their actual word lists.
 * Words are pre-ordered by the original game's difficulty/rarity.
 *
 * Rarity scoring:
 * - Splits word list into 5 roughly equal groups based on position
 * - Group 1 (first words, rarest): rarity score 10
 * - Group 2: rarity score 7
 * - Group 3: rarity score 5
 * - Group 4: rarity score 3
 * - Group 5 (last words, most common): rarity score 1
 *
 * Word list length varies per puzzle, grouping adjusts dynamically.
 */

import type { PuzzleStrategy } from './PuzzleStrategy';
import historicPuzzlesData from '../../data/historicPuzzles.json';

interface HistoricPuzzle {
  date: string;
  letters: string[];
  center: string;
  words: string[];
}

interface HistoricPuzzlesData {
  version: string;
  source: string;
  description: string;
  puzzles: HistoricPuzzle[];
}

const historicPuzzles = historicPuzzlesData as HistoricPuzzlesData;

export class HistoricStrategy implements PuzzleStrategy {
  readonly name = 'historic';
  readonly description = 'Uses real NYT Spelling Bee puzzles with original word lists';

  generateLetterSet(rng: () => number): { letters: string[]; center: string } {
    // Select a puzzle based on the RNG (allows rotating through available puzzles)
    const puzzleIndex = Math.floor(rng() * historicPuzzles.puzzles.length);
    const puzzle = historicPuzzles.puzzles[puzzleIndex];

    return {
      letters: puzzle.letters,
      center: puzzle.center,
    };
  }

  findValidWords(letters: string[], centerLetter: string): string[] {
    // Find the matching historic puzzle by letters and center
    const puzzle = historicPuzzles.puzzles.find(
      p =>
        p.center === centerLetter &&
        p.letters.length === letters.length &&
        p.letters.every(l => letters.includes(l))
    );

    if (!puzzle) {
      console.warn(
        `No historic puzzle found for letters [${letters.join(', ')}] with center '${centerLetter}'`
      );
      return [];
    }

    // Return the pre-ordered word list as-is
    // Position in list determines rarity (handled by scoring system)
    return puzzle.words;
  }
}
